'use client';

import {useState} from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {generateProgrammingProblem} from '@/ai/flows/generate-programming-problem';
import {evaluateCodeSolution} from '@/ai/flows/evaluate-code-solution';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {CheckCircle, XCircle} from 'lucide-react';
import {ScrollArea} from "@/components/ui/scroll-area";

export default function Home() {
  const [problem, setProblem] = useState<{
    title: string;
    description: string;
    inputFormat: string;
    outputFormat: string;
    example: string;
    constraints: string;
  } | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [evaluation, setEvaluation] = useState<{
    testResults: {
      input: string;
      expectedOutput: string;
      actualOutput: string;
      passed: boolean;
    }[];
    overallScore: number;
    feedback: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateProblem = async () => {
    setLoading(true);
    try {
      const generatedProblem = await generateProgrammingProblem({difficulty});
      setProblem(generatedProblem);
      setEvaluation(null); // Clear previous evaluation
    } catch (error) {
      console.error('Failed to generate problem:', error);
      // Handle error appropriately, maybe set an error state
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!problem) {
      alert('Please generate a problem first.');
      return;
    }

    setLoading(true);
    try {
      // Dummy test cases - replace with actual test cases from the generated problem if available
      const testCases = [
        {input: '2 3', expectedOutput: '5'},
        {input: '5 5', expectedOutput: '10'},
      ];

      const evaluationResult = await evaluateCodeSolution({
        code,
        problemDescription: problem.description,
        testCases,
        language,
      });
      setEvaluation(evaluationResult);
    } catch (error) {
      console.error('Failed to evaluate code:', error);
      // Handle error appropriately, maybe set an error state
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 w-full">
      <h1 className="text-2xl font-bold mb-4"><span className="text-red-500">CodeUAO</span></h1>
      <div className="flex flex-col md:flex-row w-full max-w-4xl space-y-4 md:space-x-4">
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Problem Generation</CardTitle>
            <CardDescription>
              Generate a new programming problem based on the selected difficulty.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2">
              <label htmlFor="difficulty">Difficulty:</label>
              <Select value={difficulty} onValueChange={value => setDifficulty(value as 'easy' | 'medium' | 'hard')}>
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Select difficulty"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleGenerateProblem} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Problem'}
            </Button>
            {problem && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">{problem.title}</h3>
                <p>{problem.description}</p>
                <div className="mt-2">
                  <p>
                    <strong>Input Format:</strong> {problem.inputFormat}
                  </p>
                  <p>
                    <strong>Output Format:</strong> {problem.outputFormat}
                  </p>
                  <p>
                    <strong>Example:</strong> {problem.example}
                  </p>
                  <p>
                    <strong>Constraints:</strong> {problem.constraints}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Code Submission</CardTitle>
            <CardDescription>Submit your code solution for evaluation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2">
              <label htmlFor="language">Language:</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea
              placeholder="Enter your code here"
              value={code}
              onChange={e => setCode(e.target.value)}
              className="min-h-[100px]"
            />
            <Button onClick={handleSubmitCode} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Code'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {evaluation && (
        <Card className="w-full max-w-4xl mt-4">
          <CardHeader>
            <CardTitle>Evaluation Results</CardTitle>
            <CardDescription>
              Here are the results of your code evaluation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {evaluation.testResults.map((result, index) => (
              <Alert key={index} variant={result.passed ? 'default' : 'destructive'}>
                {result.passed ? (
                  <CheckCircle className="h-4 w-4"/>
                ) : (
                  <XCircle className="h-4 w-4"/>
                )}
                <AlertTitle>Test Case #{index + 1}: {result.passed ? 'Passed' : 'Failed'}</AlertTitle>
                <AlertDescription>
                  Input: {result.input}
                  <br/>
                  Expected Output: {result.expectedOutput}
                  <br/>
                  Actual Output: {result.actualOutput}
                </AlertDescription>
              </Alert>
            ))}
            <div className="mt-4">
              <h4 className="text-md font-semibold">Overall Score: {evaluation.overallScore}</h4>
              <p>
                <strong>Feedback:</strong> {evaluation.feedback}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

