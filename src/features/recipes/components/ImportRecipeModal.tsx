import { FC } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface ImportRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  importUrl: string;
  setImportUrl: (url: string) => void;
  importError: string | null;
  setImportError: (error: string | null) => void;
  isProcessing: boolean;
  onImport: () => void;
}

export const ImportRecipeModal: FC<ImportRecipeModalProps> = ({
  isOpen,
  onClose,
  importUrl,
  setImportUrl,
  importError,
  setImportError,
  isProcessing,
  onImport,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 flex flex-col gap-4 rounded-3xl">
        <DialogHeader className="border-b border-stone-200 dark:border-stone-800 pb-3 pr-8">
          <DialogTitle className="text-2xl font-serif font-semibold text-stone-800 dark:text-stone-150">
            Import from Web
          </DialogTitle>
          <DialogDescription className="sr-only">
            Import from Web
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 text-stone-600 dark:text-stone-300 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              Recipe URL
            </label>
            <Input 
              type="url" 
              placeholder="https://example.com/best-cookies" 
              value={importUrl}
              onChange={(e) => { 
                setImportUrl(e.target.value); 
                setImportError(null); 
              }}
              className="w-full h-11 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100" 
              disabled={isProcessing}
            />
          </div>
          {importError && (
            <div className="p-4 bg-red-50 border border-red-100 dark:border-red-900/30 dark:bg-red-900/10 rounded-xl flex items-start gap-3 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>{importError}</p>
            </div>
          )}
          <Button 
            className="w-full py-4" 
            onClick={onImport} 
            disabled={isProcessing || !importUrl}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Extracting...
              </>
            ) : (
              "Import Recipe"
            )}
          </Button>
          <p className="text-sm text-stone-400 text-center italic">
            Gemini will intelligently gather only the essential recipe details and ingredients for you.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
