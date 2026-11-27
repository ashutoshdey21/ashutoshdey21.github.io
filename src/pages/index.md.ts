import type { APIRoute } from 'astro';
import { homeMd, mdResponse } from '../lib/md';
export const GET: APIRoute = async () => mdResponse(await homeMd());
