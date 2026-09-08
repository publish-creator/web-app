import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { createRef } from 'react';

import { useTermsEvidence } from './use-terms-evidence';

function boxRef({ scrollHeight, clientHeight }: { scrollHeight: number; clientHeight: number }) {
  const ref = createRef<HTMLElement>();

  Object.assign(ref, {
    current: { scrollTop: 0, scrollHeight, clientHeight } as unknown as HTMLElement,
  });

  return ref as { current: HTMLElement };
}

const scrollTo = (ref: { current: HTMLElement }, top: number) => {
  Object.assign(ref.current, { scrollTop: top });
};

describe('useTermsEvidence', () => {
  it('records that the text was opened', () => {
    const ref = boxRef({ scrollHeight: 2000, clientHeight: 400 });

    const { result } = renderHook(() => useTermsEvidence(ref));

    expect(result.current.collect().events[0]).toMatchObject({ kind: 'OPENED' });
  });

  it('treats content that does not scroll as read to the end', () => {
    const ref = boxRef({ scrollHeight: 300, clientHeight: 400 });

    const { result } = renderHook(() => useTermsEvidence(ref));

    expect(result.current.scrollDepthPercent).toBe(100);
    expect(result.current.reachedEnd).toBe(true);
  });

  it('measures how far down the reader got', () => {
    const ref = boxRef({ scrollHeight: 1400, clientHeight: 400 });

    const { result } = renderHook(() => useTermsEvidence(ref));

    act(() => {
      scrollTo(ref, 500);
      result.current.onScroll();
    });

    expect(result.current.scrollDepthPercent).toBe(50);
    expect(result.current.reachedEnd).toBe(false);
  });

  it('keeps the deepest point, not the last one, when the reader scrolls back up', () => {
    const ref = boxRef({ scrollHeight: 1400, clientHeight: 400 });

    const { result } = renderHook(() => useTermsEvidence(ref));

    act(() => {
      scrollTo(ref, 900);
      result.current.onScroll();
      scrollTo(ref, 100);
      result.current.onScroll();
    });

    expect(result.current.scrollDepthPercent).toBe(90);
  });

  it('marks the end once, and keeps the first time it happened', () => {
    const ref = boxRef({ scrollHeight: 1400, clientHeight: 400 });

    const { result } = renderHook(() => useTermsEvidence(ref));

    act(() => {
      scrollTo(ref, 1000);
      result.current.onScroll();
      result.current.onScroll();
    });

    const ends = result.current.collect().events.filter((event) => event.kind === 'REACHED_END');

    expect(result.current.reachedEnd).toBe(true);
    expect(ends).toHaveLength(1);
  });

  it('stays well under the cap the API enforces, however much scrolling happens', () => {
    const ref = boxRef({ scrollHeight: 1400, clientHeight: 400 });

    const { result } = renderHook(() => useTermsEvidence(ref));

    act(() => {
      for (let top = 0; top <= 1000; top += 1) {
        scrollTo(ref, top);
        result.current.onScroll();
      }
    });

    expect(result.current.collect().events.length).toBeLessThanOrEqual(60);
  });

  it('describes the machine it was read on', () => {
    const ref = boxRef({ scrollHeight: 300, clientHeight: 400 });

    const { result } = renderHook(() => useTermsEvidence(ref));

    const evidence = result.current.collect();

    for (const value of [
      evidence.viewportWidth,
      evidence.viewportHeight,
      evidence.screenWidth,
      evidence.screenHeight,
      evidence.devicePixelRatio,
    ]) {
      expect(Number.isFinite(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(100000);
    }
    expect(evidence.language).toBeTruthy();
    expect(evidence.timeZone).toBeTruthy();
    expect(Date.parse(evidence.openedAt)).not.toBeNaN();
  });

  it('records the acceptance itself, last', () => {
    const ref = boxRef({ scrollHeight: 300, clientHeight: 400 });

    const { result } = renderHook(() => useTermsEvidence(ref));

    const { events } = result.current.collect();

    expect(events.at(-1)).toMatchObject({ kind: 'ACCEPTED' });
  });
});
