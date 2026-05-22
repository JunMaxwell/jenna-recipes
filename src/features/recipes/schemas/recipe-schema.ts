import { z } from 'zod';
import type { Category } from '../../../types';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drink', 'Other'] as const;

const linesToArray = (value: string) =>
  value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .refine(
    (val) => !val || /^https?:\/\/.+/i.test(val),
    { message: 'Must be a valid URL' }
  );

export const recipeFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  category: z.enum(CATEGORIES satisfies readonly Category[]),
  rating: z.coerce.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  estimatedTime: z
    .union([z.literal(''), z.coerce.number().int().min(1, 'Time must be at least 1 minute')])
    .optional()
    .transform((val) => (val === '' || val === undefined ? null : val)),
  ingredients: z
    .string()
    .min(1, 'Add at least one ingredient')
    .transform(linesToArray)
    .refine((arr) => arr.length > 0, { message: 'Add at least one ingredient' }),
  instructions: z
    .string()
    .min(1, 'Add at least one instruction')
    .transform(linesToArray)
    .refine((arr) => arr.length > 0, { message: 'Add at least one instruction' }),
  imageUrl: optionalUrl,
  sourceUrl: optionalUrl,
});

export type RecipeFormInput = {
  title: string;
  category: Category;
  rating: number | string;
  estimatedTime: number | string;
  ingredients: string;
  instructions: string;
  imageUrl?: string;
  sourceUrl?: string;
};
export type RecipeFormValues = z.output<typeof recipeFormSchema>;

const GENERATE_CATEGORIES = CATEGORIES;

export const generateRecipeSchema = z.object({
  category: z.enum(GENERATE_CATEGORIES satisfies readonly Category[]),
  details: z.string().trim().optional().default(''),
});

export type GenerateRecipeInput = z.input<typeof generateRecipeSchema>;
export type GenerateRecipeValues = z.output<typeof generateRecipeSchema>;

export const importRecipeSchema = z.object({
  url: z.string().trim().min(1, 'URL is required').url('Must be a valid URL'),
});

export type ImportRecipeInput = z.input<typeof importRecipeSchema>;
export type ImportRecipeValues = z.output<typeof importRecipeSchema>;
