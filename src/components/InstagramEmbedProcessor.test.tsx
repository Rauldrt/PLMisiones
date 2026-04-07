import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { InstagramEmbedProcessor } from './InstagramEmbedProcessor';

describe('InstagramEmbedProcessor', () => {
  beforeEach(() => {
    // Clear the DOM before each test
    document.body.innerHTML = '';
    // Reset window.instgrm
    delete window.instgrm;
    // Clear all mocks
    vi.clearAllMocks();
    // Use fake timers for interval tests
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('handles empty state where window.instgrm is not defined', () => {
    render(<InstagramEmbedProcessor />);

    // The script should be injected since window.instgrm is undefined and script is not on page
    const script = document.querySelector('script[src="//www.instagram.com/embed.js"]');
    expect(script).toBeInTheDocument();
  });

  it('injects the Instagram script if not present', () => {
    render(<InstagramEmbedProcessor />);

    const scripts = document.querySelectorAll('script[src="//www.instagram.com/embed.js"]');
    expect(scripts.length).toBe(1);
    const script = scripts[0] as HTMLScriptElement;
    expect(script.async).toBe(true);
  });

  it('does not inject the script if already present', () => {
    // Manually add the script to the DOM first
    const existingScript = document.createElement('script');
    existingScript.src = '//www.instagram.com/embed.js';
    document.body.appendChild(existingScript);

    render(<InstagramEmbedProcessor />);

    // There should still only be one script
    const scripts = document.querySelectorAll('script[src="//www.instagram.com/embed.js"]');
    expect(scripts.length).toBe(1);
  });

  it('calls process if window.instgrm is already defined', () => {
    const processMock = vi.fn();
    window.instgrm = {
      Embeds: {
        process: processMock
      }
    };

    render(<InstagramEmbedProcessor />);
    expect(processMock).toHaveBeenCalledTimes(1);
  });

  it('runs processing periodically when unrendered instagram items exist', () => {
    const processMock = vi.fn();
    window.instgrm = {
      Embeds: {
        process: processMock
      }
    };

    // Add an unrendered instagram media element
    const mediaElement = document.createElement('div');
    mediaElement.className = 'instagram-media';
    document.body.appendChild(mediaElement);

    render(<InstagramEmbedProcessor />);

    // Initial process call happens because window.instgrm is defined
    expect(processMock).toHaveBeenCalledTimes(1);

    // Advance timers by 1 second (interval length)
    vi.advanceTimersByTime(1000);

    // process should be called again due to the interval
    expect(processMock).toHaveBeenCalledTimes(2);

    // Advance again
    vi.advanceTimersByTime(1000);
    expect(processMock).toHaveBeenCalledTimes(3);
  });

  it('does not process on interval if no unrendered items exist', () => {
    const processMock = vi.fn();
    window.instgrm = {
      Embeds: {
        process: processMock
      }
    };

    // Add an already RENDERED instagram media element
    const mediaElement = document.createElement('div');
    mediaElement.className = 'instagram-media instagram-media-rendered';
    document.body.appendChild(mediaElement);

    render(<InstagramEmbedProcessor />);

    // Initial process call happens because window.instgrm is defined
    expect(processMock).toHaveBeenCalledTimes(1);

    // Advance timers
    vi.advanceTimersByTime(1000);

    // Process should NOT be called again because the media is rendered
    expect(processMock).toHaveBeenCalledTimes(1);
  });


  it('clears the interval upon unmount', () => {
    const processMock = vi.fn();
    window.instgrm = {
      Embeds: {
        process: processMock
      }
    };

    const mediaElement = document.createElement('div');
    mediaElement.className = 'instagram-media';
    document.body.appendChild(mediaElement);

    const { unmount } = render(<InstagramEmbedProcessor />);

    expect(processMock).toHaveBeenCalledTimes(1);

    // Unmount the component
    unmount();

    // Advance timers
    vi.advanceTimersByTime(1000);

    // Process should not have been called again since the interval was cleared
    expect(processMock).toHaveBeenCalledTimes(1);
  });
});
