import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
import {
  Calendar,
  TrendingUp,
  Target,
  Clock,
  Award,
  BookOpen,
  Settings,
  LogOut,
  PlayCircle,
  BarChart3,
  Users,
  FileText,
  Sparkles
} from 'lucide-react';
import JobDescriptionUpload from '@/components/JobDescriptionUpload';
import PracticeSession from '@/components/PracticeSession';
import FeedbackDisplay from '@/components/FeedbackDisplay';
import PerformanceDashboard from '@/components/PerformanceDashboard';
import JobPreparationTools from '@/components/JobPreparationTools';
import { geminiService, FeedbackResponse } from '@/services/gemini';

interface Question {
  id: string;
  text: string;
  type: 'technical' | 'behavioral';
  category: string;
}

interface SessionAnswer {
  questionId: string;
  question: string;
  answer: string;
  feedback?: FeedbackResponse;
  timeSpent: number;
  isVoice: boolean;
}

type ViewState = 'overview' | 'practice' | 'upload' | 'feedback' | 'performance' | 'preparation';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>('overview');
  const [sessionHistory] = useLocalStorage('sessionHistory', []);
  const [jobDescription, setJobDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentFeedback, setCurrentFeedback] = useState<FeedbackResponse | null>(null);
  const [currentQuestionData, setCurrentQuestionData] = useState<{question: string, answer: string} | null>(null);
  const [sessionAnswers, setSessionAnswers] = useState<SessionAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionResult, setSessionResult] = useState<any>(null);
  const { toast } = useToast();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const totalSessions = sessionHistory.length;
  const averageScore = sessionHistory.length > 0 
    ? Math.round(sessionHistory.reduce((acc: number, session: any) => acc + session.overall_performance, 0) / sessionHistory.length)
    : 0;

  const handleJobDescriptionSubmit = async (jobDesc: string) => {
    setIsLoading(true);
    setJobDescription(jobDesc);
    
    try {
      const response = await geminiService.generateQuestions(jobDesc);
      setQuestions(response.questions);
      setCurrentView('practice');
      
      toast({
        title: "Questions Generated Successfully!",
        description: `Generated ${response.questions.length} personalized interview questions.`,
      });
    } catch (error) {
      toast({
        title: "Error Generating Questions",
        description: "Failed to generate questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSubmit = async (questionId: string, answer: string, isVoice: boolean) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    setIsLoading(true);
    
    try {
      const feedback = await geminiService.getFeedback(jobDescription, question.text, answer);
      
      const sessionAnswer: SessionAnswer = {
        questionId,
        question: question.text,
        answer,
        feedback,
        timeSpent: Date.now(),
        isVoice
      };
      
      setSessionAnswers(prev => [...prev, sessionAnswer]);
      setCurrentFeedback(feedback);
      setCurrentQuestionData({ question: question.text, answer });
      setCurrentView('feedback');
      
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
    setIsLoading(true);
    
    try {
      const questionsAndAnswers = sessionAnswers.map(sa => ({
        question: sa.question,
        answer: sa.answer,
        feedback: sa.feedback!
      }));

      const report = await geminiService.generateSessionReport(
        jobDescription,
        questionsAndAnswers
      );

      const result = {
        ...report,
        session_date: new Date().toISOString(),
        questions_answered: sessionData.answeredQuestions,
        total_time: sessionData.totalTime
      };

      setSessionResult(result);
      setCurrentView('performance');
      
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

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderMainContent = () => {
    switch (currentView) {
      case 'upload':
        return (
          <JobDescriptionUpload 
            onJobDescriptionSubmit={handleJobDescriptionSubmit}
            isLoading={isLoading}
          />
        );
      case 'practice':
        return (
          <PracticeSession
            questions={questions}
            jobDescription={jobDescription}
            onAnswerSubmit={handleAnswerSubmit}
            onSessionComplete={handleSessionComplete}
          />
        );
      case 'feedback':
        return currentFeedback && currentQuestionData ? (
          <FeedbackDisplay
            feedback={currentFeedback}
            question={currentQuestionData.question}
            answer={currentQuestionData.answer}
            onNextQuestion={() => setCurrentView('practice')}
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
      case 'preparation':
        return <JobPreparationTools onToolSelect={() => {}} />;
      default:
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 rounded-2xl p-8 border">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16 border-2 border-primary/20">
                  <AvatarImage src={user.photoURL || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                    {user.displayName?.charAt(0) || user.email?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {getGreeting()}, {user.displayName?.split(' ')[0] || 'there'}!
                  </h1>
                  <p className="text-muted-foreground">Ready to ace your next interview?</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-background/50 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-2xl font-bold">{totalSessions}</p>
                        <p className="text-sm text-muted-foreground">Sessions Completed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-background/50 border-accent/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="h-8 w-8 text-accent" />
                      <div>
                        <p className="text-2xl font-bold">{averageScore}%</p>
                        <p className="text-sm text-muted-foreground">Average Score</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-background/50 border-secondary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="h-8 w-8 text-secondary" />
                      <div>
                        <p className="text-2xl font-bold">
                          {sessionHistory.length > 0 ? 
                            sessionHistory[sessionHistory.length - 1]?.interview_readiness || 'N/A' : 'N/A'}
                        </p>
                        <p className="text-sm text-muted-foreground">Interview Readiness</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group" 
                    onClick={() => setCurrentView('upload')}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <PlayCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Start New Session</CardTitle>
                      <CardDescription>Upload job description and begin practice</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group" 
                    onClick={() => setCurrentView('preparation')}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                      <BookOpen className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Job Preparation</CardTitle>
                      <CardDescription>Access preparation tools and resources</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group" 
                    onClick={() => setCurrentView('performance')}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                      <BarChart3 className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">View Analytics</CardTitle>
                      <CardDescription>Track your progress and improvements</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Recent Sessions */}
            {sessionHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sessionHistory.slice(-3).reverse().map((session: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {new Date(session.session_date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {session.questions_answered} questions answered
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={session.overall_performance >= 80 ? "default" : session.overall_performance >= 60 ? "secondary" : "destructive"}>
                            {session.overall_performance}%
                          </Badge>
                          <Badge variant="outline">{session.interview_readiness}</Badge>
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-xl font-bold">AI Interview Coach</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => setCurrentView('overview')}>
                Overview
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setCurrentView('preparation')}>
                Preparation
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {renderMainContent()}
      </main>
    </div>
  );
};

export default Dashboard;