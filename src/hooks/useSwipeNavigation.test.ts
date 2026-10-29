import { renderHook } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { describe, expect, it, vi } from 'vitest';
import { SWIPE_THRESHOLD, useSwipeNavigation } from './useSwipeNavigation';

const makeRef = (el: HTMLElement) =>
  ({ current: el }) as {
    current: HTMLElement | null;
  };

const pointerInit = (
  base: { clientX: number; clientY: number },
  extra: object = {},
) => ({
  pointerType: 'touch',
  pointerId: 1,
  button: 0,
  bubbles: true,
  ...extra,
  ...base,
});

describe('useSwipeNavigation', () => {
  it('fires onSwipe("right") for a rightward swipe and blocks the trailing click', () => {
    const onSwipe = vi.fn();
    const div = document.createElement('div');
    document.body.appendChild(div);
    const ref = makeRef(div);

    const { result } = renderHook(() => useSwipeNavigation(ref, { onSwipe }));

    fireEvent.pointerDown(div, pointerInit({ clientX: 100, clientY: 100 }));
    fireEvent.pointerMove(
      div,
      pointerInit({ clientX: 100 + SWIPE_THRESHOLD + 20, clientY: 100 }),
    );
    fireEvent.pointerUp(div, pointerInit({ clientX: 200, clientY: 100 }));

    expect(onSwipe).toHaveBeenCalledTimes(1);
    expect(onSwipe).toHaveBeenCalledWith('right');
    // Swipes must consume the click that touchend synthesises.
    expect(result.current.current).toBe(true);

    // A subsequent pointerdown clears the consume flag.
    fireEvent.pointerDown(div, pointerInit({ clientX: 0, clientY: 0 }));
    expect(result.current.current).toBe(false);

    div.remove();
  });

  it('fires onSwipe("left") for a leftward swipe', () => {
    const onSwipe = vi.fn();
    const div = document.createElement('div');
    document.body.appendChild(div);
    const ref = makeRef(div);

    renderHook(() => useSwipeNavigation(ref, { onSwipe }));

    fireEvent.pointerDown(div, pointerInit({ clientX: 200, clientY: 100 }));
    fireEvent.pointerMove(
      div,
      pointerInit({ clientX: 200 - SWIPE_THRESHOLD - 20, clientY: 100 }),
    );
    fireEvent.pointerUp(div, pointerInit({ clientX: 100, clientY: 100 }));

    expect(onSwipe).toHaveBeenCalledTimes(1);
    expect(onSwipe).toHaveBeenCalledWith('left');
    div.remove();
  });

  it('does not fire when movement is below the threshold', () => {
    const onSwipe = vi.fn();
    const div = document.createElement('div');
    document.body.appendChild(div);
    const ref = makeRef(div);

    renderHook(() => useSwipeNavigation(ref, { onSwipe }));

    fireEvent.pointerDown(div, pointerInit({ clientX: 100, clientY: 100 }));
    fireEvent.pointerMove(div, pointerInit({ clientX: 120, clientY: 100 }));
    fireEvent.pointerUp(div, pointerInit({ clientX: 120, clientY: 100 }));
    fireEvent.click(div);

    expect(onSwipe).not.toHaveBeenCalled();
    div.remove();
  });

  it('ignores vertical-dominant movement', () => {
    const onSwipe = vi.fn();
    const div = document.createElement('div');
    document.body.appendChild(div);
    const ref = makeRef(div);

    renderHook(() => useSwipeNavigation(ref, { onSwipe }));

    fireEvent.pointerDown(div, pointerInit({ clientX: 100, clientY: 100 }));
    // Horizontal travel exceeds the threshold but is dominated by vertical drift.
    fireEvent.pointerMove(div, pointerInit({ clientX: 160, clientY: 250 }));
    fireEvent.pointerUp(div, pointerInit({ clientX: 160, clientY: 250 }));

    expect(onSwipe).not.toHaveBeenCalled();
    div.remove();
  });

  it('ignores non-touch pointers (mouse keeps click-to-home)', () => {
    const onSwipe = vi.fn();
    const div = document.createElement('div');
    document.body.appendChild(div);
    const ref = makeRef(div);

    renderHook(() => useSwipeNavigation(ref, { onSwipe }));

    fireEvent.pointerDown(
      div,
      pointerInit({ clientX: 100, clientY: 100 }, { pointerType: 'mouse' }),
    );
    fireEvent.pointerMove(
      div,
      pointerInit({ clientX: 300, clientY: 100 }, { pointerType: 'mouse' }),
    );
    fireEvent.pointerUp(
      div,
      pointerInit({ clientX: 300, clientY: 100 }, { pointerType: 'mouse' }),
    );

    expect(onSwipe).not.toHaveBeenCalled();
    div.remove();
  });

  it('does not start a swipe on an excluded interactive target', () => {
    const onSwipe = vi.fn();
    const div = document.createElement('div');
    const button = document.createElement('button');
    div.appendChild(button);
    document.body.appendChild(div);
    const ref = makeRef(div);

    renderHook(() => useSwipeNavigation(ref, { onSwipe }));

    fireEvent.pointerDown(button, pointerInit({ clientX: 100, clientY: 100 }));
    fireEvent.pointerMove(button, pointerInit({ clientX: 400, clientY: 100 }));
    fireEvent.pointerUp(button, pointerInit({ clientX: 400, clientY: 100 }));

    expect(onSwipe).not.toHaveBeenCalled();
    div.remove();
  });

  it('respects a custom exclude selector', () => {
    const onSwipe = vi.fn();
    const div = document.createElement('div');
    const nav = document.createElement('div');
    nav.setAttribute('data-nav', 'footer');
    div.appendChild(nav);
    div.setAttribute('tabindex', '0');
    document.body.appendChild(div);
    const ref = makeRef(div);

    renderHook(() =>
      useSwipeNavigation(ref, { onSwipe, exclude: '[data-nav]' }),
    );

    fireEvent.pointerDown(nav, pointerInit({ clientX: 100, clientY: 100 }));
    fireEvent.pointerMove(nav, pointerInit({ clientX: 400, clientY: 100 }));
    fireEvent.pointerUp(nav, pointerInit({ clientX: 400, clientY: 100 }));

    expect(onSwipe).not.toHaveBeenCalled();
    div.remove();
  });
});
