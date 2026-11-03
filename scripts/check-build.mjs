import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, readdir, stat, mkdir, writeFile } from 'node:fs/promises';
import { resolve, relative, extname } from 'node:path';
import { routeManifest } from '../src/data/site.js';

const root = resolve('dist');
const base = '/poc_website/';
const html = await readFile(resolve(root, 'index.html'), 'utf8');
assert.match(html, /<div id="root"><\/div>/);
assert.match(html, /\/poc_website\/assets\//);
assert.doesNotMatch(html, /src="\/src\//);
const emittedReferences = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map((match) => match[1]);
for (const path of emittedReferences) {
  assert.ok(path.startsWith(base), `Incorrect repository base: ${path}`);
  await stat(resolve(root, path.slice(base.length)));
}
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) =>
      entry.isDirectory() ? walk(resolve(directory, entry.name)) : [resolve(directory, entry.name)],
    ),
  );
  return nested.flat();
}
const files = await walk(root);
assert.ok(
  files.some((path) => path.includes('NetworkScene-')),
  '3D must be a separate chunk',
);
for (const name of [
  'distribution-center.jpg',
  'logistics-person.jpg',
  'regional-office.jpg',
  'people-team.jpg',
  'quality-care.jpg',
  'pharmacy.jpg',
])
  await stat(resolve(root, 'media', name));
// Keep ES/EN typography to two local requests and catch broken CSS resources.
const fontFiles = files.filter((path) => /\.woff2?$/.test(path));
assert.equal(fontFiles.length, 2, 'Expected only two variable font files');
assert.ok(
  fontFiles.every((path) => path.endsWith('.woff2')),
  'Use WOFF2 fonts only',
);
const cssFiles = files.filter((path) => path.endsWith('.css'));
assert.equal(cssFiles.length, 1, 'Keep application styles in one CSS request');
for (const cssFile of cssFiles) {
  const css = await readFile(cssFile, 'utf8');
  for (const [, rawReference] of css.matchAll(/url\(([^)]+)\)/g)) {
    const reference = rawReference.replace(/^['"]|['"]$/g, '');
    if (reference.startsWith('data:')) continue;
    assert.ok(reference.startsWith(base), `CSS resource must be local: ${reference}`);
    await stat(resolve(root, reference.slice(base.length)));
  }
}
const fontBytes = (await Promise.all(fontFiles.map((path) => stat(path)))).reduce(
  (total, file) => total + file.size,
  0,
);
assert.ok(fontBytes < 100_000, 'Keep variable fonts below 100 KB combined');
const server = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost');
  if (!url.pathname.startsWith(base)) {
    response.writeHead(404).end();
    return;
  }
  const filename = resolve(root, url.pathname.slice(base.length) || 'index.html');
  if (!filename.startsWith(root + '/')) {
    response.writeHead(404).end();
    return;
  }
  try {
    const content = await readFile(filename);
    response.writeHead(200, {
      'Content-Type': extname(filename) === '.html' ? 'text/html' : 'application/octet-stream',
    });
    response.end(content);
  } catch {
    response.writeHead(404).end();
  }
});
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const origin = `http://127.0.0.1:${server.address().port}`;
try {
  for (const path of files) {
    const url = origin + base + relative(root, path).split('\\').join('/');
    const response = await fetch(url);
    assert.equal(response.status, 200, url);
    assert.equal((await response.arrayBuffer()).byteLength, (await stat(path)).size, url);
  }
  for (const language of ['es', 'en'])
    for (const { country, page } of routeManifest) {
      const hash = [language, country?.slug, page].filter(Boolean).join('/');
      const response = await fetch(`${origin}${base}#/${hash}/`);
      assert.equal(response.status, 200);
      assert.equal(await response.text(), html);
    }
  assert.equal((await fetch(`${origin}/assets/not-the-repository-base.js`)).status, 404);
  const summary = {
    base,
    contentRoutes: routeManifest.length,
    localizedRoutes: routeManifest.length * 2,
    artifactFiles: files.length,
    fontFiles: fontFiles.length,
    fontBytes,
    cssFiles: cssFiles.length,
    brokenArtifactFiles: 0,
    note: 'HTTP validates static delivery; route rendering is verified separately in DOM integration tests.',
  };
  await mkdir('test-results', { recursive: true });
  await writeFile('test-results/build-audit.json', JSON.stringify(summary, null, 2) + '\n');
  console.log(JSON.stringify(summary, null, 2));
} finally {
  await new Promise((done) => server.close(done));
}
