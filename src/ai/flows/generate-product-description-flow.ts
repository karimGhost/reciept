'use server';
/**
 * @fileOverview A Genkit flow for generating detailed product descriptions for sales items.
 *
 * - generateProductDescription - A function that handles the product description generation process.
 * - GenerateProductDescriptionInput - The input type for the generateProductDescription function.
 * - GenerateProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductDescriptionInputSchema = z.object({
  itemName: z.string().describe('The name of the product, e.g., Laptop, Desktop, Accessories.').min(1, 'Item name cannot be empty.'),
  specs: z.string().describe('Detailed specifications or keywords for the product, e.g., "8GB RAM, 256GB SSD, Intel i5 12th Gen" or "Ergonomic design, RGB lighting".').min(1, 'Specifications cannot be empty.'),
});
export type GenerateProductDescriptionInput = z.infer<typeof GenerateProductDescriptionInputSchema>;

const GenerateProductDescriptionOutputSchema = z.object({
  description: z.string().describe('A detailed and consistent product description suitable for a sales receipt.'),
});
export type GenerateProductDescriptionOutput = z.infer<typeof GenerateProductDescriptionOutputSchema>;

export async function generateProductDescription(input: GenerateProductDescriptionInput): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}

const generateProductDescriptionPrompt = ai.definePrompt({
  name: 'generateProductDescriptionPrompt',
  input: {schema: GenerateProductDescriptionInputSchema},
  output: {schema: GenerateProductDescriptionOutputSchema},
  prompt: `You are an expert product copywriter for Sultantech Computers, specializing in creating clear, concise, and detailed product descriptions for sales receipts.

Generate a professional and accurate product description based on the provided item name and specifications. The description should highlight key features and benefits in a way that is suitable for a sales document.

Item Name: {{{itemName}}}
Specifications: {{{specs}}}`,
});

const generateProductDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionFlow',
    inputSchema: GenerateProductDescriptionInputSchema,
    outputSchema: GenerateProductDescriptionOutputSchema,
  },
  async input => {
    const {output} = await generateProductDescriptionPrompt(input);
    return output!;
  }
);
