import { error } from '@sveltejs/kit';
import { findOS, osList } from '#lib/os.ts';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => osList.map((o) => ({ slug: o.slug }));

export const load: PageLoad = ({ params }) => {
	const os = findOS(params.slug);
	if (!os) error(404, 'OS not found');
	return { os };
};
