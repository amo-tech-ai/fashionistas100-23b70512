import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  disabled?: boolean;
  pullDistance?: number;
  triggerDistance?: number;
  className?: string;
}

/**
 * PullToRefresh Component
 * 
 * Enables pull-to-refresh functionality on mobile devices
 * 
 * @param onRefresh - Async function to call when refresh is triggered
 * @param children - Content to wrap
 * @param disabled - Disable pull-to-refresh
 * @param pullDistance - Maximum pull distance in pixels (default: 80)
 * @param triggerDistance - Distance to trigger refresh (default: 60)
 * 
 * @example
 * <PullToRefresh onRefresh={async () => await fetchData()}>
 *   <YourContent />
 * </PullToRefresh>
 */
export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  disabled = false,
  pullDistance = 80,
  triggerDistance = 60,
  className,
}) => {
  const isMobile = useIsMobile();
  const [pullHeight, setPullHeight] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isReleased, setIsReleased] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  // Only enable on mobile
  if (!isMobile || disabled) {
    return <>{children}</>;
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Only trigger if scrolled to top
      if (container.scrollTop === 0 && !isRefreshing) {
        startY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (startY.current === 0 || isRefreshing) return;

      currentY.current = e.touches[0].clientY;
      const diff = currentY.current - startY.current;

      // Only pull down
      if (diff > 0 && container.scrollTop === 0) {
        e.preventDefault();
        
        // Apply resistance: pull gets harder the further you go
        const resistance = Math.pow(diff / pullDistance, 0.7) * pullDistance;
        const newHeight = Math.min(resistance, pullDistance);
        setPullHeight(newHeight);
      }
    };

    const handleTouchEnd = () => {
      if (pullHeight > triggerDistance && !isRefreshing) {
        setIsRefreshing(true);
        setIsReleased(true);
        
        // Trigger refresh
        onRefresh()
          .then(() => {
            setTimeout(() => {
              setIsRefreshing(false);
              setIsReleased(false);
              setPullHeight(0);
            }, 500);
          })
          .catch((error) => {
            console.error('[PullToRefresh] Error:', error);
            setIsRefreshing(false);
            setIsReleased(false);
            setPullHeight(0);
          });
      } else {
        setPullHeight(0);
      }

      startY.current = 0;
      currentY.current = 0;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullHeight, isRefreshing, onRefresh, pullDistance, triggerDistance]);

  const rotation = (pullHeight / pullDistance) * 360;
  const opacity = Math.min(pullHeight / triggerDistance, 1);
  const scale = Math.min(pullHeight / triggerDistance, 1);

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full h-full overflow-auto', className)}
    >
      {/* Pull indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center pointer-events-none z-50"
        style={{
          height: pullHeight,
          opacity,
          transition: isReleased || isRefreshing ? 'all 0.3s ease-out' : 'none',
        }}
      >
        <div
          className={cn(
            'flex items-center justify-center w-12 h-12 rounded-full',
            'bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600',
            'shadow-lg',
            isRefreshing && 'animate-spin'
          )}
          style={{
            transform: `scale(${scale}) rotate(${isRefreshing ? 0 : rotation}deg)`,
            transition: isRefreshing ? 'transform 0.3s ease-out' : 'none',
          }}
        >
          <RefreshCw className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Content with pull offset */}
      <div
        style={{
          transform: `translateY(${pullHeight}px)`,
          transition: isReleased || isRefreshing ? 'transform 0.3s ease-out' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
