'use server';
/**
 * @fileOverview A Genkit flow for generating professional and customizable boilerplate text for terms & conditions or warranty information.
 *
 * - generateReceiptBoilerplate - A function that handles the boilerplate generation process.
 * - GenerateReceiptBoilerplateInput - The input type for the generateReceiptBoilerplate function.
 * - GenerateReceiptBoilerplateOutput - The return type for the generateReceiptBoilerplate function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateReceiptBoilerplateInputSchema = z.object({
  boilerplateType: z.enum(['terms_and_conditions', 'warranty']).describe('The type of boilerplate text to generate (terms_and_conditions or warranty).'),
  context: z.string().optional().describe('Optional additional context for generating the boilerplate, such as product type or specific business policies.'),
});
export type GenerateReceiptBoilerplateInput = z.infer<typeof GenerateReceiptBoilerplateInputSchema>;

const GenerateReceiptBoilerplateOutputSchema = z.object({
  boilerplateText: z.string().describe('The generated professional boilerplate text.'),
});
export type GenerateReceiptBoilerplateOutput = z.infer<typeof GenerateReceiptBoilerplateOutputSchema>;

export async function generateReceiptBoilerplate(input: GenerateReceiptBoilerplateInput): Promise<GenerateReceiptBoilerplateOutput> {
  return generateReceiptBoilerplateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReceiptBoilerplatePrompt',
  input: { schema: GenerateReceiptBoilerplateInputSchema },
  output: { schema: GenerateReceiptBoilerplateOutputSchema },
  prompt: `You are an AI assistant specialized in generating professional and legally sound boilerplate text for business receipts.
Generate a comprehensive and customizable block of text for {{boilerplateType}} for Sultantech Computers.

Instructions:
- The language should be clear, professional, and concise.
- If the boilerplateType is 'terms_and_conditions', include general terms for computer sales, return policies, and data privacy statements.
- If the boilerplateType is 'warranty', include standard warranty duration (e.g., 1 year), coverage details (e.g., manufacturing defects), and exclusions (e.g., physical damage).
- Consider the provided context: "{{{context}}}" to tailor the text where appropriate.
- Ensure the output is formatted as a single block of text suitable for inclusion at the bottom of a receipt.
- Avoid using placeholders that the AI cannot fill (e.g., [date], [signature]).

Output ONLY the boilerplate text, do not include any conversational filler.
`,
});

const generateReceiptBoilerplateFlow = ai.defineFlow(
  {
    name: 'generateReceiptBoilerplateFlow',
    inputSchema: GenerateReceiptBoilerplateInputSchema,
    outputSchema: GenerateReceiptBoilerplateOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
