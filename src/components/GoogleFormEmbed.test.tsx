import test from 'node:test';
import assert from 'node:assert';
import React from 'react';
import { render } from '@testing-library/react';
import { GoogleFormEmbed } from './GoogleFormEmbed';
import type { GoogleForm } from '@/lib/types';
import { JSDOM } from 'jsdom';

// Setup JSDOM
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window as any;
global.document = dom.window.document as any;
global.React = React; // Inject React to global so that tsx doesn't complain

test('renders form title and iframe with correct src for happy path', () => {
  const form: GoogleForm = {
    id: 'test-id',
    title: 'Test Form',
    embedUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc/viewform?embedded=true',
    type: 'google-form',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const { getByText, container } = render(<GoogleFormEmbed form={form} />);

  assert.ok(getByText('Test Form'));

  const iframe = container.querySelector('iframe');
  assert.ok(iframe);
  assert.strictEqual(iframe.getAttribute('src'), 'https://docs.google.com/forms/d/e/1FAIpQLSc/viewform?embedded=true');
});

test('handles missing description gracefully', () => {
  const form: GoogleForm = {
    id: 'test-id',
    title: 'No Description Form',
    embedUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc/viewform?embedded=true',
    type: 'google-form',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const { getByText, queryByText } = render(<GoogleFormEmbed form={form} />);
  assert.ok(getByText('No Description Form'));
  assert.ok(queryByText('Test Description') === null);
});

test('handles empty or invalid embedUrl by rendering a fallback message', () => {
  const form: GoogleForm = {
    id: 'test-id',
    title: 'Invalid Embed Form',
    embedUrl: '',
    type: 'google-form',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const { getByText, container } = render(<GoogleFormEmbed form={form} />);

  assert.ok(getByText('Invalid Embed Form'));
  assert.ok(getByText('Invalid or missing form URL.'));

  const iframe = container.querySelector('iframe');
  assert.strictEqual(iframe, null); // Iframe should not be rendered
});
