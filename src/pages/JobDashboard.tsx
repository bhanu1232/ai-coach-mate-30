import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useJobSessions } from '@/hooks/useJobSessions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainLayout from '@/components/layout/MainLayout';
import PracticeSession from '@/components/PracticeSession';
import FeedbackDisplay from '@/components/FeedbackDisplay';
import PerformanceDashboard from '@/components/PerformanceDashboard';
import { geminiService, FeedbackResponse } from '@/services/gemini';
import { JobSession, SessionAnswer } from '@/types/job';
import {
  Play,
  RotateCcw,
  TrendingUp,
  Clock,
  Target,
  CheckCircle,
  Calendar,
  FileText,
  BarChart3,
  ArrowLeft
} from 'lucide-react';

type ViewState = 'overview' | 'practice' | 'feedback' | 'performance';

const JobDashboard = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { jobs, sessions, createSession, updateSession, addAnswer, completeSession, getSessionsByJob, getActiveSession } = useJobSessions();
  const { toast } = useToast();

  const [currentView, setCurrentView] = useState<ViewState>('overview');
  const [activeSession, setActiveSession] = useState<JobSession | null>(null);
  const [currentFeedback, setCurrentFeedback] = useState<FeedbackResponse | null>(null);
  const [currentQuestionData, setCurrentQuestionData] = useState<{question: string, answer: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionResult, setSessionResult] = useState<any>(null);

  const job = jobs.find(j => j.id === jobId);
  const jobSessions = getSessionsByJob(jobId || '');
  const completedSessions = jobSessions.filter(s => s.status === 'completed');

  useEffect(() => {
    if (!job) return;

    const shouldStartNew = searchParams.get('new') === 'true';
    const existingActiveSession = getActiveSession(job.id);

    if (shouldStartNew || !existingActiveSession) {
      // We'll start a new session when user clicks practice
      setActiveSession(null);
    } else {
      setActiveSession(existingActiveSession);
    }
  }, [job, searchParams, getActiveSession]);

  const handleStartNewSession = async () => {
    if (!job) return;

    setIsLoading(true);
    try {
      const response = await geminiService.generateQuestions(job.description);
      const newSession = createSession(job.id, response.questions);
      setActiveSession(newSession);
      setCurrentView('practice');

      toast({
        title: "New Session Started!",
        description: `Generated ${response.questions.length} personalized questions.`,
      });
    } catch (error) {
      toast({
        title: "Error Starting Session",
        description: "Failed to generate questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueSession = () => {
    if (activeSession) {
      setCurrentView('practice');
    }
  };

  const handleAnswerSubmit = async (questionId: string, answer: string, isVoice: boolean) => {
    if (!activeSession || !job) return;

    const question = activeSession.questions.find(q => q.id === questionId);
    if (!question) return;

    setIsLoading(true);
    try {
      const feedback = await geminiService.getFeedback(job.description, question.text, answer);
      
      const sessionAnswer: SessionAnswer = {
        questionId,
        question: question.text,
        answer,
        feedback,
        timeSpent: Date.now(),
        isVoice,
        createdAt: new Date().toISOString()
      };
      
      addAnswer(activeSession.id, sessionAnswer);
      setCurrentFeedback(feedback);
      setCurrentQuestionData({ question: question.text, answer });
      setCurrentView('feedback');
      
      // Update activeSession state
      const updatedSession = sessions.find(s => s.id === activeSession.id);
      if (updatedSession) {
        setActiveSession(updatedSession);
      }
    } catch (error) {
      toast({
        title: "Error Getting Feedback",
        description: "Failed to analyze your answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSessionComplete = async (sessionData: any) => {
    if (!activeSession || !job) return;

    setIsLoading(true);
    try {
      const questionsAndAnswers = activeSession.answers.map(sa => ({
        question: sa.question,
        answer: sa.answer,
        feedback: {
          clarity: sa.feedback?.clarity || 0,
          tone: (sa.feedback?.tone as 'confident' | 'weak' | 'neutral') || 'neutral',
          keywords_missed: sa.feedback?.keywords_missed || [],
          grammar_mistakes: sa.feedback?.grammar_mistakes || [],
          suggestions: sa.feedback?.suggestions || [],
          better_answer: sa.feedback?.better_answer,
          overall_score: sa.feedback?.overall_score || 0,
          strengths: [],
          areas_for_improvement: []
        }
      }));

      const report = await geminiService.generateSessionReport(
        job.description,
        questionsAndAnswers
      );

      completeSession(activeSession.id, report);
      setSessionResult(report);
      setCurrentView('performance');
      setActiveSession(null);
    } catch (error) {
      toast({
        title: "Error Generating Report",
        description: "Failed to generate session report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = () => {
    setCurrentView('practice');
    setCurrentFeedback(null);
    setCurrentQuestionData(null);
  };

  const getAverageScore = () => {
    if (completedSessions.length === 0) return 0;
    return Math.round(
      completedSessions.reduce((acc, session) => acc + (session.overallScore || 0), 0) / completedSessions.length
    );
  };

  if (!job) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
            <p className="text-muted-foreground mb-6">The job you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const renderMainContent = () => {
    switch (currentView) {
      case 'practice':
        return activeSession ? (
          <PracticeSession
            questions={activeSession.questions}
            jobDescription={job.description}
            onAnswerSubmit={handleAnswerSubmit}
            onSessionComplete={handleSessionComplete}
          />
        ) : null;
      
      case 'feedback':
        return currentFeedback && currentQuestionData ? (
          <FeedbackDisplay
            feedback={currentFeedback}
            question={currentQuestionData.question}
            answer={currentQuestionData.answer}
            onNextQuestion={handleNextQuestion}
          />
        ) : null;
      
      case 'performance':
        return sessionResult ? (
          <PerformanceDashboard
            sessionResult={sessionResult}
            onStartNewSession={() => setCurrentView('overview')}
            onDownloadReport={() => {}}
          />
        ) : null;
      
      default:
        return (
          <div className="space-y-6">
            {/* Job Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl">{job.title}</CardTitle>
                    <CardDescription className="text-lg font-medium">{job.company}</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    Created {new Date(job.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">{job.description}</p>
              </CardContent>
            </Card>

            {/* Active Session */}
            {activeSession && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Play className="h-5 w-5" />
                    Active Session
                  </CardTitle>
                  <CardDescription>
                    Continue your interview practice session
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{Math.round(activeSession.progress)}%</span>
                  </div>
                  <Progress value={activeSession.progress} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {activeSession.answers.length} of {activeSession.totalQuestions} questions answered
                  </p>
                  <Button onClick={handleContinueSession} className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Continue Session
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Session Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Target className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{jobSessions.length}</p>
                      <p className="text-sm text-muted-foreground">Total Sessions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-accent" />
                    <div>
                      <p className="text-2xl font-bold">{getAverageScore()}%</p>
                      <p className="text-sm text-muted-foreground">Average Score</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{completedSessions.length}</p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group" 
                    onClick={handleStartNewSession}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Play className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Start New Session</CardTitle>
                      <CardDescription>Begin a fresh interview practice session</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {completedSessions.length > 0 && (
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group" 
                      onClick={() => setCurrentView('performance')}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                        <BarChart3 className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">View Performance</CardTitle>
                        <CardDescription>Analyze your progress and results</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )}
            </div>

            {/* Recent Sessions */}
            {completedSessions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {completedSessions.slice(-5).reverse().map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {new Date(session.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {session.answers.length} questions answered
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={session.overallScore && session.overallScore >= 80 ? "default" : 
                                         session.overallScore && session.overallScore >= 60 ? "secondary" : "destructive"}>
                            {session.overallScore}%
                          </Badge>
                          {session.sessionReport && (
                            <Badge variant="outline">{session.sessionReport.interview_readiness}</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );
    }
  };

  return (
    <MainLayout>
      <div className="p-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <span>/</span>
          <span className="font-medium text-foreground">{job.title}</span>
        </div>

        {renderMainContent()}
      </div>
    </MainLayout>
  );
};

export default JobDashboard;