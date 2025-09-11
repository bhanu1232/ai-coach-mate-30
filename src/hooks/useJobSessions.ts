import { useState, useCallback } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { JobDescription, JobSession, SessionAnswer, UserProgress } from '@/types/job';

export const useJobSessions = () => {
  const [jobs, setJobs] = useLocalStorage<JobDescription[]>('jobs', []);
  const [sessions, setSessions] = useLocalStorage<JobSession[]>('jobSessions', []);
  const [loading, setLoading] = useState(false);

  const createJob = useCallback((jobData: Omit<JobDescription, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newJob: JobDescription = {
      id: Date.now().toString(),
      ...jobData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setJobs(prev => [...prev, newJob]);
    return newJob;
  }, [setJobs]);

  const createSession = useCallback((jobId: string, questions: any[]) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) throw new Error('Job not found');

    const newSession: JobSession = {
      id: Date.now().toString(),
      jobId,
      jobTitle: job.title,
      company: job.company,
      status: 'in_progress',
      questions,
      answers: [],
      currentQuestionIndex: 0,
      totalQuestions: questions.length,
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSessions(prev => [...prev, newSession]);
    return newSession;
  }, [jobs, setSessions]);

  const updateSession = useCallback((sessionId: string, updates: Partial<JobSession>) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, ...updates, updatedAt: new Date().toISOString() }
        : session
    ));
  }, [setSessions]);

  const addAnswer = useCallback((sessionId: string, answer: SessionAnswer) => {
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        const newAnswers = [...session.answers, answer];
        const progress = (newAnswers.length / session.totalQuestions) * 100;
        
        return {
          ...session,
          answers: newAnswers,
          currentQuestionIndex: Math.min(session.currentQuestionIndex + 1, session.totalQuestions - 1),
          progress,
          updatedAt: new Date().toISOString(),
        };
      }
      return session;
    }));
  }, [setSessions]);

  const completeSession = useCallback((sessionId: string, sessionReport: any) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { 
            ...session, 
            status: 'completed' as const,
            sessionReport,
            overallScore: sessionReport.overall_performance,
            completedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : session
    ));
  }, [setSessions]);

  const getSessionsByJob = useCallback((jobId: string) => {
    return sessions.filter(session => session.jobId === jobId);
  }, [sessions]);

  const getActiveSession = useCallback((jobId: string) => {
    return sessions.find(session => session.jobId === jobId && session.status === 'in_progress');
  }, [sessions]);

  const getUserProgress = useCallback((): UserProgress => {
    const completedSessions = sessions.filter(s => s.status === 'completed');
    const totalSessions = sessions.length;
    
    const averageScore = completedSessions.length > 0
      ? completedSessions.reduce((acc, session) => acc + (session.overallScore || 0), 0) / completedSessions.length
      : 0;

    const totalTimeSpent = sessions.reduce((acc, session) => 
      acc + session.answers.reduce((time, answer) => time + answer.timeSpent, 0), 0
    );

    // Calculate strong areas and improvement areas from recent sessions
    const recentSessions = completedSessions.slice(-5);
    const strongAreas: string[] = [];
    const improvementAreas: string[] = [];

    recentSessions.forEach(session => {
      if (session.sessionReport) {
        strongAreas.push(...session.sessionReport.key_strengths);
        improvementAreas.push(...session.sessionReport.priority_improvements);
      }
    });

    // Calculate trends
    const recent5Sessions = completedSessions.slice(-5);
    const previous5Sessions = completedSessions.slice(-10, -5);
    
    const recentAverage = recent5Sessions.length > 0
      ? recent5Sessions.reduce((acc, s) => acc + (s.overallScore || 0), 0) / recent5Sessions.length
      : 0;
    
    const previousAverage = previous5Sessions.length > 0
      ? previous5Sessions.reduce((acc, s) => acc + (s.overallScore || 0), 0) / previous5Sessions.length
      : 0;

    return {
      totalSessions,
      completedSessions: completedSessions.length,
      averageScore: Math.round(averageScore),
      totalTimeSpent,
      strongAreas: [...new Set(strongAreas)].slice(0, 5),
      improvementAreas: [...new Set(improvementAreas)].slice(0, 5),
      recentTrends: {
        scoreImprovement: recentAverage - previousAverage,
        confidenceGrowth: recentAverage > previousAverage ? 1 : recentAverage < previousAverage ? -1 : 0,
      },
    };
  }, [sessions]);

  return {
    jobs,
    sessions,
    loading,
    createJob,
    createSession,
    updateSession,
    addAnswer,
    completeSession,
    getSessionsByJob,
    getActiveSession,
    getUserProgress,
  };
};