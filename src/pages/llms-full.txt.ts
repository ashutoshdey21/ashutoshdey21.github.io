import type { APIRoute } from 'astro';
import { allContent } from '../lib/data';
import { homeMd, aboutMd, entryMd } from '../lib/md';

export const GET: APIRoute = async () => {
  const { work, projects, notes } = await allContent();
  const parts = [await homeMd(), aboutMd(), ...work.map((w) => entryMd('work', w)), ...projects.map((p) => entryMd('projects', p)), ...notes.map((n) => entryMd('notes', n))];
  return new Response(parts.join('\n---\n\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
