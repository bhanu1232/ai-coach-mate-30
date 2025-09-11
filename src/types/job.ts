export interface JobDescription {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'technical' | 'behavioral';
  category: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Answer {
  id: string;
  questionId: string;
  answer: string;
  isVoice: boolean;
  timeSpent: number;
  createdAt: string;
}

export interface Feedback {
  clarity: number;
  tone: string;
  keywords_missed: string[];
  grammar_mistakes: string[];
  suggestions: string[];
  better_answer?: string;
  overall_score: number;
}

export interface SessionAnswer {
  questionId: string;
  question: string;
  answer: string;
  feedback?: Feedback;
  timeSpent: number;
  isVoice: boolean;
  createdAt: string;
}

export interface JobSession {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  status: 'draft' | 'in_progress' | 'completed';
  questions: Question[];
  answers: SessionAnswer[];
  currentQuestionIndex: number;
  totalQuestions: number;
  progress: number;
  overallScore?: number;
  sessionReport?: {
    overall_performance: number;
    key_strengths: string[];
    priority_improvements: string[];
    recommendations: string[];
    interview_readiness: 'Excellent' | 'Good' | 'Needs Improvement' | 'Not Ready';
  };
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface UserProgress {
  totalSessions: number;
  completedSessions: number;
  averageScore: number;
  totalTimeSpent: number;
  strongAreas: string[];
  improvementAreas: string[];
  recentTrends: {
    scoreImprovement: number;
    confidenceGrowth: number;
  };
}