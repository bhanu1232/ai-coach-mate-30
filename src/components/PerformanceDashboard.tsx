import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  TrendingUp, 
  Clock, 
  Target, 
  Star, 
  BookOpen, 
  Award,
  BarChart3,
  RefreshCw,
  Download
} from "lucide-react";

interface SessionResult {
  overall_performance: number;
  key_strengths: string[];
  priority_improvements: string[];
  recommendations: string[];
  interview_readiness: 'Excellent' | 'Good' | 'Needs Improvement' | 'Not Ready';
  session_date: string;
  questions_answered: number;
  total_time: number;
}

interface PerformanceDashboardProps {
  sessionResult: SessionResult;
  onStartNewSession: () => void;
  onDownloadReport: () => void;
}

const PerformanceDashboard = ({ 
  sessionResult, 
  onStartNewSession,
  onDownloadReport 
}: PerformanceDashboardProps) => {
  const getReadinessColor = (readiness: string) => {
    switch (readiness) {
      case 'Excellent': return 'text-success border-success/30 bg-success/10';
      case 'Good': return 'text-primary border-primary/30 bg-primary/10';
      case 'Needs Improvement': return 'text-warning border-warning/30 bg-warning/10';
      case 'Not Ready': return 'text-destructive border-destructive/30 bg-destructive/10';
      default: return 'text-muted-foreground border-muted/30 bg-muted/10';
    }
  };

  const getReadinessIcon = (readiness: string) => {
    switch (readiness) {
      case 'Excellent': return <Trophy className="w-5 h-5" />;
      case 'Good': return <Star className="w-5 h-5" />;
      case 'Needs Improvement': return <TrendingUp className="w-5 h-5" />;
      case 'Not Ready': return <BookOpen className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning"; 
    return "text-destructive";
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Award className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-bold mb-2">Interview Session Complete!</h1>
        <p className="text-xl text-muted-foreground">Here's your comprehensive performance analysis</p>
      </div>

      {/* Main Performance Card */}
      <Card className="p-8 glass text-center">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Overall Score */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Overall Performance</h3>
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(sessionResult.overall_performance)}`}>
              {sessionResult.overall_performance}
              <span className="text-2xl text-muted-foreground">/100</span>
            </div>
            <Progress value={sessionResult.overall_performance} className="h-3" />
          </div>

          {/* Interview Readiness */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Interview Readiness</h3>
            <Badge 
              variant="outline" 
              className={`text-lg px-6 py-3 ${getReadinessColor(sessionResult.interview_readiness)}`}
            >
              {getReadinessIcon(sessionResult.interview_readiness)}
              <span className="ml-2">{sessionResult.interview_readiness}</span>
            </Badge>
          </div>

          {/* Session Stats */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <span className="font-semibold">{sessionResult.questions_answered} Questions</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-5 h-5 text-accent" />
              <span className="font-semibold">{formatTime(sessionResult.total_time)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Detailed Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card className="p-6 glass">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-success" />
            </div>
            <h3 className="text-xl font-semibold">Key Strengths</h3>
          </div>
          
          <div className="space-y-4">
            {sessionResult.key_strengths.map((strength, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-success">{index + 1}</span>
                </div>
                <p className="text-muted-foreground">{strength}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Priority Improvements */}
        <Card className="p-6 glass">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-warning" />
            </div>
            <h3 className="text-xl font-semibold">Priority Improvements</h3>
          </div>
          
          <div className="space-y-4">
            {sessionResult.priority_improvements.map((improvement, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-warning/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-warning">{index + 1}</span>
                </div>
                <p className="text-muted-foreground">{improvement}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="p-6 glass">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Personalized Recommendations</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {sessionResult.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-muted/10 rounded-lg">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">{index + 1}</span>
              </div>
              <p className="text-muted-foreground">{recommendation}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Progress Chart Placeholder */}
      <Card className="p-6 glass">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-accent" />
          </div>
          <h3 className="text-xl font-semibold">Performance Breakdown</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-3 bg-gradient-primary rounded-2xl flex items-center justify-center">
              <Target className="w-8 h-8 text-primary-foreground" />
            </div>
            <h4 className="font-semibold mb-1">Technical Skills</h4>
            <div className="text-2xl font-bold text-primary mb-2">
              {Math.round(sessionResult.overall_performance * 0.9)}%
            </div>
            <Progress value={sessionResult.overall_performance * 0.9} className="h-2" />
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-3 bg-gradient-primary rounded-2xl flex items-center justify-center">
              <Star className="w-8 h-8 text-primary-foreground" />
            </div>
            <h4 className="font-semibold mb-1">Communication</h4>
            <div className="text-2xl font-bold text-primary mb-2">
              {Math.round(sessionResult.overall_performance * 1.1)}%
            </div>
            <Progress value={sessionResult.overall_performance * 1.1} className="h-2" />
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-3 bg-gradient-primary rounded-2xl flex items-center justify-center">
              <Trophy className="w-8 h-8 text-primary-foreground" />
            </div>
            <h4 className="font-semibold mb-1">Overall Readiness</h4>
            <div className="text-2xl font-bold text-primary mb-2">
              {sessionResult.overall_performance}%
            </div>
            <Progress value={sessionResult.overall_performance} className="h-2" />
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          size="lg"
          onClick={onStartNewSession}
          className="bg-gradient-primary hover:shadow-glow transition-all duration-300 px-8 py-6 text-lg"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Start New Practice Session
        </Button>
        
        <Button
          size="lg"
          variant="outline"
          onClick={onDownloadReport}
          className="border-2 border-card-border bg-card/50 backdrop-blur-sm hover:bg-card/80 px-8 py-6 text-lg"
        >
          <Download className="w-5 h-5 mr-2" />
          Download Full Report
        </Button>
      </div>

      {/* Motivation Message */}
      <Card className="p-6 glass text-center">
        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-6 h-6 text-primary-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Keep Practicing!</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {sessionResult.interview_readiness === 'Excellent' 
            ? "Outstanding work! You're well-prepared for your interviews. Keep refining your skills and stay confident."
            : sessionResult.interview_readiness === 'Good'
            ? "Great progress! Focus on the improvement areas mentioned above, and you'll be interview-ready in no time."
            : "You're on the right track! Regular practice with AI feedback will help you build the confidence and skills needed for success."
          }
        </p>
      </Card>
    </div>
  );
};

export default PerformanceDashboard;