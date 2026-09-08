'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

import type { TermsEvent, TermsEventKind } from '@/store/services/auth';

const MAX_EVENTS = 55;

const SCROLL_BUCKET = 10;

const ONCE = new Set<TermsEventKind>(['OPENED', 'REACHED_END', 'ACCEPTED']);

type Evidence = {
  openedAt: string;
  reachedEndAt: string | null;
  scrollDepthPercent: number;
  viewportWidth: number;
  viewportHeight: number;
  screenWidth: number;
  screenHeight: number;
  devicePixelRatio: number;
  language: string;
  timeZone: string;
  events: TermsEvent[];
};

export function useTermsEvidence(scrollRef: RefObject<HTMLElement | null>) {
  const openedAt = useRef(new Date().toISOString());
  const events = useRef<TermsEvent[]>([]);
  const lastBucket = useRef(-1);
  const reachedEnd = useRef<string | null>(null);
  const [scrollDepthPercent, setScrollDepthPercent] = useState(0);
  const [reachedEndAt, setReachedEndAt] = useState<string | null>(null);

  const recordedOnce = useRef(new Set<TermsEventKind>());

  const record = useCallback((kind: TermsEventKind, atPercent: number | null) => {
    if (events.current.length >= MAX_EVENTS) return;

    if (ONCE.has(kind)) {
      if (recordedOnce.current.has(kind)) return;

      recordedOnce.current.add(kind);
    }

    events.current.push({ kind, atPercent, occurredAt: new Date().toISOString() });
  }, []);

  useEffect(() => {
    record('OPENED', 0);

    const onBlur = () => record('BLURRED', lastBucket.current * SCROLL_BUCKET);
    const onFocus = () => record('FOCUSED', lastBucket.current * SCROLL_BUCKET);

    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);

    return () => {
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
    };
  }, [record]);

  const onScroll = useCallback(() => {
    const element = scrollRef.current;

    if (!element) return;

    const scrollable = element.scrollHeight - element.clientHeight;

    const percent =
      scrollable <= 0 ? 100 : Math.min(100, Math.round((element.scrollTop / scrollable) * 100));

    setScrollDepthPercent((current) => Math.max(current, percent));

    const bucket = Math.floor(percent / SCROLL_BUCKET);

    if (bucket > lastBucket.current) {
      lastBucket.current = bucket;
      record('SCROLLED', percent);
    }

    if (percent >= 99 && !reachedEnd.current) {
      reachedEnd.current = new Date().toISOString();
      record('REACHED_END', 100);
      setReachedEndAt(reachedEnd.current);
    }
  }, [record, scrollRef]);

  useEffect(() => {
    onScroll();
  }, [onScroll]);

  const collect = useCallback((): Evidence => {
    record('ACCEPTED', scrollDepthPercent);

    return {
      openedAt: openedAt.current,
      reachedEndAt,
      scrollDepthPercent,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      devicePixelRatio: window.devicePixelRatio,
      language: navigator.language,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      events: [...events.current],
    };
  }, [reachedEndAt, record, scrollDepthPercent]);

  return { scrollDepthPercent, reachedEnd: reachedEndAt !== null, onScroll, collect };
}
