import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Hero from "@/components/Hero";
import JobDescriptionUpload from "@/components/JobDescriptionUpload";
import PracticeSession from "@/components/PracticeSession";
import FeedbackDisplay from "@/components/FeedbackDisplay";
import PerformanceDashboard from "@/components/PerformanceDashboard";
import { geminiService, FeedbackResponse } from "@/services/gemini";

type AppState = 'hero' | 'upload' | 'practice' | 'feedback' | 'dashboard';

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

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('hero');
  const [jobDescription, setJobDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentFeedback, setCurrentFeedback] = useState<FeedbackResponse | null>(null);
  const [currentQuestionData, setCurrentQuestionData] = useState<{question: string, answer: string} | null>(null);
  const [sessionAnswers, setSessionAnswers] = useState<SessionAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionResult, setSessionResult] = useState<any>(null);
  
  const { toast } = useToast();

  const handleJobDescriptionSubmit = async (jobDesc: string) => {
    setIsLoading(true);
    setJobDescription(jobDesc);
    
    try {
      const response = await geminiService.generateQuestions(jobDesc);
      setQuestions(response.questions);
      setCurrentState('practice');
      
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
      console.error("Error generating questions:", error);
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
        timeSpent: Date.now(), // This would be calculated properly in a real implementation
        isVoice
      };
      
      setSessionAnswers(prev => [...prev, sessionAnswer]);
      setCurrentFeedback(feedback);
      setCurrentQuestionData({ question: question.text, answer });
      setCurrentState('feedback');
      
    } catch (error) {
      toast({
        title: "Error Getting Feedback",
        description: "Failed to analyze your answer. Please try again.",
        variant: "destructive",
      });
      console.error("Error getting feedback:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSessionComplete = async (sessionData: any) => {
    setIsLoading(true);
    
    try {
      // Create questions and answers data for session report
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
      setCurrentState('dashboard');
      
    } catch (error) {
      toast({
        title: "Error Generating Report",
        description: "Failed to generate session report. Please try again.",
        variant: "destructive",
      });
      console.error("Error generating session report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = () => {
    setCurrentState('practice');
    setCurrentFeedback(null);
    setCurrentQuestionData(null);
  };

  const handleStartNewSession = () => {
    setCurrentState('hero');
    setJobDescription("");
    setQuestions([]);
    setSessionAnswers([]);
    setCurrentFeedback(null);
    setCurrentQuestionData(null);
    setSessionResult(null);
  };

  const handleDownloadReport = () => {
    if (!sessionResult) return;
    
    const reportContent = `
AI Interview Coach - Performance Report
=====================================
Date: ${new Date(sessionResult.session_date).toLocaleDateString()}
Overall Performance: ${sessionResult.overall_performance}/100
Interview Readiness: ${sessionResult.interview_readiness}
Questions Answered: ${sessionResult.questions_answered}
Total Time: ${Math.floor(sessionResult.total_time / 60000)}m ${Math.floor((sessionResult.total_time % 60000) / 1000)}s

Key Strengths:
${sessionResult.key_strengths.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}

Priority Improvements:
${sessionResult.priority_improvements.map((i: string, idx: number) => `${idx + 1}. ${i}`).join('\n')}

Recommendations:
${sessionResult.recommendations.map((r: string, i: number) => `${i + 1}. ${r}`).join('\n')}
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Downloaded",
      description: "Your interview performance report has been saved.",
    });
  };

  const renderCurrentState = () => {
    switch (currentState) {
      case 'hero':
        return <Hero />;
      
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
            onNextQuestion={handleNextQuestion}
          />
        ) : null;
      
      case 'dashboard':
        return sessionResult ? (
          <PerformanceDashboard
            sessionResult={sessionResult}
            onStartNewSession={handleStartNewSession}
            onDownloadReport={handleDownloadReport}
          />
        ) : null;
      
      default:
        return <Hero />;
    }
  };

  // Add navigation handlers for hero buttons
  const handleStartPracticing = () => {
    setCurrentState('upload');
  };

  const handleUploadJobDescription = () => {
    setCurrentState('upload');
  };

  return (
    <div className="min-h-screen bg-background">
      {currentState === 'hero' && (
        <Hero 
          onStartPracticing={handleStartPracticing}
          onUploadJobDescription={handleUploadJobDescription}
        />
      )}
      {currentState !== 'hero' && renderCurrentState()}
    </div>
  );
};

export default Index;
