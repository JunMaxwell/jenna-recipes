import { Trash2 } from 'lucide-react';

import { FC } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface DataDeletedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataDeletedModal: FC<DataDeletedModalProps> = ({ isOpen, onClose }) => {
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
            Data Cleanup
          </DialogTitle>
          <DialogDescription className="sr-only">Data Cleanup</DialogDescription>
        </DialogHeader>
        <div className="flex-1 text-stone-600 dark:text-stone-300 space-y-6 text-center">
          <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-stone-400" />
          </div>
          <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
            Welcome back! Just a heads up: to keep this demo clean, all user data is automatically
            deleted after 24 hours.
          </p>
          <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
            If you want your recipes to persist forever, click the <strong>Remix</strong> button in
            AI Studio to create your own private version of this app!
          </p>
          <Button className="w-full mt-4" onClick={onClose}>
            I understand
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
