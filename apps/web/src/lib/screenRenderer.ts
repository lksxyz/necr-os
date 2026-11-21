export type ScreenEffect = 'sharp' | 'crt' | 'phosphor';

export const screenEffects: { id: ScreenEffect; label: string }[] = [
	{ id: 'sharp', label: 'Sharp' },
	{ id: 'crt', label: 'CRT' },
	{ id: 'phosphor', label: 'Green phosphor' }
];

export type ScreenRenderer = {
	canvas: HTMLCanvasElement;
	resize(width: number, height: number): void;
	draw(source: HTMLCanvasElement, effect: ScreenEffect): void;
	destroy(): void;
};

const VERTEX = `#version 300 es
out vec2 vUv;
void main() {
	vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
	vUv = vec2(p.x, 1.0 - p.y);
	gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uSrc;
uniform vec2 uSrcSize;
uniform vec2 uOutSize;
uniform int uEffect;

vec3 sharp(vec2 uv) {
	vec2 scale = max(uOutSize / uSrcSize, vec2(1.0));
	vec2 texel = uv * uSrcSize;
	vec2 base = floor(texel);
	vec2 d = fract(texel) - 0.5;
	vec2 range = 0.5 - 0.5 / scale;
	vec2 f = (d - clamp(d, -range, range)) * scale + 0.5;
	return texture(uSrc, (base + f) / uSrcSize).rgb;
}

vec2 curve(vec2 uv) {
	vec2 c = uv * 2.0 - 1.0;
	vec2 offset = abs(c.yx) / 6.0;
	c += c * offset * offset;
	return c * 0.5 + 0.5;
}

float scanline(vec2 uv) {
	float scale = uOutSize.y / uSrcSize.y;
	float strength = clamp((scale - 1.2) / 1.8, 0.0, 1.0) * 0.4;
	float y = fract(uv.y * uSrcSize.y);
	float s = 0.5 + 0.5 * cos(6.2831853 * (y - 0.5));
	return 1.0 - strength * (1.0 - s);
}

void main() {
	if (uEffect == 0) {
		outColor = vec4(sharp(vUv), 1.0);
		return;
	}
	vec2 uv = curve(vUv);
	if (any(lessThan(uv, vec2(0.0))) || any(greaterThan(uv, vec2(1.0)))) {
		outColor = vec4(0.0, 0.0, 0.0, 1.0);
		return;
	}
	vec3 col = sharp(uv);
	if (uEffect == 2) {
		float l = dot(col, vec3(0.299, 0.587, 0.114));
		col = vec3(0.25, 1.0, 0.45) * l;
	} else {
		float m = mod(gl_FragCoord.x, 3.0);
		col *= vec3(m < 1.0 ? 1.0 : 0.88, m >= 1.0 && m < 2.0 ? 1.0 : 0.88, m >= 2.0 ? 1.0 : 0.88);
	}
	col *= scanline(uv);
	vec2 v = uv * (1.0 - uv.yx);
	col *= pow(v.x * v.y * 16.0, 0.12) * 1.12;
	outColor = vec4(col, 1.0);
}`;

const effectIndex: Record<ScreenEffect, number> = { sharp: 0, crt: 1, phosphor: 2 };

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
	const shader = gl.createShader(type);
	if (!shader) return null;
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error(gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}

export function createScreenRenderer(onLost: () => void): ScreenRenderer | null {
	const canvas = document.createElement('canvas');
	canvas.className = 'gl-out';
	const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, depth: false });
	if (!gl) return null;

	const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
	const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
	const program = gl.createProgram();
	if (!vs || !fs || !program) return null;
	gl.attachShader(program, vs);
	gl.attachShader(program, fs);
	gl.linkProgram(program);
	gl.deleteShader(vs);
	gl.deleteShader(fs);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error(gl.getProgramInfoLog(program));
		return null;
	}

	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	const vao = gl.createVertexArray();
	const uSrc = gl.getUniformLocation(program, 'uSrc');
	const uSrcSize = gl.getUniformLocation(program, 'uSrcSize');
	const uOutSize = gl.getUniformLocation(program, 'uOutSize');
	const uEffect = gl.getUniformLocation(program, 'uEffect');

	let lost = false;
	let destroyed = false;
	canvas.addEventListener('webglcontextlost', (e) => {
		e.preventDefault();
		lost = true;
		if (!destroyed) onLost();
	});

	return {
		canvas,
		resize(width, height) {
			const dpr = window.devicePixelRatio || 1;
			canvas.width = Math.max(1, Math.round(width * dpr));
			canvas.height = Math.max(1, Math.round(height * dpr));
		},
		draw(source, effect) {
			if (lost || !source.width || !source.height) return;
			gl.viewport(0, 0, canvas.width, canvas.height);
			gl.useProgram(program);
			gl.bindVertexArray(vao);
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
			gl.uniform1i(uSrc, 0);
			gl.uniform2f(uSrcSize, source.width, source.height);
			gl.uniform2f(uOutSize, canvas.width, canvas.height);
			gl.uniform1i(uEffect, effectIndex[effect]);
			gl.drawArrays(gl.TRIANGLES, 0, 3);
		},
		destroy() {
			destroyed = true;
			if (!lost) {
				gl.deleteTexture(texture);
				gl.deleteVertexArray(vao);
				gl.deleteProgram(program);
				gl.getExtension('WEBGL_lose_context')?.loseContext();
			}
			canvas.remove();
		}
	};
}
