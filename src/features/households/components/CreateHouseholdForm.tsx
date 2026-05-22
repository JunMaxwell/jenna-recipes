import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';

import { FC } from 'react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { type CreateHouseholdValues, createHouseholdSchema } from '../schemas/household-schema';

export interface CreateHouseholdFormProps {
  isProcessing: boolean;
  onCreateHousehold: (name: string) => void;
  onSignOut: () => void;
}

export const CreateHouseholdForm: FC<CreateHouseholdFormProps> = ({
  isProcessing,
  onCreateHousehold,
  onSignOut,
}) => {
  const form = useForm<CreateHouseholdValues>({
    resolver: zodResolver(createHouseholdSchema),
    defaultValues: { name: '' },
  });

  const onSubmit = ({ name }: CreateHouseholdValues) => {
    onCreateHousehold(name);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex flex-col items-center justify-center p-6 font-serif">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div className="w-20 h-20 bg-stone-800 rounded-3xl flex items-center justify-center mx-auto shadow-xl rotate-3">
          <Users className="w-10 h-10 text-stone-50" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Create a Household</h1>
          <p className="text-stone-500 text-lg">
            You need a household to start saving recipes. A household is where you and your family
            share traditions.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="e.g. The Smith Family"
                      className="w-full px-6 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-stone-800/10 outline-none bg-white shadow-sm"
                      disabled={isProcessing}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-left" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="lg"
              className="w-full h-auto py-4 text-lg shadow-lg"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                </>
              ) : (
                'Create Household'
              )}
            </Button>
          </form>
        </Form>

        <button
          onClick={onSignOut}
          className="text-stone-400 hover:text-stone-600 text-sm font-medium transition-colors"
        >
          Sign out
        </button>
      </motion.div>
    </div>
  );
};
