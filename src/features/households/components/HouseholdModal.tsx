import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight, Loader2, Trash2, X } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { FC } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { Household } from '../../../types';
import {
  type CreateHouseholdValues,
  type InviteMemberValues,
  createHouseholdSchema,
  inviteMemberSchema,
} from '../schemas/household-schema';

export interface HouseholdModalProps {
  isOpen: boolean;
  onClose: () => void;
  households: Household[];
  selectedHousehold: Household | null;
  onSelectHousehold: (household: Household) => void;
  userUid: string;
  isProcessing: boolean;
  onCreateHousehold: (name: string) => void;
  onAddMember: (userId: string) => void;
  onRemoveMember: (userId: string) => void;
  onDeleteHousehold: (householdId: string) => void;
  copied: boolean;
  onCopyId: () => void;
  isDeleteHouseholdConfirmOpen: boolean;
  setIsDeleteHouseholdConfirmOpen: (open: boolean) => void;
}

export const HouseholdModal: FC<HouseholdModalProps> = ({
  isOpen,
  onClose,
  households,
  selectedHousehold,
  onSelectHousehold,
  userUid,
  isProcessing,
  onCreateHousehold,
  onAddMember,
  onRemoveMember,
  onDeleteHousehold,
  copied,
  onCopyId,
  isDeleteHouseholdConfirmOpen,
  setIsDeleteHouseholdConfirmOpen,
}) => {
  const inviteForm = useForm<InviteMemberValues>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: { uid: '' },
  });

  const createForm = useForm<CreateHouseholdValues>({
    resolver: zodResolver(createHouseholdSchema),
    defaultValues: { name: '' },
  });

  const onInviteSubmit = ({ uid }: InviteMemberValues) => {
    onAddMember(uid);
    inviteForm.reset();
  };

  const onCreateSubmit = ({ name }: CreateHouseholdValues) => {
    onCreateHousehold(name);
    createForm.reset();
  };

  const isOwner = selectedHousehold && selectedHousehold.ownerId === userUid;

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
            My Households
          </DialogTitle>
          <DialogDescription className="sr-only">My Households</DialogDescription>
        </DialogHeader>
        <div className="flex-1 text-stone-600 dark:text-stone-300 space-y-8">
          {/* Switch Household */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">
              Switch Household
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {households.map((h) => (
                <button
                  key={h.id}
                  onClick={() => {
                    onSelectHousehold(h);
                    onClose();
                  }}
                  className={cn(
                    'flex items-center justify-between p-4 rounded-2xl border transition-all',
                    selectedHousehold?.id === h.id
                      ? 'bg-stone-800 dark:bg-stone-100 border-stone-800 dark:border-stone-100 text-stone-50 dark:text-stone-900'
                      : 'bg-white dark:bg-stone-850 border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 text-stone-900 dark:text-stone-100',
                  )}
                >
                  <span className="font-medium">{h.name}</span>
                  {selectedHousehold?.id === h.id && <ChevronRight className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Invite Member Section (Only if Owner) */}
          {selectedHousehold && isOwner && (
            <div className="space-y-4 pt-8 border-t border-stone-200 dark:border-stone-800">
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">
                Invite Member
              </h3>
              <p className="text-xs text-stone-400 italic">
                Enter the User ID of the person you want to invite.
              </p>
              <Form {...inviteForm}>
                <form onSubmit={inviteForm.handleSubmit(onInviteSubmit)} className="space-y-2">
                  <div className="flex gap-2">
                    <FormField
                      control={inviteForm.control}
                      name="uid"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="User UID"
                              className="w-full h-10 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="h-10">
                      Invite
                    </Button>
                  </div>
                </form>
              </Form>
              <div className="space-y-2">
                {Object.entries(selectedHousehold.members).map(([uid, role]) => (
                  <div
                    key={uid}
                    className="flex justify-between items-center text-sm p-2 bg-white dark:bg-stone-900 rounded-lg border border-stone-100 dark:border-stone-800"
                  >
                    <span className="font-mono text-xs text-stone-400">{uid.slice(0, 8)}...</span>
                    <div className="flex items-center gap-2">
                      <span className="capitalize px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 text-[10px] font-bold">
                        {role}
                      </span>
                      {uid !== userUid && (
                        <button
                          onClick={() => onRemoveMember(uid)}
                          className="text-stone-400 hover:text-red-500 transition-colors"
                          title="Remove member"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My User ID */}
          <div className="space-y-4 pt-8 border-t border-stone-200 dark:border-stone-800">
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">
              My User ID
            </h3>
            <div className="flex items-center justify-between p-3 bg-stone-100 dark:bg-stone-850 rounded-xl">
              <code className="text-xs font-mono text-stone-600 dark:text-stone-300">
                {userUid}
              </code>
              <button
                onClick={onCopyId}
                className="text-[10px] font-bold uppercase text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Create New Household */}
          <div className="space-y-4 pt-8 border-t border-stone-200 dark:border-stone-800">
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">
              Create New Household
            </h3>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-2">
                <div className="flex gap-2">
                  <FormField
                    control={createForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="e.g. The Smith Family"
                            className="w-full h-10 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100"
                            disabled={isProcessing}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="h-10" disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                      </>
                    ) : (
                      'Create'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Delete Household */}
          {selectedHousehold && isOwner && (
            <div className="pt-8 border-t border-stone-200 dark:border-stone-800 flex justify-end">
              {isDeleteHouseholdConfirmOpen ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-red-650">Are you sure?</span>
                  <Button
                    variant="destructive"
                    onClick={() => onDeleteHousehold(selectedHousehold.id!)}
                  >
                    Yes, Delete Household
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setIsDeleteHouseholdConfirmOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button variant="destructive" onClick={() => setIsDeleteHouseholdConfirmOpen(true)}>
                  <Trash2 className="w-4 h-4" /> Delete Household
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
