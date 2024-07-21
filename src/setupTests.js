// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect, afterEach, afterAll, beforeEach, beforeAll, vi } from 'vitest';
import { server } from './test-utils/mocks/server';
import { fetch } from 'cross-fetch';

global.fetch = fetch;

expect.extend(matchers);

// Testing mocks for Shoelace
// for more info, visit: https://shoelace.style/frameworks/react?id=testing-with-jest
beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

/**
 * Mock scroll control
 */
beforeAll(() => {
  window.scrollY = 0;
  window.scrollTo = vi.fn();
});

/**
 *   Mock Service Worker config
 */
// Establish API mocking before all tests.
beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished.
afterAll(() => server.close());

// afterEach(() => cleanup())
