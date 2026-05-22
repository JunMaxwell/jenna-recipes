import { FC } from 'react';
import { AnimatePresence } from 'motion/react';
import { Search } from 'lucide-react';
import { Recipe } from '../../../types';
import { RecipeCard } from './RecipeCard';

export interface RecipeGridProps {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
}

export const RecipeGrid: FC<RecipeGridProps> = ({ recipes, onSelectRecipe }) => {
  if (recipes.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <div className="w-20 h-20 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto">
          <Search className="w-8 h-8 text-stone-300 dark:text-stone-650" />
        </div>
        <h3 className="text-xl font-serif font-medium text-stone-500 dark:text-stone-400">No recipes found</h3>
        <p className="text-stone-400 dark:text-stone-500">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <AnimatePresence mode="popLayout">
        {recipes.map((recipe) => (
          <RecipeCard 
            key={recipe.id} 
            recipe={recipe} 
            onSelect={onSelectRecipe} 
          />
        ))}
      </AnimatePresence>
    </section>
  );
};
