const DB = 'necros';
const STORE = 'states';

export type SavedState = { buffer: ArrayBuffer; savedAt: number };
export type SavedInfo = { savedAt: number; size: number };

function open(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB, 1);
		req.onupgradeneeded = () => req.result.createObjectStore(STORE);
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}

async function run<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
	const db = await open();
	try {
		return await new Promise<T>((resolve, reject) => {
			const tx = db.transaction(STORE, mode);
			const req = fn(tx.objectStore(STORE));
			tx.oncomplete = () => resolve(req.result);
			tx.onerror = () => reject(tx.error);
			tx.onabort = () => reject(tx.error);
		});
	} finally {
		db.close();
	}
}

export async function saveState(slug: string, buffer: ArrayBuffer) {
	await navigator.storage?.persist?.().catch(() => false);
	const value: SavedState = { buffer, savedAt: Date.now() };
	await run('readwrite', (s) => s.put(value, slug));
}

export async function loadState(slug: string) {
	return ((await run('readonly', (s) => s.get(slug))) as SavedState | undefined) ?? null;
}

export async function stateInfo(slug: string): Promise<SavedInfo | null> {
	const saved = await loadState(slug);
	return saved ? { savedAt: saved.savedAt, size: saved.buffer.byteLength } : null;
}

export async function deleteState(slug: string) {
	await run('readwrite', (s) => s.delete(slug));
}
