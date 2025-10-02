import { useRef, useEffect, RefObject } from 'react';

interface SwipeGestureConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  minSwipeDistance?: number;
  maxSwipeTime?: number;
  preventScroll?: boolean;
}

interface TouchPosition {
  x: number;
  y: number;
  time: number;
}

/**
 * useSwipeGesture Hook
 * 
 * Detects swipe gestures on touch devices
 * 
 * @param config Configuration object with swipe handlers
 * @returns Ref to attach to the swipeable element
 * 
 * @example
 * const swipeRef = useSwipeGesture({
 *   onSwipeLeft: () => console.log('Swiped left'),
 *   onSwipeRight: () => console.log('Swiped right'),
 *   minSwipeDistance: 50,
 * });
 * 
 * <div ref={swipeRef}>Swipe me!</div>
 */
export const useSwipeGesture = <T extends HTMLElement = HTMLDivElement>(
  config: SwipeGestureConfig = {}
): RefObject<T> => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    minSwipeDistance = 50,
    maxSwipeTime = 500,
    preventScroll = false,
  } = config;

  const elementRef = useRef<T>(null);
  const touchStart = useRef<TouchPosition | null>(null);
  const touchEnd = useRef<TouchPosition | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (preventScroll) {
        e.preventDefault();
      }

      const touch = e.touches[0];
      touchStart.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
      touchEnd.current = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchEnd.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
    };

    const handleTouchEnd = () => {
      if (!touchStart.current || !touchEnd.current) return;

      const deltaX = touchEnd.current.x - touchStart.current.x;
      const deltaY = touchEnd.current.y - touchStart.current.y;
      const deltaTime = touchEnd.current.time - touchStart.current.time;

      // Check if swipe was fast enough
      if (deltaTime > maxSwipeTime) {
        touchStart.current = null;
        touchEnd.current = null;
        return;
      }

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Horizontal swipe
      if (absX > absY && absX > minSwipeDistance) {
        if (deltaX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
      }
      // Vertical swipe
      else if (absY > absX && absY > minSwipeDistance) {
        if (deltaY > 0) {
          onSwipeDown?.();
        } else {
          onSwipeUp?.();
        }
      }

      touchStart.current = null;
      touchEnd.current = null;
    };

    // Add event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: !preventScroll });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd);

    // Cleanup
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, minSwipeDistance, maxSwipeTime, preventScroll]);

  return elementRef;
};

/**
 * Simple swipe detector (returns swipe direction)
 */
export const useSwipeDetector = <T extends HTMLElement = HTMLDivElement>(
  onSwipe: (direction: 'left' | 'right' | 'up' | 'down') => void,
  options: Omit<SwipeGestureConfig, 'onSwipeLeft' | 'onSwipeRight' | 'onSwipeUp' | 'onSwipeDown'> = {}
): RefObject<T> => {
  return useSwipeGesture<T>({
    ...options,
    onSwipeLeft: () => onSwipe('left'),
    onSwipeRight: () => onSwipe('right'),
    onSwipeUp: () => onSwipe('up'),
    onSwipeDown: () => onSwipe('down'),
  });
};

export default useSwipeGesture;
