import { mkdir, rm, writeFile, copyFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { renderDocsRedirectPage, renderFaviconSvg, renderLandingPage } from '../dist/src/public-pages.js';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const defaultOutputRoot = resolve(root, '.vercel', 'output');
const fallbackServerRoot = resolve(root, 'vercel-static');

function parseOutDir() {
  const outIndex = process.argv.indexOf('--out');
  if (outIndex >= 0) {
    const value = process.argv[outIndex + 1];
    if (!value) throw new Error('--out requires a directory');
    return {
      outputRoot: resolve(process.cwd(), value),
      staticDir: resolve(process.cwd(), value),
      writeBuildOutputConfig: false,
      writeFallbackServer: false,
    };
  }
  return {
    outputRoot: defaultOutputRoot,
    staticDir: resolve(defaultOutputRoot, 'static'),
    writeBuildOutputConfig: true,
    writeFallbackServer: true,
  };
}

async function write(path, content) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content);
}

async function writeStaticFiles(staticDir) {
  await write(resolve(staticDir, 'index.html'), renderLandingPage());
  await write(resolve(staticDir, 'docs', 'index.html'), renderDocsRedirectPage());
  await write(resolve(staticDir, 'favicon.svg'), renderFaviconSvg());
  await write(resolve(staticDir, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://reverbin.com/sitemap.xml\n');
  await write(resolve(staticDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://reverbin.com/</loc></url>
  <url><loc>https://reverbin.com/docs</loc></url>
  <url><loc>https://reverbin.com/llms.txt</loc></url>
</urlset>
`);
  await copyFile(resolve(root, 'llms.txt'), resolve(staticDir, 'llms.txt'));
}

const fallbackEntrypoint = `import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import Fastify from 'fastify';

const root = dirname(fileURLToPath(import.meta.url));
const apiBase = 'https://api.reverbin.com';
const fastify = Fastify({ logger: false });

const files = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/docs', ['docs/index.html', 'text/html; charset=utf-8']],
  ['/docs/', ['docs/index.html', 'text/html; charset=utf-8']],
  ['/llms.txt', ['llms.txt', 'text/plain; charset=utf-8']],
  ['/favicon.svg', ['favicon.svg', 'image/svg+xml']],
  ['/robots.txt', ['robots.txt', 'text/plain; charset=utf-8']],
  ['/sitemap.xml', ['sitemap.xml', 'application/xml; charset=utf-8']],
]);

function redirect(reply, location) {
  return reply.code(307).header('Location', location).header('Cache-Control', 'no-store').send();
}

function notFound(reply) {
  return reply.code(404).type('text/plain; charset=utf-8').send('Not found');
}

fastify.all('/*', async (request, reply) => {
  const url = new URL(request.url, 'https://reverbin.com');
  if (url.pathname === '/dashboard' || url.pathname.startsWith('/dashboard/')) return redirect(reply, apiBase + url.pathname + url.search);
  if (url.pathname.startsWith('/v1/')) return redirect(reply, apiBase + url.pathname + url.search);
  if (url.pathname === '/health' || url.pathname === '/readyz') return redirect(reply, apiBase + url.pathname + url.search);

  const match = files.get(url.pathname);
  if (!match) return notFound(reply);

  const [relativePath, contentType] = match;
  const filePath = join(root, relativePath);
  try {
    const info = await stat(filePath);
    return reply
      .header('Content-Type', contentType)
      .header('Content-Length', String(info.size))
      .header('Cache-Control', url.pathname === '/' || url.pathname === '/docs' ? 'public, max-age=0, must-revalidate' : 'public, max-age=3600')
      .send(createReadStream(filePath));
  } catch {
    return notFound(reply);
  }
});

const port = Number(process.env.PORT || 3000);
fastify.listen({ port, host: '0.0.0.0' }, (error) => {
  if (error) {
    fastify.log.error(error);
    process.exit(1);
  }
  console.log('Reverbin Fastify fallback frontend listening on ' + port);
});
`;

const { outputRoot, staticDir, writeBuildOutputConfig, writeFallbackServer } = parseOutDir();
await rm(outputRoot, { recursive: true, force: true });
await mkdir(staticDir, { recursive: true });
await writeStaticFiles(staticDir);

if (writeBuildOutputConfig) {
  const config = {
    version: 3,
    routes: [
      { src: '/dashboard', status: 307, headers: { Location: 'https://api.reverbin.com/dashboard' } },
      { src: '/dashboard/(.*)', status: 307, headers: { Location: 'https://api.reverbin.com/dashboard/$1' } },
      { src: '/v1/(.*)', status: 307, headers: { Location: 'https://api.reverbin.com/v1/$1' } },
      { src: '/health', status: 307, headers: { Location: 'https://api.reverbin.com/health' } },
      { src: '/readyz', status: 307, headers: { Location: 'https://api.reverbin.com/readyz' } },
    ],
  };
  await write(resolve(outputRoot, 'config.json'), `${JSON.stringify(config, null, 2)}\n`);
}

if (writeFallbackServer) {
  await rm(fallbackServerRoot, { recursive: true, force: true });
  await mkdir(fallbackServerRoot, { recursive: true });
  await writeStaticFiles(fallbackServerRoot);
  await write(resolve(fallbackServerRoot, 'index.mjs'), fallbackEntrypoint);
}

console.log(`Built Vercel frontend into ${staticDir}`);
if (writeFallbackServer) console.log(`Built Vercel fallback entrypoint into ${fallbackServerRoot}`);
