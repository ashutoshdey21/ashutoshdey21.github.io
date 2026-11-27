import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { entryMd, mdResponse } from '../../lib/md';

export async function getStaticPaths() {
  return (await getCollection('notes')).map((e) => ({ params: { slug: e.id }, props: { e } }));
}
export const GET: APIRoute = ({ props }) => mdResponse(entryMd('notes', props.e));
