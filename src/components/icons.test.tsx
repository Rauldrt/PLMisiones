import { describe, it, expect } from 'vitest';
import { getIcon, Icons } from './icons';

describe('getIcon utility function', () => {
  it('returns the correct icon for a valid lowercase name', () => {
    const Icon = getIcon('youtube');
    expect(Icon).toBe(Icons.Youtube);
  });

  it('returns the correct icon for a valid kebab-case name', () => {
    const Icon = getIcon('music-2');
    expect(Icon).toBe(Icons.Music2);
  });

  it('returns the default Social icon if the name is not found', () => {
    const Icon = getIcon('unknown-icon-name');
    expect(Icon).toBe(Icons.Social);
  });

  it('returns the default Social icon if the name is an empty string', () => {
    const Icon = getIcon('');
    expect(Icon).toBe(Icons.Social);
  });

  it('returns the default Social icon if the name is completely invalid/null (handling edge case at runtime)', () => {
    // Suppress TS error for runtime testing
    // @ts-ignore
    const Icon = getIcon(null);
    expect(Icon).toBe(Icons.Social);
  });
});
