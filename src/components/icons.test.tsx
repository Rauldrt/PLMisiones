import test from 'node:test';
import assert from 'node:assert';
import { getIcon, Icons } from './icons';

test('getIcon utility', async (t) => {
  await t.test('returns Social icon for empty string', () => {
    const icon = getIcon('');
    assert.strictEqual(icon, Icons.Social);
  });

  await t.test('returns correct icon for exact PascalCase match', () => {
    const icon = getIcon('Facebook');
    assert.strictEqual(icon, Icons.Facebook);
  });

  await t.test('returns correct icon for lowercase match', () => {
    const icon = getIcon('youtube');
    assert.strictEqual(icon, Icons.Youtube);
  });

  await t.test('returns correct icon for kebab-case match', () => {
    const icon = getIcon('music-2');
    assert.strictEqual(icon, Icons.Music2);
  });

  await t.test('returns Social icon for unknown string', () => {
    const icon = getIcon('unknown-non-existent-icon');
    assert.strictEqual(icon, Icons.Social);
  });

  await t.test('returns custom TiktokIcon correctly', () => {
    const icon = getIcon('tiktok');
    assert.strictEqual(icon, Icons.Tiktok);
  });
});
