import { useEffect, useRef } from 'react';

/**
 * Minimum pointer travel (px) along the primary (horizontal) axis before a
 * touch gesture is treated as a swipe rather than a tap.
 */
export const SWIPE_THRESHOLD = 50;

export type SwipeDirection = 'left' | 'right';

export interface UseSwipeNavigationOptions {
  /** Called when a horizontal swipe is detected. */
  onSwipe: (direction: SwipeDirection) => void;
  /** CSS selector for touch targets that should never initiate a swipe. */
  exclude?: string;
}

export type ConsumeClickRef = React.MutableRefObject<boolean>;

/**
 * Elements whose clicks must keep their default behaviour (the nav buttons,
 * links, form controls) and which must not start a swipe gesture.
 */
const INTERACTIVE_SELECTOR = 'button,a,input,select,textarea,[role="button"]';

/**
 * Touch-only horizontal swipe detection for the clock pages.
 *
 * Swiping is intentionally touch-only: mouse/touchpad users keep the existing
 * click-anywhere-to-go-home behaviour untouched, and the on-screen prev/next
 * buttons remain the canonical keyboard and pointer affordance.
 *
 * Direction mapping (matches the ⇽ / ⇾ nav buttons):
 *   - swipe left  (finger moves left,  dx < 0) -> "next"  clock
 *   - swipe right (finger moves right, dx > 0) -> "prev"  clock
 *
 * A gesture is only a swipe when travel along the horizontal axis both clears
 * {@link SWIPE_THRESHOLD} and dominates any vertical movement, so diagonal
 * drags and small jitter are treated as taps.
 *
 * Because a completed touch gesture still synthesises a `click`, the returned
 * `consumeClickRef` is set to `true` after a swipe. The caller's
 * `onClick -> navigate-home` handler should consult it first and reset it once
 * consumed, so a swiped gesture never also navigates home.
 */
export function useSwipeNavigation(
  containerRef: React.RefObject<HTMLElement | null>,
  { onSwipe, exclude }: UseSwipeNavigationOptions,
): ConsumeClickRef {
  const onSwipeRef = useRef(onSwipe);
  onSwipeRef.current = onSwipe;

  // True between swipe-detection and the trailing click that a `touchend`
  // synthesises. Checked by the caller's click handler.
  const consumeClickRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const fullSelector = exclude
      ? `${exclude},${INTERACTIVE_SELECTOR}`
      : INTERACTIVE_SELECTOR;

    const isExcludedTarget = (target: EventTarget | null): boolean => {
      if (!(target instanceof Element)) return true;
      return target.closest(fullSelector) !== null;
    };

    let trackedId: number | null = null;
    let startX = 0;
    let startY = 0;
    let decided = false;

    const onPointerDown = (e: PointerEvent) => {
      // A fresh contact of any kind always clears any pending swipe state, so
      // a stale flag can never suppress a legitimate tap to go home.
      consumeClickRef.current = false;

      // Swipes are a touch gesture only.
      if (e.pointerType !== 'touch' || e.button !== 0) return;
      if (isExcludedTarget(e.target)) return;
      // Ignore secondary touches while a gesture is already in flight.
      if (trackedId !== null) return;

      trackedId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      decided = false;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (trackedId === null || e.pointerId !== trackedId) return;
      if (decided) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const adx = Math.abs(dx);
      const ady = Math.abs(dy);

      if (adx < SWIPE_THRESHOLD) return;
      // Require a clearly horizontal gesture.
      if (adx <= ady) return;

      decided = true;
      consumeClickRef.current = true;
      onSwipeRef.current(dx < 0 ? 'left' : 'right');
    };

    const endTracking = () => {
      trackedId = null;
      decided = false;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (trackedId === null || e.pointerId !== trackedId) return;
      endTracking();
      // Keep consumeClickRef set: if a click is synthesised it must be
      // suppressed. It is cleared on the next pointerdown or in the click
      // handler once consumed.
    };

    const onCancel = () => {
      endTracking();
      // A cancelled/interrupted pointer does not synthesise a click, so a
      // pending click-suppression flag is no longer needed.
      consumeClickRef.current = false;
    };

    el.addEventListener('pointerdown', onPointerDown, { passive: true });
    el.addEventListener('pointermove', onPointerMove, { passive: true });
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onCancel);
    el.addEventListener('pointerleave', onCancel);

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointercancel', onCancel);
      el.removeEventListener('pointerleave', onCancel);
    };
  }, [containerRef, exclude]);

  return consumeClickRef;
}

export default useSwipeNavigation;
