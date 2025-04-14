'use client';

import {useState, useEffect} from 'react';
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
import {Input} from "@/components/ui/input";
import {signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, Auth} from "firebase/auth";
import {auth} from "@/lib/firebase";
import {toast} from "@/hooks/use-toast";

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

  // Authentication state
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // true for login, false for signup
    const [authLoading, setAuthLoading] = useState(false);
  const [firebaseAuth, setFirebaseAuth] = useState<Auth | null>(null);


  useEffect(() => {
    // Initialize Firebase Auth
    setFirebaseAuth(auth());

    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleGenerateProblem = async () => {
    setLoading(true);
    try {
      const generatedProblem = await generateProgrammingProblem({difficulty});
      setProblem(generatedProblem);
      setEvaluation(null); // Clear previous evaluation
    } catch (error) {
      console.error('Error al generar el problema:', error);
      toast({
        title: "Error",
        description: "Error al generar el problema"
      })
      // Handle error appropriately, maybe set an error state
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!problem) {
      toast({
        title: "Error",
        description: "Por favor, genera un problema primero."
      })
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
      console.error('Error al evaluar el código:', error);
      toast({
        title: "Error",
        description: "Error al evaluar el código"
      })
      // Handle error appropriately, maybe set an error state
    } finally {
      setLoading(false);
    }
  };

  const handleAuthAction = async () => {
        setAuthLoading(true);
    try {
      if (!firebaseAuth) {
        throw new Error("Firebase Auth not initialized");
      }
      if (isLogin) {
        // Sign in
        await signInWithEmailAndPassword(firebaseAuth, email, password);
        toast({
          title: "Inicio de sesión exitoso",
        })
      } else {
        // Sign up
        await createUserWithEmailAndPassword(firebaseAuth, email, password);
        toast({
          title: "Cuenta creada exitosamente",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error: ${error.message}`
      })
    } finally {
            setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      if (!firebaseAuth) {
        throw new Error("Firebase Auth not initialized");
      }
      await signOut(firebaseAuth);
      toast({
        title: "Sesión cerrada",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error al cerrar sesión: ${error.message}`
      })
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center p-4 w-full">
        <h1 className="text-2xl font-bold mb-4"><span className="text-red-500">CodeUAO</span></h1>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</CardTitle>
            <CardDescription>
              {isLogin
                ? 'Inicia sesión para acceder a CodeUAO.'
                : 'Crea una cuenta para empezar a usar CodeUAO.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Button onClick={handleAuthAction} disabled={authLoading}>
              {authLoading
                ? isLogin
                  ? 'Iniciando Sesión...'
                  : 'Creando Cuenta...'
                : isLogin
                  ? 'Iniciar Sesión'
                  : 'Crear Cuenta'}
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? '¿No tienes una cuenta? Crear cuenta'
                : '¿Ya tienes una cuenta? Iniciar sesión'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 w-full">
      <h1 className="text-2xl font-bold mb-4"><span className="text-red-500">CodeUAO</span></h1>
      <Button variant="outline" onClick={handleSignOut}>Cerrar Sesión</Button>
      <div className="flex flex-col md:flex-row w-full max-w-4xl space-y-4 md:space-x-4">
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Generación de Problemas</CardTitle>
            <CardDescription>
              Genera un nuevo problema de programación basado en la dificultad seleccionada.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2">
              <label htmlFor="difficulty">Dificultad:</label>
              <Select value={difficulty} onValueChange={value => setDifficulty(value as 'easy' | 'medium' | 'hard')}>
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Selecciona la dificultad"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Fácil</SelectItem>
                  <SelectItem value="medium">Medio</SelectItem>
                  <SelectItem value="hard">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleGenerateProblem} disabled={loading}>
              {loading ? 'Generando...' : 'Generar Problema'}
            </Button>
            {problem && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">{problem.title}</h3>
                <p>{problem.description}</p>
                <div className="mt-2">
                  <p>
                    <strong>Formato de entrada:</strong> {problem.inputFormat}
                  </p>
                  <p>
                    <strong>Formato de salida:</strong> {problem.outputFormat}
                  </p>
                  <p>
                    <strong>Ejemplo:</strong> {problem.example}
                  </p>
                  <p>
                    <strong>Restricciones:</strong> {problem.constraints}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Envío de Código</CardTitle>
            <CardDescription>Envía tu solución de código para evaluación.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2">
              <label htmlFor="language">Lenguaje:</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language">
                  <SelectValue placeholder="Selecciona el lenguaje"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea
              placeholder="Introduce tu código aquí"
              value={code}
              onChange={e => setCode(e.target.value)}
              className="min-h-[100px]"
            />
            <Button onClick={handleSubmitCode} disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Código'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {evaluation && (
        <Card className="w-full max-w-4xl mt-4">
          <CardHeader>
            <CardTitle>Resultados de la Evaluación</CardTitle>
            <CardDescription>
              Aquí están los resultados de la evaluación de tu código.
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
                <AlertTitle>Caso de Prueba #{index + 1}: {result.passed ? 'Aprobado' : 'Fallido'}</AlertTitle>
                <AlertDescription>
                  Entrada: {result.input}
                  <br/>
                  Salida esperada: {result.expectedOutput}
                  <br/>
                  Salida obtenida: {result.actualOutput}
                </AlertDescription>
              </Alert>
            ))}
            <div className="mt-4">
              <h4 className="text-md font-semibold">Puntuación total: {evaluation.overallScore}</h4>
              <p>
                <strong>Retroalimentación:</strong> {evaluation.feedback}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
