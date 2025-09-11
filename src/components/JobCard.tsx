import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { JobDescription, JobSession } from '@/types/job';
import { useJobSessions } from '@/hooks/useJobSessions';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Calendar,
  Play,
  RotateCcw,
  TrendingUp,
  Clock,
  CheckCircle,
  PauseCircle,
  Target
} from 'lucide-react';

interface JobCardProps {
  job: JobDescription;
}

const JobCard = ({ job }: JobCardProps) => {
  const { sessions } = useJobSessions();
  const navigate = useNavigate();

  const jobSessions = sessions.filter(s => s.jobId === job.id);
  const activeSession = jobSessions.find(s => s.status === 'in_progress');
  const completedSessions = jobSessions.filter(s => s.status === 'completed');
  
  const averageScore = completedSessions.length > 0
    ? Math.round(completedSessions.reduce((acc, session) => acc + (session.overallScore || 0), 0) / completedSessions.length)
    : 0;

  const getStatusInfo = () => {
    if (activeSession) {
      return {
        icon: <PauseCircle className="h-5 w-5 text-orange-500" />,
        label: 'In Progress',
        color: 'orange',
        description: `${activeSession.answers.length}/${activeSession.totalQuestions} questions answered`
      };
    }
    
    if (completedSessions.length > 0) {
      return {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        label: 'Completed',
        color: 'green',
        description: `${completedSessions.length} session${completedSessions.length > 1 ? 's' : ''} completed`
      };
    }
    
    return {
      icon: <Play className="h-5 w-5 text-blue-500" />,
      label: 'Ready to Start',
      color: 'blue',
      description: 'No sessions yet'
    };
  };

  const statusInfo = getStatusInfo();

  const handleContinue = () => {
    navigate(`/job/${job.id}`);
  };

  const handleStartNew = () => {
    navigate(`/job/${job.id}?new=true`);
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {job.title}
              </CardTitle>
            </div>
            <CardDescription className="text-base font-medium">
              {job.company}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {statusInfo.icon}
            <Badge variant={statusInfo.color === 'orange' ? 'secondary' : statusInfo.color === 'green' ? 'default' : 'outline'}>
              {statusInfo.label}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Section */}
        {activeSession && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Session Progress</span>
              <span className="font-medium">{Math.round(activeSession.progress)}%</span>
            </div>
            <Progress value={activeSession.progress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {statusInfo.description}
            </p>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 py-2">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-sm font-semibold">
              <Target className="h-3 w-3" />
              {jobSessions.length}
            </div>
            <p className="text-xs text-muted-foreground">Total Sessions</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-sm font-semibold">
              <TrendingUp className="h-3 w-3" />
              {averageScore > 0 ? `${averageScore}%` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">Avg Score</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-sm font-semibold">
              <Clock className="h-3 w-3" />
              {completedSessions.length}
            </div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
        </div>

        {/* Description Preview */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {job.description.substring(0, 150)}
            {job.description.length > 150 ? '...' : ''}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {activeSession ? (
            <Button onClick={handleContinue} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              Continue Session
            </Button>
          ) : (
            <Button onClick={handleContinue} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              {completedSessions.length > 0 ? 'View Details' : 'Start Practice'}
            </Button>
          )}
          
          <Button variant="outline" onClick={handleStartNew}>
            <RotateCcw className="h-4 w-4 mr-2" />
            New Session
          </Button>
        </div>

        {/* Last Updated */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t">
          <Calendar className="h-3 w-3" />
          Updated {new Date(job.updatedAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;