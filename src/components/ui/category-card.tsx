import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  title: string;
  description: string;
  initialLikes: number;
  imageUrl: string;
  className?: string;
  onClick?: () => void;
}

const formatLikes = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
};

export const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  description,
  initialLikes,
  imageUrl,
  className,
  onClick,
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
      onClick={onClick}
      className={cn(
        'relative w-full h-64 rounded-2xl overflow-hidden p-6 text-white shadow-lg flex items-end isolate cursor-pointer',
        className
      )}
    >
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-[-1]">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>
      
      {/* Main Content */}
      <div className="w-full flex justify-between items-end">
        {/* Left Section: Info & Likes */}
        <div className="flex flex-col justify-end">
          <div className="space-y-1">
            <motion.h3 variants={itemVariants} className="text-2xl font-playfair font-bold leading-tight">
              {title}
            </motion.h3>
            <motion.p variants={itemVariants} className="text-sm font-inter opacity-90">
              {description}
            </motion.p>
          </div>
          <motion.button
            variants={itemVariants}
            onClick={handleLikeClick}
            className={cn(
              'mt-4 flex items-center gap-2 w-fit px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300',
              isLiked
                ? 'bg-[hsl(var(--breef-orange))]/90 text-white'
                : 'bg-white/20 text-white backdrop-blur-sm hover:bg-white/30'
            )}
          >
            <motion.div whileTap={{ scale: 1.3 }}>
              <Heart
                className={cn('w-4 h-4 transition-all', isLiked ? 'fill-current' : 'fill-transparent')}
              />
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.span
                key={likes}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-10 text-left"
              >
                {formatLikes(likes)}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
