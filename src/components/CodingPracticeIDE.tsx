import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Play, 
  Square, 
  RefreshCw, 
  Save, 
  Download,
  Upload,
  Lightbulb,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Target,
  Brain,
  Code,
  Terminal,
  FileText,
  Settings
} from 'lucide-react';

interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  description?: string;
}

interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  testCases: TestCase[];
  hints: string[];
  solutions: Array<{
    language: string;
    code: string;
    timeComplexity: string;
    spaceComplexity: string;
    approach: string;
  }>;
}

interface CodingPracticeIDEProps {
  problem: CodingProblem;
  onSubmit: (solution: { code: string; language: string; results: any }) => void;
}

const CodingPracticeIDE = ({ problem, onSubmit }: CodingPracticeIDEProps) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [executionTime, setExecutionTime] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [output, setOutput] = useState('');
  const [customInput, setCustomInput] = useState('');
  
  const codeEditorRef = useRef<HTMLTextAreaElement>(null);

  const languages = [
    { value: 'javascript', label: 'JavaScript', example: '// Your solution here\nfunction solution() {\n    \n}' },
    { value: 'python', label: 'Python', example: '# Your solution here\ndef solution():\n    pass' },
    { value: 'java', label: 'Java', example: '// Your solution here\npublic class Solution {\n    \n}' },
    { value: 'cpp', label: 'C++', example: '// Your solution here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    \n}' }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500 text-white';
      case 'Medium': return 'bg-yellow-500 text-white';
      case 'Hard': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  useEffect(() => {
    const selectedLang = languages.find(lang => lang.value === language);
    if (selectedLang && !code.trim()) {
      setCode(selectedLang.example);
    }
  }, [language]);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running...');
    
    try {
      // Simulate code execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const results = problem.testCases.map((testCase, index) => ({
        id: testCase.id,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: `Output ${index + 1}`, // Simulated output
        passed: Math.random() > 0.3, // Random pass/fail for demo
        executionTime: Math.floor(Math.random() * 100) + 10
      }));
      
      setTestResults(results);
      setExecutionTime(results.reduce((total, result) => total + result.executionTime, 0));
      
      const passedTests = results.filter(r => r.passed).length;
      setOutput(`Test Results: ${passedTests}/${results.length} test cases passed`);
      
    } catch (error) {
      setOutput('Error: Failed to execute code');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = () => {
    const results = {
      code,
      language,
      results: {
        testResults,
        executionTime,
        totalTests: problem.testCases.length,
        passedTests: testResults.filter(r => r.passed).length
      }
    };
    onSubmit(results);
  };

  const handleShowNextHint = () => {
    if (currentHintIndex < problem.hints.length - 1) {
      setCurrentHintIndex(currentHintIndex + 1);
    }
    setShowHints(true);
  };

  const handleRunCustomInput = () => {
    setOutput(`Running with custom input: ${customInput}`);
    // Simulate custom input execution
  };

  return (
    <div className="h-screen bg-background">
      <ResizablePanelGroup direction="horizontal" className="min-h-full">
        {/* Problem Panel */}
        <ResizablePanel defaultSize={35} minSize={25}>
          <Card className="h-full rounded-none border-r">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{problem.title}</CardTitle>
                <Badge className={getDifficultyColor(problem.difficulty)}>
                  {problem.difficulty}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <Tabs defaultValue="description" className="h-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">
                    <FileText className="w-4 h-4 mr-2" />
                    Problem
                  </TabsTrigger>
                  <TabsTrigger value="hints">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Hints
                  </TabsTrigger>
                  <TabsTrigger value="solutions">
                    <Brain className="w-4 h-4 mr-2" />
                    Solutions
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="mt-0">
                  <ScrollArea className="h-[calc(100vh-12rem)] px-6">
                    <div className="space-y-6 py-4">
                      {/* Description */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Description</h3>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {problem.description}
                        </p>
                      </div>

                      {/* Examples */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Examples</h3>
                        <div className="space-y-4">
                          {problem.examples.map((example, index) => (
                            <div key={index} className="bg-muted/50 rounded-lg p-4">
                              <h4 className="font-medium mb-2">Example {index + 1}:</h4>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="font-medium">Input:</span>
                                  <code className="ml-2 bg-background px-2 py-1 rounded">
                                    {example.input}
                                  </code>
                                </div>
                                <div>
                                  <span className="font-medium">Output:</span>
                                  <code className="ml-2 bg-background px-2 py-1 rounded">
                                    {example.output}
                                  </code>
                                </div>
                                {example.explanation && (
                                  <div>
                                    <span className="font-medium">Explanation:</span>
                                    <p className="ml-2 text-muted-foreground">
                                      {example.explanation}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Constraints */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Constraints</h3>
                        <ul className="space-y-1">
                          {problem.constraints.map((constraint, index) => (
                            <li key={index} className="text-sm text-muted-foreground">
                              • {constraint}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="hints" className="mt-0">
                  <ScrollArea className="h-[calc(100vh-12rem)] px-6">
                    <div className="space-y-4 py-4">
                      {!showHints ? (
                        <div className="text-center py-8">
                          <Lightbulb className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Need a hint?</h3>
                          <p className="text-muted-foreground mb-4">
                            Try solving the problem first. Hints will help if you get stuck.
                          </p>
                          <Button onClick={handleShowNextHint} variant="outline">
                            Show First Hint
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {problem.hints.slice(0, currentHintIndex + 1).map((hint, index) => (
                            <div key={index} className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
                                  {index + 1}
                                </div>
                                <p className="text-sm">{hint}</p>
                              </div>
                            </div>
                          ))}
                          
                          {currentHintIndex < problem.hints.length - 1 && (
                            <Button onClick={handleShowNextHint} variant="outline" className="w-full">
                              Show Next Hint ({currentHintIndex + 2}/{problem.hints.length})
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="solutions" className="mt-0">
                  <ScrollArea className="h-[calc(100vh-12rem)] px-6">
                    <div className="space-y-4 py-4">
                      {!showSolution ? (
                        <div className="text-center py-8">
                          <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Solution Available</h3>
                          <p className="text-muted-foreground mb-4">
                            Try your best before viewing the solution. You can always come back!
                          </p>
                          <Button onClick={() => setShowSolution(true)} variant="outline">
                            View Solution
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {problem.solutions.map((solution, index) => (
                            <div key={index} className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">{solution.language} Solution</h3>
                                <Badge variant="outline">{solution.approach}</Badge>
                              </div>
                              
                              <div className="bg-muted/50 rounded-lg p-4">
                                <pre className="text-sm overflow-x-auto">
                                  <code>{solution.code}</code>
                                </pre>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-accent" />
                                  <span>Time: {solution.timeComplexity}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Zap className="w-4 h-4 text-primary" />
                                  <span>Space: {solution.spaceComplexity}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </ResizablePanel>

        <ResizableHandle />

        {/* Code Editor Panel */}
        <ResizablePanel defaultSize={65}>
          <div className="h-full flex flex-col">
            {/* Editor Header */}
            <div className="border-b p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={handleRunCode} disabled={isRunning} className="bg-gradient-primary hover:shadow-glow">
                  {isRunning ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  {isRunning ? 'Running...' : 'Run Code'}
                </Button>
                <Button onClick={handleSubmit} variant="outline" disabled={testResults.length === 0}>
                  <Target className="w-4 h-4 mr-2" />
                  Submit
                </Button>
              </div>
            </div>

            <ResizablePanelGroup direction="vertical" className="flex-1">
              {/* Code Editor */}
              <ResizablePanel defaultSize={60}>
                <div className="h-full relative">
                  <textarea
                    ref={codeEditorRef}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-full p-4 bg-background border-0 font-mono text-sm resize-none focus:outline-none focus:ring-0"
                    placeholder="Write your solution here..."
                    spellCheck={false}
                  />
                </div>
              </ResizablePanel>

              <ResizableHandle />

              {/* Output Panel */}
              <ResizablePanel defaultSize={40}>
                <Tabs defaultValue="output" className="h-full">
                  <TabsList className="w-full justify-start rounded-none border-b">
                    <TabsTrigger value="output">
                      <Terminal className="w-4 h-4 mr-2" />
                      Output
                    </TabsTrigger>
                    <TabsTrigger value="test-results">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Test Results
                    </TabsTrigger>
                    <TabsTrigger value="custom-input">
                      <Code className="w-4 h-4 mr-2" />
                      Custom Input
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="output" className="mt-0 h-[calc(100%-3rem)]">
                    <ScrollArea className="h-full p-4">
                      <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {output || 'Click "Run Code" to see output here...'}
                      </pre>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="test-results" className="mt-0 h-[calc(100%-3rem)]">
                    <ScrollArea className="h-full p-4">
                      {testResults.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>Run your code to see test results</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Test Results</h3>
                            <div className="text-sm text-muted-foreground">
                              Executed in {executionTime}ms
                            </div>
                          </div>
                          
                          {testResults.map((result, index) => (
                            <div
                              key={result.id}
                              className={`border rounded-lg p-4 ${
                                result.passed ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  {result.passed ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-red-500" />
                                  )}
                                  <span className="font-medium">Test Case {index + 1}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {result.executionTime}ms
                                </span>
                              </div>
                              
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="font-medium">Input:</span>
                                  <code className="ml-2 bg-background px-2 py-1 rounded">
                                    {result.input}
                                  </code>
                                </div>
                                <div>
                                  <span className="font-medium">Expected:</span>
                                  <code className="ml-2 bg-background px-2 py-1 rounded">
                                    {result.expectedOutput}
                                  </code>
                                </div>
                                {!result.passed && (
                                  <div>
                                    <span className="font-medium">Actual:</span>
                                    <code className="ml-2 bg-background px-2 py-1 rounded text-red-500">
                                      {result.actualOutput}
                                    </code>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="custom-input" className="mt-0 h-[calc(100%-3rem)]">
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Custom Input</label>
                        <textarea
                          value={customInput}
                          onChange={(e) => setCustomInput(e.target.value)}
                          className="w-full h-32 p-3 bg-input border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="Enter your custom test input here..."
                        />
                      </div>
                      <Button onClick={handleRunCustomInput} variant="outline" className="w-full">
                        <Play className="w-4 h-4 mr-2" />
                        Run with Custom Input
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default CodingPracticeIDE;