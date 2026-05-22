import { z } from 'zod';

export const createHouseholdSchema = z.object({
  name: z.string().trim().min(1, 'Household name is required'),
});

export type CreateHouseholdValues = z.infer<typeof createHouseholdSchema>;

export const inviteMemberSchema = z.object({
  uid: z.string().trim().min(1, 'User ID is required'),
});

export type InviteMemberValues = z.infer<typeof inviteMemberSchema>;
