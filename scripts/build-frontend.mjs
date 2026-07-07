import { mkdir, rm, writeFile, copyFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { renderDocsRedirectPage, renderFaviconSvg, renderLandingPage } from '../dist/src/public-pages.js';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const defaultOutputRoot = resolve(root, '.vercel', 'output');

function parseOutDir() {
  const outIndex = process.argv.indexOf('--out');
  if (outIndex >= 0) {
    const value = process.argv[outIndex + 1];
    if (!value) throw new Error('--out requires a directory');
    return {
      outputRoot: resolve(process.cwd(), value),
      staticDir: resolve(process.cwd(), value),
      writeBuildOutputConfig: false,
    };
  }
  return {
    outputRoot: defaultOutputRoot,
    staticDir: resolve(defaultOutputRoot, 'static'),
    writeBuildOutputConfig: true,
  };
}

async function write(path, content) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content);
}

const { outputRoot, staticDir, writeBuildOutputConfig } = parseOutDir();
await rm(outputRoot, { recursive: true, force: true });
await mkdir(staticDir, { recursive: true });

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

console.log(`Built Vercel frontend into ${staticDir}`);
