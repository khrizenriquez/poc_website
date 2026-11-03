import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve('src/styles/themes.css'), 'utf8');
const blocks = [...css.matchAll(/:root(?:\[data-theme='dark'\])?\s*\{([^}]+)\}/g)].map(([, body]) =>
  Object.fromEntries(
    [...body.matchAll(/(--[\w-]+):\s*(#[\da-f]+);/gi)].map(([, key, value]) => [key, value]),
  ),
);
function luminance(hex) {
  const rgb = hex
    .slice(1)
    .match(/../g)
    .map((channel) => {
      const value = parseInt(channel, 16) / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}
const pairs = [
  ['--ink', '--paper', 4.5],
  ['--muted', '--paper', 4.5],
  ['--ink', '--field', 4.5],
  ['--muted', '--surface', 4.5],
  ['--ink', '--closing', 4.5],
  ['--ink', '--hero-glow', 4.5],
  ['--accent-text', '--paper', 4.5],
  ['--button-text', '--button-bg', 4.5],
  ['--button-text', '--button-hover', 4.5],
  ['--error', '--paper', 4.5],
  ['--error-text', '--error-surface', 4.5],
  ['--focus', '--paper', 3],
  ['--focus', '--surface', 3],
  ['--control-border', '--field', 3],
  ['--control-border', '--paper', 3],
];
describe.each(['light', 'dark'])('Theme %s color contrast', (theme) => {
  const colors = theme === 'light' ? blocks[0] : { ...blocks[0], ...blocks[1] };
  it.each(pairs)('%s on %s meets %s:1 contrast', (foreground, background, minimum) => {
    expect(contrast(colors[foreground], colors[background])).toBeGreaterThanOrEqual(minimum);
  });
});
