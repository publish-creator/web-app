'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

import type { TermsEvent, TermsEventKind } from '@/store/services/auth';

const MAX_EVENTS = 55;

const SCROLL_BUCKET = 10;

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
  const [scrollDepthPercent, setScrollDepthPercent] = useState(0);
  const [reachedEndAt, setReachedEndAt] = useState<string | null>(null);

  const record = useCallback((kind: TermsEventKind, atPercent: number | null) => {
    if (events.current.length >= MAX_EVENTS) return;

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

    if (percent >= 99) {
      setReachedEndAt((current) => {
        if (current) return current;

        record('REACHED_END', 100);

        return new Date().toISOString();
      });
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
