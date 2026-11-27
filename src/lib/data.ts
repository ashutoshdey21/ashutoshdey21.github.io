import { parse } from 'yaml';
import { getCollection } from 'astro:content';
import { LENSES } from '../content.config';
import positioningRaw from '../data/positioning.yaml?raw';
import profileRaw from '../data/profile.yaml?raw';

export const positioning = parse(positioningRaw);
export const profile = parse(profileRaw);

export const SITE = 'https://ashutoshdey21.github.io';

export async function allContent() {
  const work = (await getCollection('work')).sort((a, b) => b.data.weight - a.data.weight);
  const projects = (await getCollection('projects')).sort((a, b) => b.data.weight - a.data.weight);
  const notes = (await getCollection('notes')).sort((a, b) => b.data.weight - a.data.weight);
  return { work, projects, notes };
}

export const lensLabel = (t: keyof typeof LENSES) => LENSES[t];

export function personLd(extra = {}) {
  const current = profile.experience[0];
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE}/#person`,
    name: profile.name,
    description: positioning.descriptor,
    jobTitle: profile.jobTitle,
    url: profile.url,
    sameAs: [profile.links.github, profile.links.linkedin],
    worksFor: { '@type': 'Organization', name: current.org },
    homeLocation: { '@type': 'Place', name: profile.location },
    alumniOf: profile.education.map((e: any) => ({ '@type': 'CollegeOrUniversity', name: e.org })),
    knowsAbout: Object.values(profile.skills).flat(),
    ...extra,
  };
}

export const authorRef = { '@type': 'Person', '@id': `${SITE}/#person`, name: 'Ashutosh Dey', url: `${SITE}/` };
