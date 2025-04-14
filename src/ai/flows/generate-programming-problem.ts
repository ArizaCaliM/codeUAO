'use server';

/**
 * @fileOverview A programming problem generator flow.
 *
 * - generateProgrammingProblem - A function that generates a programming problem based on difficulty.
 * - GenerateProgrammingProblemInput - The input type for the generateProgrammingProblem function.
 * - GenerateProgrammingProblemOutput - The return type for the generateProgrammingProblem function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateProgrammingProblemInputSchema = z.object({
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .describe('The difficulty level of the programming problem.'),
});
export type GenerateProgrammingProblemInput = z.infer<
  typeof GenerateProgrammingProblemInputSchema
>;

const GenerateProgrammingProblemOutputSchema = z.object({
  title: z.string().describe('The title of the programming problem.'),
  description: z.string().describe('The detailed description of the problem.'),
  inputFormat: z.string().describe('The format of the input.'),
  outputFormat: z.string().describe('The format of the expected output.'),
  example: z.string().describe('An example input and its corresponding output.'),
  constraints: z.string().describe('Constraints on the input values.'),
});
export type GenerateProgrammingProblemOutput = z.infer<
  typeof GenerateProgrammingProblemOutputSchema
>;

export async function generateProgrammingProblem(
  input: GenerateProgrammingProblemInput
): Promise<GenerateProgrammingProblemOutput> {
  return generateProgrammingProblemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProgrammingProblemPrompt',
  input: {
    schema: z.object({
      difficulty: z
        .enum(['easy', 'medium', 'hard'])
        .describe('The difficulty level of the programming problem.'),
    }),
  },
  output: {
    schema: z.object({
      title: z.string().describe('The title of the programming problem.'),
      description: z.string().describe('The detailed description of the problem.'),
      inputFormat: z.string().describe('The format of the input.'),
      outputFormat: z.string().describe('The format of the expected output.'),
      example: z
        .string()
        .describe('An example input and its corresponding output.'),
      constraints: z.string().describe('Constraints on the input values.'),
    }),
  },
  prompt: `You are a programming problem generator. Generate a programming problem of {{difficulty}} difficulty.

Problem should include:
- A title for the problem.
- A detailed description of the problem.
- The format of the input.
- The format of the expected output.
- An example input and its corresponding output.
- Constraints on the input values.

Difficulty: {{difficulty}}`,
});

const generateProgrammingProblemFlow = ai.defineFlow<
  typeof GenerateProgrammingProblemInputSchema,
  typeof GenerateProgrammingProblemOutputSchema
>(
  {
    name: 'generateProgrammingProblemFlow',
    inputSchema: GenerateProgrammingProblemInputSchema,
    outputSchema: GenerateProgrammingProblemOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
