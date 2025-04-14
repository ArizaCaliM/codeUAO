'use server';
/**
 * @fileOverview Evaluates a code solution against test cases.
 *
 * - evaluateCodeSolution - A function that evaluates the code solution.
 * - EvaluateCodeSolutionInput - The input type for the evaluateCodeSolution function.
 * - EvaluateCodeSolutionOutput - The return type for the evaluateCodeSolution function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const EvaluateCodeSolutionInputSchema = z.object({
  code: z.string().describe('The code solution to evaluate.'),
  problemDescription: z.string().describe('The description of the programming problem.'),
  testCases: z.array(z.object({
    input: z.string().describe('The input for the test case.'),
    expectedOutput: z.string().describe('The expected output for the test case.'),
  })).describe('The test cases to evaluate the code against.'),
  language: z.string().describe('The programming language of the code.'),
});
export type EvaluateCodeSolutionInput = z.infer<typeof EvaluateCodeSolutionInputSchema>;

const EvaluateCodeSolutionOutputSchema = z.object({
  testResults: z.array(z.object({
    input: z.string().describe('The input for the test case.'),
    expectedOutput: z.string().describe('The expected output for the test case.'),
    actualOutput: z.string().describe('The actual output of the code for the test case.'),
    passed: z.boolean().describe('Whether the code passed the test case.'),
  })).describe('The results of evaluating the code against each test case.'),
  overallScore: z.number().describe('The overall score of the code solution (0-1).'),
  feedback: z.string().describe('Feedback on the code solution.'),
});
export type EvaluateCodeSolutionOutput = z.infer<typeof EvaluateCodeSolutionOutputSchema>;

export async function evaluateCodeSolution(input: EvaluateCodeSolutionInput): Promise<EvaluateCodeSolutionOutput> {
  return evaluateCodeSolutionFlow(input);
}

const evaluateCodeSolutionPrompt = ai.definePrompt({
  name: 'evaluateCodeSolutionPrompt',
  input: {
    schema: z.object({
      code: z.string().describe('The code solution to evaluate.'),
      problemDescription: z.string().describe('The description of the programming problem.'),
      testCases: z.array(z.object({
        input: z.string().describe('The input for the test case.'),
        expectedOutput: z.string().describe('The expected output for the test case.'),
      })).describe('The test cases to evaluate the code against.'),
      language: z.string().describe('The programming language of the code.'),
    }),
  },
  output: {
    schema: z.object({
      testResults: z.array(z.object({
        input: z.string().describe('The input for the test case.'),
        expectedOutput: z.string().describe('The expected output for the test case.'),
        actualOutput: z.string().describe('The actual output of the code for the test case.'),
        passed: z.boolean().describe('Whether the code passed the test case.'),
      })).describe('The results of evaluating the code against each test case.'),
      overallScore: z.number().describe('The overall score of the code solution (0-1).'),
      feedback: z.string().describe('Feedback on the code solution.'),
    }),
  },
  prompt: `Eres un experto evaluador de programación. Se te dará una solución de código, una descripción del problema y un conjunto de casos de prueba.
  Ejecutarás el código contra cada caso de prueba, compararás la salida real con la salida esperada y determinarás si el código pasó el caso de prueba.
  Luego, calcularás una puntuación general para la solución de código basada en el número de casos de prueba aprobados.
  Finalmente, proporcionarás comentarios sobre la solución de código, incluyendo sugerencias para mejorar.

  Descripción del problema: {{{problemDescription}}}
  Lenguaje de programación: {{{language}}}
  Solución de código:
  \`\`\`{{{language}}}
  {{{code}}}
  \`\`\`

  Casos de prueba:
  {{#each testCases}}
  Entrada: {{{input}}}
  Salida esperada: {{{expectedOutput}}}
  {{/each}}
  `,
});

const evaluateCodeSolutionFlow = ai.defineFlow<
  typeof EvaluateCodeSolutionInputSchema,
  typeof EvaluateCodeSolutionOutputSchema
>({
  name: 'evaluateCodeSolutionFlow',
  inputSchema: EvaluateCodeSolutionInputSchema,
  outputSchema: EvaluateCodeSolutionOutputSchema,
}, async input => {
  const {output} = await evaluateCodeSolutionPrompt(input);
  return output!;
});


