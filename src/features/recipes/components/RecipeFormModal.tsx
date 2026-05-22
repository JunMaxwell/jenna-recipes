import { FC, FormEvent } from 'react';
import { AlertCircle } from 'lucide-react';
import { Recipe, Category } from '../../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface RecipeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingRecipe: Recipe | null;
  recipeFormError: string | null;
  onSaveRecipe: (recipeData: Partial<Recipe>) => void;
}

export const RecipeFormModal: FC<RecipeFormModalProps> = ({
  isOpen,
  onClose,
  editingRecipe,
  recipeFormError,
  onSaveRecipe,
}) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    onSaveRecipe({
      title: formData.get('title') as string,
      category: formData.get('category') as Category,
      rating: Number(formData.get('rating')),
      estimatedTime: formData.get('estimatedTime') ? Number(formData.get('estimatedTime')) : null,
      ingredients: (formData.get('ingredients') as string).split('\n').filter(i => i.trim()),
      instructions: (formData.get('instructions') as string).split('\n').filter(i => i.trim()),
      imageUrl: formData.get('imageUrl') as string,
      sourceUrl: formData.get('sourceUrl') as string,
    });
  };

  const formKey = editingRecipe 
    ? (editingRecipe.id || `imported-${editingRecipe.title}`) 
    : 'new';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 flex flex-col gap-4 rounded-3xl">
        <DialogHeader className="border-b border-stone-200 dark:border-stone-800 pb-3 pr-8">
          <DialogTitle className="text-2xl font-serif font-semibold text-stone-800 dark:text-stone-150">
            {editingRecipe?.id ? "Edit Recipe" : "Add New Recipe"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {editingRecipe?.id ? "Edit Recipe" : "Add New Recipe"}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 text-stone-600 dark:text-stone-300">
          <form 
            key={formKey}
            onSubmit={handleSubmit} 
            className="space-y-6"
          >
            {recipeFormError && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{recipeFormError}</p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Title</label>
                <Input 
                  name="title" 
                  required 
                  defaultValue={editingRecipe?.title} 
                  className="w-full h-11 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Category</label>
                <Select 
                  name="category" 
                  defaultValue={editingRecipe?.category || 'Dinner'} 
                >
                  <SelectTrigger className="w-full h-11 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drink', 'Other'].map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Rating (1-5)</label>
                <Input 
                  name="rating" 
                  type="number" 
                  min="1" 
                  max="5" 
                  defaultValue={editingRecipe?.rating || 5} 
                  className="w-full h-11 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Time (minutes)</label>
                <Input 
                  name="estimatedTime" 
                  type="number" 
                  min="1" 
                  defaultValue={editingRecipe?.estimatedTime || undefined} 
                  className="w-full h-11 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100" 
                  placeholder="e.g. 30" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Ingredients (One per line)</label>
              <Textarea 
                name="ingredients" 
                required 
                rows={5} 
                defaultValue={editingRecipe?.ingredients.join('\n')} 
                className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Instructions (One step per line)</label>
              <Textarea 
                name="instructions" 
                required 
                rows={5} 
                defaultValue={editingRecipe?.instructions.join('\n')} 
                className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100" 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Image URL (Optional)</label>
                <Input 
                  name="imageUrl" 
                  defaultValue={editingRecipe?.imageUrl} 
                  className="w-full h-11 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Source URL (Optional)</label>
                <Input 
                  name="sourceUrl" 
                  defaultValue={editingRecipe?.sourceUrl} 
                  className="w-full h-11 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100" 
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full h-auto py-4 text-lg">Save Recipe</Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
