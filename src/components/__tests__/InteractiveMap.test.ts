import assert from 'node:assert';
import { test, describe } from 'node:test';
import { parseEmbedCode } from '../InteractiveMap.tsx';

describe('parseEmbedCode', () => {
    test('extracts src and title from valid iframe code', () => {
        const validCode = '<iframe title="Map Title" src="https://example.com/map" width="100%" height="500"></iframe>';
        const result = parseEmbedCode(validCode);
        assert.deepStrictEqual(result, {
            iframeSrc: 'https://example.com/map',
            iframeTitle: 'Map Title'
        });
    });

    test('returns null for empty string', () => {
        const result = parseEmbedCode('');
        assert.strictEqual(result, null);
    });

    test('returns null if src is missing', () => {
        const invalidCode = '<iframe title="Map Title" width="100%" height="500"></iframe>';
        const result = parseEmbedCode(invalidCode);
        assert.strictEqual(result, null);
    });

    test('returns null if title is missing', () => {
        const invalidCode = '<iframe src="https://example.com/map" width="100%" height="500"></iframe>';
        const result = parseEmbedCode(invalidCode);
        assert.strictEqual(result, null);
    });

    test('handles whitespace and formatting', () => {
        const validCode = '<iframe \n  title="Map Title" \n  src="https://example.com/map"\n></iframe>';
        const result = parseEmbedCode(validCode);
        assert.deepStrictEqual(result, {
            iframeSrc: 'https://example.com/map',
            iframeTitle: 'Map Title'
        });
    });

    test('extracts src and title with single quotes', () => {
        const singleQuotesCode = "<iframe title='Map Title' src='https://example.com/map' width='100%' height='500'></iframe>";
        const result = parseEmbedCode(singleQuotesCode);
        assert.deepStrictEqual(result, {
            iframeSrc: 'https://example.com/map',
            iframeTitle: 'Map Title'
        });
    });

    test('returns null for malformed HTML', () => {
        const malformedCode = '<div>Just some text without an iframe</div>';
        const result = parseEmbedCode(malformedCode);
        assert.strictEqual(result, null);
    });
});
