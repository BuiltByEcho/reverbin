import { mkdir, rm, writeFile, copyFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { renderDocsRedirectPage, renderFaviconSvg, renderLandingPage } from '../dist/src/public-pages.js';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

function parseOutDir() {
  const outIndex = process.argv.indexOf('--out');
  if (outIndex >= 0) {
    const value = process.argv[outIndex + 1];
    if (!value) throw new Error('--out requires a directory');
    return resolve(process.cwd(), value);
  }
  return resolve(root, 'vercel-static');
}

async function write(path, content) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content);
}

const outDir = parseOutDir();
await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

await write(resolve(outDir, 'index.html'), renderLandingPage());
await write(resolve(outDir, 'docs', 'index.html'), renderDocsRedirectPage());
await write(resolve(outDir, 'favicon.svg'), renderFaviconSvg());
await write(resolve(outDir, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://reverbin.com/sitemap.xml\n');
await write(resolve(outDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://reverbin.com/</loc></url>
  <url><loc>https://reverbin.com/docs</loc></url>
  <url><loc>https://reverbin.com/llms.txt</loc></url>
</urlset>
`);
await copyFile(resolve(root, 'llms.txt'), resolve(outDir, 'llms.txt'));

console.log(`Built Vercel frontend into ${outDir}`);
