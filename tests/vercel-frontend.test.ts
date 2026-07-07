import * as assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), 'utf8');

test('Vercel frontend config builds a static landing surface and delegates backend paths to VPS API', () => {
  const pkg = JSON.parse(read('package.json'));
  const vercel = JSON.parse(read('vercel.json'));

  assert.equal(pkg.scripts['build:frontend'], 'npm run build && node scripts/build-frontend.mjs');
  assert.equal(vercel.buildCommand, 'npm run build:frontend');
  assert.equal(vercel.outputDirectory, 'vercel-static');
  assert.equal(vercel.cleanUrls, true);

  const redirects = JSON.stringify(vercel.redirects);
  assert.match(redirects, /https:\/\/api\.reverbin\.com\/dashboard/);
  assert.match(redirects, /https:\/\/api\.reverbin\.com\/v1/);
  assert.match(redirects, /https:\/\/api\.reverbin\.com\/health/);
});

test('frontend static build emits Vercel-ready public files without backend secrets', () => {
  const outDir = mkdtempSync(join(tmpdir(), 'reverbin-vercel-'));
  try {
    execFileSync(process.execPath, ['scripts/build-frontend.mjs', '--out', outDir], {
      cwd: new URL('.', root),
      stdio: 'pipe',
    });

    const indexPath = join(outDir, 'index.html');
    const docsPath = join(outDir, 'docs', 'index.html');
    const llmsPath = join(outDir, 'llms.txt');
    const faviconPath = join(outDir, 'favicon.svg');

    assert.equal(existsSync(indexPath), true);
    assert.equal(existsSync(docsPath), true);
    assert.equal(existsSync(llmsPath), true);
    assert.equal(existsSync(faviconPath), true);

    const html = readFileSync(indexPath, 'utf8');
    const docs = readFileSync(docsPath, 'utf8');
    const llms = readFileSync(llmsPath, 'utf8');

    assert.match(html, /Communication infrastructure for autonomous agents/);
    assert.match(html, /user@reverbin\.com/);
    assert.equal(html.includes('dustin@reverbin.com'), false);
    assert.equal(html.includes('agents.reverbin.com'), false);
    assert.match(docs, /Opening API docs/);
    assert.match(llms, /^# Reverbin/);
  } finally {
    rmSync(outDir, { recursive: true, force: true });
  }
});
