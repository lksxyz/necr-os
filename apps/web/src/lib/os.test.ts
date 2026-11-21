import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { findOS, formatMB, imageBytes, loadsInParts, osList, type RetroOS } from '#lib/os.ts';

const size = fc.integer({ min: 1, max: 4_000_000_000 });
const image = fc.record({ url: fc.constant('/images/x.img'), size });

const boot = fc.record(
	{
		fda: image,
		cdrom: image,
		hda: fc.record({ url: fc.constant('/images/x.img'), size, partSize: fc.option(size, { nil: undefined }) }),
		bzimage: image,
		memoryMB: fc.integer({ min: 1, max: 1024 })
	},
	{ requiredKeys: ['memoryMB'] }
);

const machine = boot.map((b): RetroOS => ({ ...osList[0], boot: b }));

describe('catalog data', () => {
	it('is not empty', () => {
		expect(osList.length).toBeGreaterThan(0);
	});

	it('has unique, URL-safe slugs', () => {
		const slugs = osList.map((os) => os.slug);
		expect(new Set(slugs).size).toBe(slugs.length);
		for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
	});

	it('uses a plausible integer release year', () => {
		for (const os of osList) {
			expect(Number.isInteger(os.year)).toBe(true);
			expect(os.year).toBeGreaterThanOrEqual(1970);
			expect(os.year).toBeLessThanOrEqual(2026);
		}
	});

	it('has an https source URL, and non-empty text fields without em dashes', () => {
		for (const os of osList) {
			expect(new URL(os.source).protocol).toBe('https:');
			for (const field of [os.name, os.maker, os.license, os.note, os.hint]) {
				expect(field.trim().length).toBeGreaterThan(0);
				expect(field).not.toContain('\u2014');
			}
		}
	});

	it('has at least one boot medium and positive image sizes', () => {
		for (const os of osList) {
			const { fda, cdrom, hda, bzimage } = os.boot;
			expect(fda ?? cdrom ?? hda ?? bzimage).toBeDefined();
			for (const img of [fda, cdrom, hda, bzimage]) if (img) expect(img.size).toBeGreaterThan(0);
			expect(os.boot.memoryMB).toBeGreaterThan(0);
		}
	});
});

describe('findOS', () => {
	it('returns the machine for every catalog slug', () => {
		for (const os of osList) expect(findOS(os.slug)).toBe(os);
	});

	it('returns undefined for any slug not in the catalog', () => {
		const known = new Set(osList.map((os) => os.slug));
		fc.assert(
			fc.property(fc.string(), (slug) => {
				fc.pre(!known.has(slug));
				expect(findOS(slug)).toBeUndefined();
			})
		);
	});
});

describe('imageBytes', () => {
	it('equals the sum of the sizes of the present images', () => {
		fc.assert(
			fc.property(machine, (os) => {
				const { fda, cdrom, hda, bzimage } = os.boot;
				const expected = [fda, cdrom, hda, bzimage].reduce((n, img) => n + (img?.size ?? 0), 0);
				expect(imageBytes(os)).toBe(expected);
				expect(imageBytes(os)).toBeGreaterThanOrEqual(0);
			})
		);
	});
});

describe('loadsInParts', () => {
	it('is true exactly when the hard disk has a non-zero partSize', () => {
		fc.assert(
			fc.property(machine, (os) => {
				expect(loadsInParts(os)).toBe(Boolean(os.boot.hda?.partSize));
			})
		);
	});
});

describe('formatMB', () => {
	it('prints a plain non-negative number within rounding distance of the true size', () => {
		fc.assert(
			fc.property(fc.integer({ min: 0, max: 4_000_000_000 }), (bytes) => {
				const text = formatMB(bytes);
				expect(text).toMatch(/^\d+(\.\d)?$/);
				const mb = bytes / 1048576;
				expect(Math.abs(Number(text) - mb)).toBeLessThanOrEqual(0.5);
			})
		);
	});

	it('is monotonic', () => {
		fc.assert(
			fc.property(fc.integer({ min: 0, max: 2_000_000_000 }), fc.integer({ min: 0, max: 2_000_000_000 }), (a, b) => {
				const [lo, hi] = a <= b ? [a, b] : [b, a];
				expect(Number(formatMB(lo))).toBeLessThanOrEqual(Number(formatMB(hi)));
			})
		);
	});
});
