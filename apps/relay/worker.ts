// Wisp v1 relay for v86. The guest's TCP/IP stack runs in the browser; this
// Worker only opens the outbound TCP sockets it asks for.
// @ts-expect-error provided by the Workers runtime
import { connect } from 'cloudflare:sockets';

const ALLOWED_ORIGINS: string[] = [
	'http://localhost:5173',
	'http://localhost:4173',
	'https://necros.kuncen.workers.dev'
];
const MAX_STREAMS = 16;
const BUFFER = 128;
const BLOCKED_PORTS = new Set([25, 465, 587]);

const CONNECT = 0x01;
const DATA = 0x02;
const CONTINUE = 0x03;
const CLOSE = 0x04;

const REASON = { voluntary: 0x02, unexpected: 0x03, unreachable: 0x42, blocked: 0x48, throttled: 0x49 };

const PRIVATE_V4 = /^(10\.|127\.|0\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/;

function blockedHost(host: string) {
	const h = host.toLowerCase();
	return PRIVATE_V4.test(h) || h === 'localhost' || h.endsWith('.local') || h.includes(':');
}

function packet(type: number, stream: number, payload: Uint8Array) {
	const out = new Uint8Array(5 + payload.length);
	out[0] = type;
	new DataView(out.buffer).setUint32(1, stream, true);
	out.set(payload, 5);
	return out;
}

const continuePacket = (stream: number) => {
	const p = new Uint8Array(4);
	new DataView(p.buffer).setUint32(0, BUFFER, true);
	return packet(CONTINUE, stream, p);
};

const closePacket = (stream: number, reason: number) => packet(CLOSE, stream, Uint8Array.of(reason));

type Stream = { writer: WritableStreamDefaultWriter<Uint8Array>; socket: { close(): Promise<void> } };

export default {
	async fetch(request: Request): Promise<Response> {
		if (request.headers.get('Upgrade') !== 'websocket') {
			return new Response('Wisp relay', { status: 426 });
		}
		const origin = request.headers.get('Origin');
		if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
			return new Response('Forbidden', { status: 403 });
		}

		const pair = new WebSocketPair();
		const [client, server] = [pair[0], pair[1]];
		server.accept();
		const streams = new Map<number, Stream>();

		const send = (data: Uint8Array) => {
			try {
				server.send(data);
			} catch {}
		};
		const drop = (id: number, reason: number) => {
			const s = streams.get(id);
			if (!s) return;
			streams.delete(id);
			s.socket.close().catch(() => {});
			send(closePacket(id, reason));
		};

		send(continuePacket(0));

		server.addEventListener('message', async (event: MessageEvent) => {
			if (!(event.data instanceof ArrayBuffer)) return;
			const msg = new Uint8Array(event.data);
			if (msg.length < 5) return;
			const type = msg[0];
			const id = new DataView(msg.buffer, msg.byteOffset).getUint32(1, true);
			const body = msg.subarray(5);

			if (type === CONNECT) {
				if (body.length < 4 || body[0] !== 1) return send(closePacket(id, REASON.blocked));
				const port = body[1] | (body[2] << 8);
				const host = new TextDecoder().decode(body.subarray(3));
				if (streams.size >= MAX_STREAMS) return send(closePacket(id, REASON.throttled));
				if (BLOCKED_PORTS.has(port) || blockedHost(host)) return send(closePacket(id, REASON.blocked));
				try {
					const socket = connect({ hostname: host, port });
					streams.set(id, { writer: socket.writable.getWriter(), socket });
					send(continuePacket(id));
					const reader = socket.readable.getReader();
					(async () => {
						try {
							for (;;) {
								const { value, done } = await reader.read();
								if (done) break;
								send(packet(DATA, id, value));
							}
							drop(id, REASON.voluntary);
						} catch {
							drop(id, REASON.unreachable);
						}
					})();
				} catch {
					send(closePacket(id, REASON.unreachable));
				}
			} else if (type === DATA) {
				const s = streams.get(id);
				if (!s) return;
				try {
					await s.writer.write(body.slice());
					send(continuePacket(id));
				} catch {
					drop(id, REASON.unexpected);
				}
			} else if (type === CLOSE) {
				drop(id, REASON.voluntary);
			}
		});

		server.addEventListener('close', () => {
			for (const id of [...streams.keys()]) drop(id, REASON.voluntary);
		});

		return new Response(null, { status: 101, webSocket: client });
	}
};
