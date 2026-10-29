import { createServer } from 'node:http';
import { loadEnv } from 'vite';
import { handleApiRequest } from './localApi.js';
Object.assign(process.env, loadEnv('development', process.cwd(), ''));
createServer(handleApiRequest).listen(Number(process.env.API_PORT || 3001), '127.0.0.1', () => console.log(`API local: http://127.0.0.1:${process.env.API_PORT || 3001}`));
