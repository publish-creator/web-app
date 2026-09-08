import '@testing-library/jest-dom/vitest';

/**
 * jsdom does not implement ResizeObserver, and components that measure themselves — the offer card
 * draws its notched mask from the rendered size — throw on mount without it. Observing nothing is
 * enough: the layout effect runs once with the zeroed measurements jsdom reports.
 */
if (!('ResizeObserver' in globalThis)) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
