import { FC } from 'react';
import { Loader2 } from 'lucide-react';
import { Category } from '../../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface GenerateRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  aiCategory: Category;
  setAiCategory: (category: Category) => void;
  aiDetails: string;
  setAiDetails: (details: string) => void;
  isProcessing: boolean;
  onGenerateRecipe: () => void;
}

export const GenerateRecipeModal: FC<GenerateRecipeModalProps> = ({
  isOpen,
  onClose,
  aiCategory,
  setAiCategory,
  aiDetails,
  setAiDetails,
  isProcessing,
  onGenerateRecipe,
}) => {
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
        <div className="flex-1 text-stone-600 dark:text-stone-300 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              Meal Type
            </label>
            <Select 
              value={aiCategory} 
              onValueChange={(val) => setAiCategory(val as Category)}
              disabled={isProcessing}
            >
              <SelectTrigger className="w-full h-11 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100">
                <SelectValue placeholder="Select a meal type" />
              </SelectTrigger>
              <SelectContent>
                {['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drink', 'Other'].map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              Preferences (Optional)
            </label>
            <Textarea 
              placeholder="e.g., Needs to be vegan, use sweet potatoes, spicy..."
              value={aiDetails}
              onChange={(e) => setAiDetails(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100"
              disabled={isProcessing}
            />
          </div>
          <Button 
            className="w-full py-4" 
            onClick={onGenerateRecipe} 
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Generating...
              </>
            ) : (
              "Generate Recipe & Image"
            )}
          </Button>
          <p className="text-sm text-stone-400 text-center italic">
            Gemini will create a unique recipe and generate a photo to match.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
