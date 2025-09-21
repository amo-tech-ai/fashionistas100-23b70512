import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'avatar' | 'number' | 'grid';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  className, 
  variant = 'text',
  count = 1
}) => {
  const baseClasses = "animate-pulse bg-gray-200 rounded";
  
  const variantClasses = {
    text: "h-4 w-full",
    card: "h-32 w-full",
    avatar: "h-12 w-12 rounded-full",
    number: "h-8 w-16",
    grid: "h-48 w-full"
  };

  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: count }, (_, i) => (
          <div 
            key={i}
            className={cn(
              baseClasses,
              variantClasses[variant],
              className
            )} 
          />
        ))}
      </div>
    );
  }

  return (
    <div 
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )} 
    />
  );
};

export default LoadingSkeleton;
