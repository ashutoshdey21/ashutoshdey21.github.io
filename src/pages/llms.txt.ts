import type { APIRoute } from 'astro';
import { positioning, allContent, SITE, profile } from '../lib/data';

export const GET: APIRoute = async () => {
  const { work, projects, notes } = await allContent();
  const body = `# Ashutosh Dey

> ${positioning.descriptor}. ${positioning.headline}

This is the personal site of Ashutosh Dey, ${profile.jobTitle} at ${profile.experience[0].org}. Home, about, every case study, project and note has a Markdown twin (the page URL with .md instead of the trailing slash). Full content in one file: ${SITE}/llms-full.txt. Machine-readable profile: ${SITE}/facts.json.

## Profile

- [Home](${SITE}/index.md): through-line, selected results, featured work
- [About](${SITE}/about.md): background, experience, education, skills, what he is looking for

## Case studies

${work.map((w) => `- [${w.data.title}](${SITE}/work/${w.id}.md): ${w.data.summary}`).join('\n')}

## Projects

${projects.map((p) => `- [${p.data.title}](${SITE}/projects/${p.id}.md): ${p.data.summary}`).join('\n')}

## Notes

${notes.map((n) => `- [${n.data.title}](${SITE}/notes/${n.id}.md): ${n.data.summary}`).join('\n')}

## Identity

- GitHub: ${profile.links.github}
- LinkedIn: ${profile.links.linkedin}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
