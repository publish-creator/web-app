'use client';

import { ChevronRight, CircleInfo, Palette, Sliders } from '@gravity-ui/icons';
import { Badge, Separator } from '@heroui/react';
import { ItemCard, ItemCardGroup, PressableFeedback } from '@heroui-pro/react';
import { Fragment, useEffect, useRef, useState } from 'react';

import {
  CREATE_PROFILE_STEP_IDS,
  CREATE_PROFILE_STEPS,
  EXPAND_ADVANCED_EVENT,
} from './creators-profile-create.constants';

const STEP_ICONS = {
  [CREATE_PROFILE_STEPS[0].id]: CircleInfo,
  [CREATE_PROFILE_STEPS[1].id]: Palette,
  [CREATE_PROFILE_STEPS[2].id]: Sliders,
} as const;

const SCROLL_OFFSET_PX = 96;

function getScrollParent(element: HTMLElement): HTMLElement | Window {
  let parent = element.parentElement;

  while (parent) {
    const overflowY = window.getComputedStyle(parent).overflowY;

    if (
      (overflowY === 'auto' || overflowY === 'scroll') &&
      parent.scrollHeight > parent.clientHeight
    ) {
      return parent;
    }

    parent = parent.parentElement;
  }

  return window;
}

function getScrollMetrics(scroller: HTMLElement | Window) {
  if (scroller instanceof Window) {
    return {
      top: 0,
      scrollTop: window.scrollY,
      clientHeight: window.innerHeight,
      scrollHeight: document.documentElement.scrollHeight,
    };
  }

  return {
    top: scroller.getBoundingClientRect().top,
    scrollTop: scroller.scrollTop,
    clientHeight: scroller.clientHeight,
    scrollHeight: scroller.scrollHeight,
  };
}

function getActiveStepId(scroller: HTMLElement | Window) {
  const { top, scrollTop, clientHeight, scrollHeight } = getScrollMetrics(scroller);
  let activeId: string = CREATE_PROFILE_STEPS[0].id;

  for (const step of CREATE_PROFILE_STEPS) {
    const element = document.getElementById(step.id);

    if (!element) {
      continue;
    }

    if (element.getBoundingClientRect().top - top <= SCROLL_OFFSET_PX) {
      activeId = step.id;
    }
  }

  const lastElement = document.getElementById(CREATE_PROFILE_STEP_IDS.advanced);
  const canScroll = scrollHeight - clientHeight > 4;
  const nearBottom = scrollTop + clientHeight >= scrollHeight - 4;
  const lastStillBelowLine =
    lastElement !== null && lastElement.getBoundingClientRect().top - top > SCROLL_OFFSET_PX;

  if (canScroll && nearBottom && lastStillBelowLine) {
    return CREATE_PROFILE_STEP_IDS.advanced;
  }

  return activeId;
}

function scrollElementIntoView(element: HTMLElement) {
  const scroller = getScrollParent(element);
  const { top, scrollTop } = getScrollMetrics(scroller);
  const nextTop = element.getBoundingClientRect().top - top + scrollTop - SCROLL_OFFSET_PX;

  scroller.scrollTo({ top: Math.max(0, nextTop), behavior: 'smooth' });
}

export function CreatorsProfileCreateSteps() {
  const [activeId, setActiveId] = useState<string>(CREATE_PROFILE_STEPS[0].id);
  const isProgrammaticScrollRef = useRef(false);

  useEffect(() => {
    const firstSection = document.getElementById(CREATE_PROFILE_STEPS[0].id);

    if (!firstSection) {
      return;
    }

    const scroller = getScrollParent(firstSection);
    const scrollTarget: EventTarget = scroller instanceof Window ? window : scroller;
    let frame = 0;

    const syncActiveStep = () => {
      if (isProgrammaticScrollRef.current) {
        return;
      }

      const nextId = getActiveStepId(scroller);
      setActiveId((currentId) => (currentId === nextId ? currentId : nextId));
    };

    const onScroll = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        syncActiveStep();
      });
    };

    syncActiveStep();
    scrollTarget.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.cancelAnimationFrame(frame);
      scrollTarget.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const scrollToStep = (id: string) => {
    isProgrammaticScrollRef.current = true;
    setActiveId(id);

    if (id === CREATE_PROFILE_STEP_IDS.advanced) {
      window.dispatchEvent(new Event(EXPAND_ADVANCED_EVENT));
    }

    const runScroll = () => {
      const element = document.getElementById(id);

      if (element) {
        scrollElementIntoView(element);
      }

      window.setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 700);
    };

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(runScroll);
    });
  };

  return (
    <div className="sticky top-20 flex h-fit flex-col gap-4">
      <ItemCardGroup className="overflow-hidden">
        <ItemCardGroup.Header>
          <ItemCardGroup.Title>Etapas</ItemCardGroup.Title>
          <ItemCardGroup.Description>
            Acompanhe o preenchimento e pule para a próxima seção
          </ItemCardGroup.Description>
        </ItemCardGroup.Header>

        {CREATE_PROFILE_STEPS.map((step, index) => {
          const Icon = STEP_ICONS[step.id];
          const isActive = activeId === step.id;

          return (
            <Fragment key={step.id}>
              {index > 0 ? <Separator /> : null}
              <ItemCard<'button'>
                className={`hover:bg-default/20 active:bg-default-hover/50 relative w-full cursor-pointer overflow-hidden transition-colors ${
                  isActive ? 'bg-default/20' : ''
                }`}
                render={(props) => (
                  <button
                    {...props}
                    aria-current={isActive ? 'step' : undefined}
                    type="button"
                    onClick={(event) => {
                      props.onClick?.(event);
                      scrollToStep(step.id);
                    }}
                    onMouseDown={(event) => {
                      event.preventDefault();
                    }}
                  />
                )}
              >
                <PressableFeedback.Ripple />
                <Badge.Anchor>
                  <Badge color={isActive ? 'accent' : 'default'} size="sm" />
                  <ItemCard.Icon>
                    <Icon className="size-4" />
                  </ItemCard.Icon>
                </Badge.Anchor>
                <ItemCard.Content>
                  <ItemCard.Title>{step.title}</ItemCard.Title>
                  <ItemCard.Description>{step.description}</ItemCard.Description>
                </ItemCard.Content>
                <ItemCard.Action>
                  <ChevronRight className="text-muted size-4 rtl:-scale-x-100" />
                </ItemCard.Action>
              </ItemCard>
            </Fragment>
          );
        })}
      </ItemCardGroup>
    </div>
  );
}
