import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Mic,
  Eye,
  Brain,
  CheckCircle,
  AlertTriangle,
  Star,
  Award,
  FileText,
  Download,
  Share,
  Lightbulb,
  MessageSquare,
  Volume2,
  BarChart3
} from 'lucide-react';

interface AnalysisData {
  overallScore: number;
  duration: number;
  questionCount: number;
  strengths: string[];
  improvements: string[];
  transcript: Array<{
    timestamp: string;
    speaker: 'interviewer' | 'candidate';
    text: string;
    sentiment?: 'positive' | 'neutral' | 'negative';
    confidence?: number;
  }>;
  metrics: {
    speechPace: number; // words per minute
    fillerWords: number;
    eyeContact: number; // percentage
    confidence: number; // percentage
    clarity: number; // percentage
    enthusiasm: number; // percentage
  };
  questionAnalysis: Array<{
    question: string;
    type: 'behavioral' | 'technical' | 'situational';
    answer: string;
    score: number;
    feedback: string;
    suggestions: string[];
    timeSpent: number;
  }>;
  recommendations: Array<{
    category: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

interface InterviewAnalysisProps {
  analysisData: AnalysisData;
  jobTitle: string;
  onRetake: () => void;
  onSaveReport: () => void;
}

const InterviewAnalysis = ({ analysisData, jobTitle, onRetake, onSaveReport }: InterviewAnalysisProps) => {
  const [selectedQuestion, setSelectedQuestion] = useState(0);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 70) return 'text-blue-500';
    if (score >= 55) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 55) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getReadinessLevel = (score: number) => {
    if (score >= 85) return { level: 'Excellent', icon: CheckCircle, color: 'text-green-500' };
    if (score >= 70) return { level: 'Good', icon: Target, color: 'text-blue-500' };
    if (score >= 55) return { level: 'Fair', icon: AlertTriangle, color: 'text-yellow-500' };
    return { level: 'Needs Work', icon: AlertTriangle, color: 'text-red-500' };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const readiness = getReadinessLevel(analysisData.overallScore);
  const ReadinessIcon = readiness.icon;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Award className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Interview Analysis</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Complete analysis for your <strong>{jobTitle}</strong> interview
        </p>
      </div>

      {/* Overall Score Card */}
      <Card className="bg-gradient-card border-primary/20">
        <CardContent className="p-8">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            {/* Score Display */}
            <div className="text-center space-y-4">
              <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 rounded-full bg-muted"></div>
                <div 
                  className={`absolute inset-0 rounded-full ${getScoreBg(analysisData.overallScore)}`}
                  style={{
                    background: `conic-gradient(hsl(var(--primary)) ${analysisData.overallScore * 3.6}deg, hsl(var(--muted)) 0deg)`
                  }}
                ></div>
                <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(analysisData.overallScore)}`}>
                      {analysisData.overallScore}
                    </div>
                    <div className="text-sm text-muted-foreground">Score</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <ReadinessIcon className={`w-5 h-5 ${readiness.color}`} />
                <span className={`font-semibold ${readiness.color}`}>{readiness.level}</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-background/50 rounded-lg">
                <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{formatTime(analysisData.duration)}</div>
                <div className="text-sm text-muted-foreground">Duration</div>
              </div>
              <div className="text-center p-4 bg-background/50 rounded-lg">
                <MessageSquare className="w-6 h-6 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold">{analysisData.questionCount}</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
              <div className="text-center p-4 bg-background/50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-success mx-auto mb-2" />
                <div className="text-2xl font-bold">{analysisData.strengths.length}</div>
                <div className="text-sm text-muted-foreground">Strengths</div>
              </div>
              <div className="text-center p-4 bg-background/50 rounded-lg">
                <Target className="w-6 h-6 text-warning mx-auto mb-2" />
                <div className="text-2xl font-bold">{analysisData.improvements.length}</div>
                <div className="text-sm text-muted-foreground">Areas to Improve</div>
              </div>
            </div>

            {/* Actions */}
            <div class="space-y-4">
              <div class="flex gap-2">
                <Button onClick={onRetake} variant="outline" class="flex-1">
                  <Clock class="w-4 h-4 mr-2" />
                  Retake Interview
                </Button>
                <Button onClick={onSaveReport} class="flex-1 bg-gradient-primary hover:shadow-glow">
                  <Download class="w-4 h-4 mr-2" />
                  Save Report
                </Button>
              </div>
              <Button variant="outline" class="w-full">
                <Share class="w-4 h-4 mr-2" />
                Share Results
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <Tabs defaultValue="performance" class="space-y-6">
        <TabsList class="grid w-full grid-cols-5">
          <TabsTrigger value="performance">
            <BarChart3 class="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="questions">
            <MessageSquare class="w-4 h-4 mr-2" />
            Questions
          </TabsTrigger>
          <TabsTrigger value="transcript">
            <FileText class="w-4 h-4 mr-2" />
            Transcript
          </TabsTrigger>
          <TabsTrigger value="feedback">
            <Lightbulb class="w-4 h-4 mr-2" />
            Feedback
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            <Star class="w-4 h-4 mr-2" />
            Recommendations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" class="space-y-6">
          {/* Performance Metrics */}
          <div class="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <Volume2 class="w-5 h-5 text-primary" />
                  Communication Metrics
                </CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm">Speech Pace</span>
                    <span class="text-sm font-medium">{analysisData.metrics.speechPace} WPM</span>
                  </div>
                  <Progress value={(analysisData.metrics.speechPace / 200) * 100} class="h-2" />
                  <p class="text-xs text-muted-foreground">Optimal range: 140-180 WPM</p>
                </div>

                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm">Clarity</span>
                    <span class="text-sm font-medium">{analysisData.metrics.clarity}%</span>
                  </div>
                  <Progress value={analysisData.metrics.clarity} class="h-2" />
                </div>

                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm">Filler Words</span>
                    <span class="text-sm font-medium">{analysisData.metrics.fillerWords}</span>
                  </div>
                  <Progress value={Math.max(0, 100 - analysisData.metrics.fillerWords * 10)} class="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <Eye class="w-5 h-5 text-accent" />
                  Non-Verbal Metrics
                </CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm">Eye Contact</span>
                    <span class="text-sm font-medium">{analysisData.metrics.eyeContact}%</span>
                  </div>
                  <Progress value={analysisData.metrics.eyeContact} class="h-2" />
                </div>

                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm">Confidence</span>
                    <span class="text-sm font-medium">{analysisData.metrics.confidence}%</span>
                  </div>
                  <Progress value={analysisData.metrics.confidence} class="h-2" />
                </div>

                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm">Enthusiasm</span>
                    <span class="text-sm font-medium">{analysisData.metrics.enthusiasm}%</span>
                  </div>
                  <Progress value={analysisData.metrics.enthusiasm} class="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Strengths and Improvements */}
          <div class="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle class="flex items-center gap-2 text-green-600">
                  <CheckCircle class="w-5 h-5" />
                  Key Strengths
                </CardTitle>
                <CardDescription>Areas where you performed exceptionally well</CardDescription>
              </CardHeader>
              <CardContent>
                <div class="space-y-3">
                  {analysisData.strengths.map((strength, index) => (
                    <div key={index} class="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <CheckCircle class="w-4 h-4 text-green-600 mt-0.5" />
                      <span class="text-sm">{strength}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle class="flex items-center gap-2 text-orange-600">
                  <AlertTriangle class="w-5 h-5" />
                  Areas for Improvement
                </CardTitle>
                <CardDescription>Focus on these areas for better performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div class="space-y-3">
                  {analysisData.improvements.map((improvement, index) => (
                    <div key={index} class="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                      <AlertTriangle class="w-4 h-4 text-orange-600 mt-0.5" />
                      <span class="text-sm">{improvement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="questions" class="space-y-6">
          <div class="grid lg:grid-cols-3 gap-6">
            {/* Question List */}
            <Card>
              <CardHeader>
                <CardTitle>Questions Overview</CardTitle>
                <CardDescription>Click on any question to view detailed analysis</CardDescription>
              </CardHeader>
              <CardContent class="p-0">
                <ScrollArea class="h-96">
                  <div class="space-y-2 p-4">
                    {analysisData.questionAnalysis.map((qa, index) => (
                      <div
                        key={index}
                        class={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedQuestion === index
                            ? 'bg-primary/10 border border-primary/20'
                            : 'bg-muted/50 hover:bg-muted'
                        }`}
                        onClick={() => setSelectedQuestion(index)}
                      >
                        <div class="flex items-center justify-between mb-2">
                          <Badge class={
                            qa.type === 'behavioral' ? 'bg-blue-500' :
                            qa.type === 'technical' ? 'bg-green-500' : 'bg-purple-500'
                          }>
                            {qa.type}
                          </Badge>
                          <div class={`text-sm font-semibold ${getScoreColor(qa.score)}`}>
                            {qa.score}%
                          </div>
                        </div>
                        <p class="text-sm truncate">{qa.question}</p>
                        <div class="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Clock class="w-3 h-3" />
                          {formatTime(qa.timeSpent)}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Question Details */}
            <div class="lg:col-span-2 space-y-6">
              {analysisData.questionAnalysis[selectedQuestion] && (
                <>
                  <Card>
                    <CardHeader>
                      <div class="flex items-center justify-between">
                        <CardTitle>Question {selectedQuestion + 1}</CardTitle>
                        <div class="flex items-center gap-2">
                          <Badge class={
                            analysisData.questionAnalysis[selectedQuestion].type === 'behavioral' ? 'bg-blue-500' :
                            analysisData.questionAnalysis[selectedQuestion].type === 'technical' ? 'bg-green-500' : 'bg-purple-500'
                          }>
                            {analysisData.questionAnalysis[selectedQuestion].type}
                          </Badge>
                          <div class={`text-lg font-bold ${getScoreColor(analysisData.questionAnalysis[selectedQuestion].score)}`}>
                            {analysisData.questionAnalysis[selectedQuestion].score}%
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent class="space-y-4">
                      <div class="p-4 bg-muted/50 rounded-lg">
                        <h4 class="font-semibold mb-2">Question:</h4>
                        <p class="text-sm">{analysisData.questionAnalysis[selectedQuestion].question}</p>
                      </div>

                      <div class="p-4 bg-primary/5 rounded-lg">
                        <h4 class="font-semibold mb-2">Your Answer:</h4>
                        <ScrollArea class="h-32">
                          <p class="text-sm text-muted-foreground whitespace-pre-wrap">
                            {analysisData.questionAnalysis[selectedQuestion].answer}
                          </p>
                        </ScrollArea>
                      </div>

                      <div class="p-4 bg-accent/5 rounded-lg">
                        <h4 class="font-semibold mb-2">AI Feedback:</h4>
                        <p class="text-sm">{analysisData.questionAnalysis[selectedQuestion].feedback}</p>
                      </div>

                      {analysisData.questionAnalysis[selectedQuestion].suggestions.length > 0 && (
                        <div>
                          <h4 class="font-semibold mb-2 flex items-center gap-2">
                            <Lightbulb class="w-4 h-4 text-primary" />
                            Suggestions for Improvement:
                          </h4>
                          <ul class="space-y-1">
                            {analysisData.questionAnalysis[selectedQuestion].suggestions.map((suggestion, idx) => (
                              <li key={idx} class="text-sm text-muted-foreground flex items-start gap-2">
                                <span class="text-primary mt-1">•</span>
                                <span>{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transcript" class="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <FileText class="w-5 h-5" />
                Interview Transcript
              </CardTitle>
              <CardDescription>Complete conversation with sentiment analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea class="h-96">
                <div class="space-y-4">
                  {analysisData.transcript.map((entry, index) => (
                    <div key={index} class={`p-4 rounded-lg ${
                      entry.speaker === 'interviewer' 
                        ? 'bg-primary/5 border-l-4 border-primary' 
                        : 'bg-accent/5 border-l-4 border-accent'
                    }`}>
                      <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                          <span class="font-semibold capitalize">{entry.speaker}</span>
                          {entry.speaker === 'candidate' && entry.sentiment && (
                            <Badge variant="outline" class={
                              entry.sentiment === 'positive' ? 'border-green-500 text-green-500' :
                              entry.sentiment === 'negative' ? 'border-red-500 text-red-500' :
                              'border-yellow-500 text-yellow-500'
                            }>
                              {entry.sentiment}
                            </Badge>
                          )}
                        </div>
                        <span class="text-xs text-muted-foreground">{entry.timestamp}</span>
                      </div>
                      <p class="text-sm">{entry.text}</p>
                      {entry.confidence && (
                        <div class="mt-2">
                          <div class="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Confidence</span>
                            <span>{entry.confidence}%</span>
                          </div>
                          <Progress value={entry.confidence} class="h-1" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" class="space-y-6">
          <div class="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle class="text-green-600">What You Did Well</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="space-y-4">
                  {analysisData.strengths.map((strength, index) => (
                    <div key={index} class="flex items-start gap-3">
                      <CheckCircle class="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p class="font-medium">{strength}</p>
                        <p class="text-sm text-muted-foreground mt-1">
                          This demonstrates strong {strength.toLowerCase()} skills that employers value.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle class="text-orange-600">Areas to Focus On</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="space-y-4">
                  {analysisData.improvements.map((improvement, index) => (
                    <div key={index} class="flex items-start gap-3">
                      <AlertTriangle class="w-5 h-5 text-orange-600 mt-0.5" />
                      <div>
                        <p class="font-medium">{improvement}</p>
                        <p class="text-sm text-muted-foreground mt-1">
                          Consider practicing this area more to improve your overall performance.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" class="space-y-6">
          <div class="space-y-4">
            {analysisData.recommendations.map((rec, index) => (
              <Card key={index} class={`border-l-4 ${
                rec.priority === 'high' ? 'border-red-500' :
                rec.priority === 'medium' ? 'border-yellow-500' : 'border-green-500'
              }`}>
                <CardHeader>
                  <div class="flex items-center justify-between">
                    <CardTitle class="text-lg">{rec.title}</CardTitle>
                    <Badge variant="outline" class={
                      rec.priority === 'high' ? 'border-red-500 text-red-500' :
                      rec.priority === 'medium' ? 'border-yellow-500 text-yellow-500' :
                      'border-green-500 text-green-500'
                    }>
                      {rec.priority} priority
                    </Badge>
                  </div>
                  <CardDescription>{rec.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p class="text-sm">{rec.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InterviewAnalysis;