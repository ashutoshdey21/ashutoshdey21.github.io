import { positioning, profile, allContent, SITE } from './data';
import { LENSES } from '../content.config';

const ym = (d: string) => (d === 'present' ? 'present' : d);
const lensList = (t: (keyof typeof LENSES)[]) => t.map((x) => LENSES[x]).join(', ');

export function entryMd(kind: 'work' | 'projects', e: any) {
  const d = e.data;
  const meta = [
    `Author: Ashutosh Dey (${SITE}/)`,
    `URL: ${SITE}/${kind}/${e.id}/`,
    d.context && `Context: ${d.context}`,
    `Themes: ${lensList(d.themes)}`,
    d.stack?.length && `Stack: ${d.stack.join(', ')}`,
    d.repo && `Repository: ${d.repo}`,
    'License: CC BY 4.0',
  ].filter(Boolean).map((l) => `- ${l}`).join('\n');
  return `# ${d.title}\n\n> ${d.summary}\n\n${meta}\n\n${e.body.trim()}\n`;
}

export async function homeMd() {
  const { work } = await allContent();
  const featured = positioning.featured.map((id: string) => work.find((w) => w.id === id)).filter(Boolean);
  return `# Ashutosh Dey

> ${positioning.descriptor}

${positioning.headline}

${positioning.throughline}

## Selected results

${positioning.results.map((r: any) => `- **${r.value}** ${r.label}`).join('\n')}

## Featured work

${featured.map((w: any) => `- [${w.data.title}](${SITE}/work/${w.id}/): ${w.data.summary}`).join('\n')}

## ${positioning.ai.heading}

${positioning.ai.body}

## Links

- GitHub: ${profile.links.github}
- LinkedIn: ${profile.links.linkedin}
`;
}

export function aboutMd() {
  return `# About Ashutosh Dey

> ${positioning.descriptor}

${positioning.throughline}

## What I'm looking for

${positioning.looking_for}

Contact: LinkedIn (${profile.links.linkedin}). Code: GitHub (${profile.links.github}).

## Experience

${profile.experience.map((e: any) => `- ${e.title}, ${e.org} (${ym(e.start)} to ${ym(e.end)})${e.note ? `. ${e.note}` : ''}`).join('\n')}

## Education

${profile.education.map((e: any) => `- ${e.degree}, ${e.org} (${e.end})`).join('\n')}

## Skills

${Object.entries(profile.skills).map(([k, v]) => `- ${k}: ${(v as string[]).join(', ')}`).join('\n')}

## Certifications

${profile.certifications.map((c: any) => `- ${c.name}, ${c.issuer} (${c.date})`).join('\n')}
`;
}

export const mdResponse = (body: string) =>
  new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
