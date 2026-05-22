import { Edit2, Link as LinkIcon, Star, Trash2 } from 'lucide-react';

import { FC } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Recipe } from '../../../types';

export interface ViewRecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onEdit: (recipe: Recipe) => void;
  isDeleteConfirmOpen: boolean;
  setIsDeleteConfirmOpen: (open: boolean) => void;
}

export const ViewRecipeModal: FC<ViewRecipeModalProps> = ({
  recipe,
  onClose,
  onDelete,
  onEdit,
  isDeleteConfirmOpen,
  setIsDeleteConfirmOpen,
}) => {
  if (!recipe) return null;

  return (
    <Dialog
      open={!!recipe}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 flex flex-col gap-4 rounded-3xl">
        <DialogHeader className="border-b border-stone-200 dark:border-stone-800 pb-3 pr-8">
          <DialogTitle className="text-2xl font-serif font-semibold text-stone-800 dark:text-stone-150">
            {recipe.title}
          </DialogTitle>
          <DialogDescription className="sr-only">{recipe.title}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 text-stone-600 dark:text-stone-300 space-y-8">
          <div className="flex items-center gap-4 text-stone-500 dark:text-stone-400">
            <span className="px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-xs font-bold uppercase">
              {recipe.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-bold">{recipe.rating || 0}</span>
            </div>
            {recipe.sourceUrl && (
              <a
                href={recipe.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-stone-400 hover:text-stone-800 dark:hover:text-stone-100"
              >
                <LinkIcon className="w-4 h-4" /> Source
              </a>
            )}
          </div>

          {recipe.imageUrl && (
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-stone-100 dark:bg-stone-800">
              <img
                src={recipe.imageUrl}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                alt={recipe.title}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-4">
              <h4 className="text-lg font-serif font-bold border-b border-stone-200 dark:border-stone-800 pb-2 text-stone-900 dark:text-stone-50">
                Ingredients
              </h4>
              <ul className="space-y-2">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-2 text-stone-600 dark:text-stone-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-stone-700 mt-2 flex-shrink-0" />
                    {ing}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-lg font-serif font-bold border-b border-stone-200 dark:border-stone-800 pb-2 text-stone-900 dark:text-stone-50">
                Instructions
              </h4>
              <ol className="space-y-6">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center font-bold text-stone-400 dark:text-stone-500 text-sm">
                      {i + 1}
                    </span>
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed pt-1">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="pt-8 border-t border-stone-200 dark:border-stone-800 flex justify-between">
            {isDeleteConfirmOpen ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-red-650">Are you sure?</span>
                <Button variant="destructive" onClick={() => onDelete(recipe.id!)}>
                  Yes, Delete
                </Button>
                <Button variant="ghost" onClick={() => setIsDeleteConfirmOpen(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button variant="destructive" onClick={() => setIsDeleteConfirmOpen(true)}>
                <Trash2 className="w-4 h-4" /> Delete
              </Button>
            )}
            <Button onClick={() => onEdit(recipe)}>
              <Edit2 className="w-4 h-4" /> Edit Recipe
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
