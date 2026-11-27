import type { APIRoute } from 'astro';
import { positioning, profile, allContent, SITE } from '../lib/data';
import { LENSES } from '../content.config';

export const GET: APIRoute = async () => {
  const { work, projects, notes } = await allContent();
  const facts = {
    name: profile.name,
    descriptor: positioning.descriptor,
    headline: positioning.headline,
    jobTitle: profile.jobTitle,
    location: profile.location,
    url: profile.url,
    sameAs: [profile.links.github, profile.links.linkedin],
    contact: { linkedin: profile.links.linkedin, github: profile.links.github },
    lookingFor: positioning.looking_for,
    experience: profile.experience,
    education: profile.education,
    skills: profile.skills,
    certifications: profile.certifications,
    selectedResults: positioning.results,
    caseStudies: work.map((w) => ({ title: w.data.title, url: `${SITE}/work/${w.id}/`, markdown: `${SITE}/work/${w.id}.md`, summary: w.data.summary, themes: w.data.themes.map((t) => LENSES[t]), stack: w.data.stack })),
    projects: projects.map((p) => ({ title: p.data.title, url: `${SITE}/projects/${p.id}/`, markdown: `${SITE}/projects/${p.id}.md`, summary: p.data.summary, repository: p.data.repo ?? null })),
    notes: notes.map((n) => ({ title: n.data.title, url: `${SITE}/notes/${n.id}/`, markdown: `${SITE}/notes/${n.id}.md`, summary: n.data.summary })),
    license: { prose: 'CC BY 4.0', code: 'MIT' },
    generated: new Date().toISOString().slice(0, 10),
  };
  return new Response(JSON.stringify(facts, null, 2), { headers: { 'Content-Type': 'application/json' } });
};
