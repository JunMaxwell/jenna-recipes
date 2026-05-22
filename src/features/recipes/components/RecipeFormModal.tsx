import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { type Resolver, useForm } from 'react-hook-form';

import { FC, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { Recipe } from '../../../types';
import {
  type RecipeFormInput,
  type RecipeFormValues,
  recipeFormSchema,
} from '../schemas/recipe-schema';

export interface RecipeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingRecipe: Recipe | null;
  recipeFormError: string | null;
  onSaveRecipe: (recipeData: Partial<Recipe>) => void;
}

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drink', 'Other'] as const;

const LABEL_CLASS = 'text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider';
const FIELD_CLASS =
  'w-full h-11 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100';
const TEXTAREA_CLASS =
  'w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100';

const buildDefaults = (recipe: Recipe | null): RecipeFormInput => ({
  title: recipe?.title ?? '',
  category: (recipe?.category ?? 'Dinner') as RecipeFormInput['category'],
  rating: (recipe?.rating ?? 5) as RecipeFormInput['rating'],
  estimatedTime: (recipe?.estimatedTime ?? '') as RecipeFormInput['estimatedTime'],
  ingredients: recipe?.ingredients?.join('\n') ?? '',
  instructions: recipe?.instructions?.join('\n') ?? '',
  imageUrl: recipe?.imageUrl ?? '',
  sourceUrl: recipe?.sourceUrl ?? '',
});

export const RecipeFormModal: FC<RecipeFormModalProps> = ({
  isOpen,
  onClose,
  editingRecipe,
  recipeFormError,
  onSaveRecipe,
}) => {
  const form = useForm<RecipeFormInput>({
    resolver: zodResolver(recipeFormSchema) as unknown as Resolver<RecipeFormInput>,
    defaultValues: buildDefaults(editingRecipe),
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(buildDefaults(editingRecipe));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingRecipe]);

  const onSubmit = (raw: RecipeFormInput) => {
    const values = raw as unknown as RecipeFormValues;
    onSaveRecipe({
      title: values.title,
      category: values.category,
      rating: values.rating,
      estimatedTime: values.estimatedTime,
      ingredients: values.ingredients,
      instructions: values.instructions,
      imageUrl: values.imageUrl ?? '',
      sourceUrl: values.sourceUrl ?? '',
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 flex flex-col gap-4 rounded-3xl">
        <DialogHeader className="border-b border-stone-200 dark:border-stone-800 pb-3 pr-8">
          <DialogTitle className="text-2xl font-serif font-semibold text-stone-800 dark:text-stone-150">
            {editingRecipe?.id ? 'Edit Recipe' : 'Add New Recipe'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {editingRecipe?.id ? 'Edit Recipe' : 'Add New Recipe'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 text-stone-600 dark:text-stone-300">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {recipeFormError && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>{recipeFormError}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LABEL_CLASS}>Title</FormLabel>
                      <FormControl>
                        <Input {...field} className={FIELD_CLASS} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LABEL_CLASS}>Category</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className={FIELD_CLASS}>
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CATEGORIES.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LABEL_CLASS}>Rating (1-5)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={5}
                          {...field}
                          value={field.value ?? ''}
                          className={FIELD_CLASS}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estimatedTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LABEL_CLASS}>Time (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder="e.g. 30"
                          {...field}
                          value={field.value ?? ''}
                          className={FIELD_CLASS}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="ingredients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={LABEL_CLASS}>Ingredients (One per line)</FormLabel>
                    <FormControl>
                      <Textarea rows={5} {...field} className={TEXTAREA_CLASS} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={LABEL_CLASS}>Instructions (One step per line)</FormLabel>
                    <FormControl>
                      <Textarea rows={5} {...field} className={TEXTAREA_CLASS} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LABEL_CLASS}>Image URL (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ''} className={FIELD_CLASS} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sourceUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LABEL_CLASS}>Source URL (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ''} className={FIELD_CLASS} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" size="lg" className="w-full h-auto py-4 text-lg">
                Save Recipe
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
