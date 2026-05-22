import { FC } from 'react';
import { Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface FirstFamilyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirstFamilyModal: FC<FirstFamilyModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 flex flex-col gap-4 rounded-3xl">
        <DialogHeader className="border-b border-stone-200 dark:border-stone-800 pb-3 pr-8">
          <DialogTitle className="text-2xl font-serif font-semibold text-stone-800 dark:text-stone-150">
            Welcome to Heirloom!
          </DialogTitle>
          <DialogDescription className="sr-only">
            Welcome to Heirloom!
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 text-stone-600 dark:text-stone-300 space-y-6 text-center">
          <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-stone-400" />
          </div>
          <div className="space-y-4">
            <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
              Your family kitchen has been created! 
            </p>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-100 dark:border-amber-900/50 rounded-2xl text-amber-800 dark:text-amber-200 text-sm text-left">
              <p className="font-bold mb-1">Important Demo Info:</p>
              <p>To keep this demo fast and clean, all data is automatically deleted after 24 hours.</p>
            </div>
            <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
              If you want to create your own permanent version and keep your family recipes forever, click the <strong>Remix</strong> button in the top right of AI Studio!
            </p>
          </div>
          <Button className="w-full py-4 mt-4" onClick={onClose}>
            Start Cooking
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
