import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const roots = ['apps/web/src', 'apps/relay', 'README.md', 'DESIGN.md', '.kiro/steering', '.kiro/specs'];
const exts = /\.(svelte|ts|css|html|md|mjs|js)$/;
const EM_DASH = '\u2014';
const hits = [];

function walk(path) {
	let stat;
	try {
		stat = statSync(path);
	} catch {
		return;
	}
	if (stat.isDirectory()) {
		for (const name of readdirSync(path)) walk(join(path, name));
		return;
	}
	if (!exts.test(path)) return;
	readFileSync(path, 'utf8')
		.split('\n')
		.forEach((line, i) => {
			if (line.includes(EM_DASH)) hits.push(`${path}:${i + 1}`);
		});
}

roots.forEach(walk);

if (hits.length > 0) {
	const reason = `Em dashes are banned (DESIGN.md, antislop R-02). Replace them with a period, comma, colon, or parentheses in: ${hits.join(', ')}`;
	process.stdout.write(JSON.stringify({ decision: 'block', reason }));
}
