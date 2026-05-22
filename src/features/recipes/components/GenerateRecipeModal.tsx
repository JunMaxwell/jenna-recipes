import { FC, useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Category } from '../../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  generateRecipeSchema,
  type GenerateRecipeInput,
  type GenerateRecipeValues,
} from '../schemas/recipe-schema';

export interface GenerateRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isProcessing: boolean;
  onGenerateRecipe: (values: { category: Category; details: string }) => void;
}

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drink', 'Other'] as const;

const LABEL_CLASS = 'text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider';

export const GenerateRecipeModal: FC<GenerateRecipeModalProps> = ({
  isOpen,
  onClose,
  isProcessing,
  onGenerateRecipe,
}) => {
  const form = useForm<GenerateRecipeInput>({
    resolver: zodResolver(generateRecipeSchema) as unknown as Resolver<GenerateRecipeInput>,
    defaultValues: { category: 'Dinner', details: '' },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({ category: 'Dinner', details: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const onSubmit = (raw: GenerateRecipeInput) => {
    const values = raw as unknown as GenerateRecipeValues;
    onGenerateRecipe({ category: values.category, details: values.details ?? '' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 flex flex-col gap-4 rounded-3xl">
        <DialogHeader className="border-b border-stone-200 dark:border-stone-800 pb-3 pr-8">
          <DialogTitle className="text-2xl font-serif font-semibold text-stone-800 dark:text-stone-150">
            Generate AI Recipe
          </DialogTitle>
          <DialogDescription className="sr-only">
            Generate AI Recipe
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 text-stone-600 dark:text-stone-300">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={LABEL_CLASS}>Meal Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange} disabled={isProcessing}>
                      <FormControl>
                        <SelectTrigger className="w-full h-11 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100">
                          <SelectValue placeholder="Select a meal type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={LABEL_CLASS}>Preferences (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Needs to be vegan, use sweet potatoes, spicy..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100"
                        disabled={isProcessing}
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                  </>
                ) : (
                  'Generate Recipe & Image'
                )}
              </Button>
              <p className="text-sm text-stone-400 text-center italic">
                Gemini will create a unique recipe and generate a photo to match.
              </p>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
