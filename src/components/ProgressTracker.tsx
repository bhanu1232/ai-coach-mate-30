import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { UserProgress } from '@/types/job';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Award,
  Brain,
  AlertTriangle,
  CheckCircle,
  BarChart3
} from 'lucide-react';

interface ProgressTrackerProps {
  progress: UserProgress;
}

const ProgressTracker = ({ progress }: ProgressTrackerProps) => {
  const formatTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getTrendIcon = (improvement: number) => {
    if (improvement > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (improvement < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <BarChart3 className="h-4 w-4 text-muted-foreground" />;
  };

  const getTrendText = (improvement: number) => {
    if (improvement > 5) return "Excellent progress!";
    if (improvement > 0) return "Improving";
    if (improvement < -5) return "Needs attention";
    if (improvement < 0) return "Declining";
    return "Stable";
  };

  const getReadinessLevel = () => {
    if (progress.averageScore >= 85) return { level: 'Excellent', color: 'bg-green-500', icon: CheckCircle };
    if (progress.averageScore >= 70) return { level: 'Good', color: 'bg-blue-500', icon: Target };
    if (progress.averageScore >= 55) return { level: 'Fair', color: 'bg-yellow-500', icon: AlertTriangle };
    return { level: 'Needs Work', color: 'bg-red-500', icon: AlertTriangle };
  };

  const readiness = getReadinessLevel();
  const ReadinessIcon = readiness.icon;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{progress.totalSessions}</p>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{progress.completedSessions}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Award className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{progress.averageScore}%</p>
                <p className="text-sm text-muted-foreground">Average Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Clock className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatTime(progress.totalTimeSpent)}</p>
                <p className="text-sm text-muted-foreground">Time Practiced</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interview Readiness */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ReadinessIcon className="h-5 w-5" />
              Interview Readiness
            </CardTitle>
            <CardDescription>
              Based on your recent performance and areas of improvement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Readiness</span>
              <Badge className={readiness.color}>{readiness.level}</Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to next level</span>
                <span>{progress.averageScore}%</span>
              </div>
              <Progress value={progress.averageScore} className="h-2" />
            </div>

            {progress.recentTrends.scoreImprovement !== 0 && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                {getTrendIcon(progress.recentTrends.scoreImprovement)}
                <div>
                  <p className="text-sm font-medium">
                    {getTrendText(progress.recentTrends.scoreImprovement)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {progress.recentTrends.scoreImprovement > 0 ? '+' : ''}{progress.recentTrends.scoreImprovement.toFixed(1)} points from last 5 sessions
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Strong Areas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-green-500" />
              Strengths & Areas for Improvement
            </CardTitle>
            <CardDescription>
              Insights from your recent interview sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {progress.strongAreas.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-green-600 mb-2 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Strong Areas
                </h4>
                <div className="flex flex-wrap gap-1">
                  {progress.strongAreas.slice(0, 3).map((area, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {progress.improvementAreas.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-orange-600 mb-2 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Focus Areas
                </h4>
                <div className="flex flex-wrap gap-1">
                  {progress.improvementAreas.slice(0, 3).map((area, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {progress.strongAreas.length === 0 && progress.improvementAreas.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Complete more sessions to see your strengths and improvement areas
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressTracker;