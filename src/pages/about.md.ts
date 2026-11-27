import type { APIRoute } from 'astro';
import { aboutMd, mdResponse } from '../lib/md';
export const GET: APIRoute = () => mdResponse(aboutMd());
