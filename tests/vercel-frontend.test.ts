import * as assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), 'utf8');

test('Vercel frontend config uses Build Output API and delegates backend paths to the VPS API', () => {
  const pkg = JSON.parse(read('package.json'));
  const vercel = JSON.parse(read('vercel.json'));

  assert.equal(pkg.scripts['build:frontend'], 'npm run build && node scripts/build-frontend.mjs');
  assert.equal(vercel.buildCommand, 'npm run build:frontend');
  assert.equal(vercel.outputDirectory, undefined);
  assert.equal(vercel.cleanUrls, true);

  const buildScript = read('scripts/build-frontend.mjs');
  assert.match(buildScript, /\.vercel/);
  assert.match(buildScript, /output/);
  assert.match(buildScript, /static/);
  assert.match(buildScript, /https:\/\/api\.reverbin\.com\/dashboard/);
  assert.match(buildScript, /https:\/\/api\.reverbin\.com\/v1/);
  assert.match(buildScript, /https:\/\/api\.reverbin\.com\/health/);
});

test('frontend static build emits Vercel Build Output API files without backend secrets', () => {
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

test('default frontend build writes .vercel/output and stale-output-directory fallback for Vercel detection', () => {
  const outputRoot = new URL('../.vercel/output/', import.meta.url);
  const fallbackRoot = new URL('../vercel-static/', import.meta.url);
  try {
    execFileSync(process.execPath, ['scripts/build-frontend.mjs'], {
      cwd: new URL('.', root),
      stdio: 'pipe',
    });

    const staticRoot = new URL('static/', outputRoot);
    const configPath = new URL('config.json', outputRoot);
    const indexPath = new URL('index.html', staticRoot);
    const llmsPath = new URL('llms.txt', staticRoot);
    const fallbackEntrypoint = new URL('index.mjs', fallbackRoot);
    const fallbackHtml = new URL('index.html', fallbackRoot);

    assert.equal(existsSync(configPath), true);
    assert.equal(existsSync(indexPath), true);
    assert.equal(existsSync(llmsPath), true);
    assert.equal(existsSync(fallbackEntrypoint), true);
    assert.equal(existsSync(fallbackHtml), true);

    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    assert.equal(config.version, 3);
    assert.match(JSON.stringify(config.routes), /api\.reverbin\.com/);
    assert.match(readFileSync(indexPath, 'utf8'), /user@reverbin\.com/);
    assert.match(readFileSync(fallbackEntrypoint, 'utf8'), /import Fastify from 'fastify'/);
    assert.match(readFileSync(fallbackEntrypoint, 'utf8'), /fastify\.listen/);
    assert.match(readFileSync(fallbackEntrypoint, 'utf8'), /apiBase = 'https:\/\/api\.reverbin\.com'/);
  } finally {
    rmSync(new URL('../.vercel', import.meta.url), { recursive: true, force: true });
    rmSync(new URL('../vercel-static', import.meta.url), { recursive: true, force: true });
  }
});
