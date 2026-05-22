import { FC } from 'react';
import { motion } from 'motion/react';
import { Utensils, Star, Clock, Soup } from 'lucide-react';
import { Recipe } from '../../../types';
import { Card } from '@/components/ui/card';

export interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
}

export const RecipeCard: FC<RecipeCardProps> = ({ recipe, onSelect }) => {
  const estimatedTime = recipe.estimatedTime 
    ? `${recipe.estimatedTime}m` 
    : `${recipe.instructions.length * 5}m`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      onClick={() => onSelect(recipe)}
      className="group cursor-pointer"
    >
      <Card className="h-full flex flex-col gap-4 overflow-hidden p-0 border-stone-200 dark:border-stone-800">
        <div className="aspect-[4/3] bg-stone-200 dark:bg-stone-800 relative overflow-hidden">
          {recipe.imageUrl ? (
            <img 
              src={recipe.imageUrl} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform group-hover:scale-105" 
              alt={recipe.title} 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-400 dark:text-stone-600">
              <Utensils className="w-12 h-12 opacity-20" />
            </div>
          )}
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-100 shadow-sm">
            {recipe.category}
          </div>
        </div>
        <div className="p-6 pt-2 space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-50 line-clamp-1">
              {recipe.title}
            </h3>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-bold">{recipe.rating || 0}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-stone-400 dark:text-stone-500 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{estimatedTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Soup className="w-4 h-4" />
              <span>{recipe.ingredients.length} ingredients</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
