import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Target, 
  Lightbulb,
  BarChart3,
  ArrowRight
} from "lucide-react";
import { FeedbackResponse } from "@/services/gemini";

interface FeedbackDisplayProps {
  feedback: FeedbackResponse;
  question: string;
  answer: string;
  onNextQuestion?: () => void;
  showNextButton?: boolean;
}

const FeedbackDisplay = ({ 
  feedback, 
  question, 
  answer, 
  onNextQuestion, 
  showNextButton = true 
}: FeedbackDisplayProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'confident': return "text-success";
      case 'weak': return "text-destructive";
      default: return "text-warning";
    }
  };

  const getToneIcon = (tone: string) => {
    switch (tone) {
      case 'confident': return <CheckCircle className="w-4 h-4" />;
      case 'weak': return <AlertCircle className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">AI Feedback</h2>
        <p className="text-muted-foreground">Detailed analysis of your interview answer</p>
      </div>

      {/* Overall Score Card */}
      <Card className="p-8 glass text-center">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
            <BarChart3 className="w-10 h-10 text-primary-foreground" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Overall Score</h3>
          <div className={`text-5xl font-bold mb-4 ${getScoreColor(feedback.overall_score)}`}>
            {feedback.overall_score}
            <span className="text-2xl text-muted-foreground">/100</span>
          </div>
          <Badge 
            variant={getScoreBadgeVariant(feedback.overall_score)}
            className="text-sm px-4 py-2"
          >
            {feedback.overall_score >= 80 ? 'Excellent Answer' : 
             feedback.overall_score >= 60 ? 'Good Answer' : 'Needs Improvement'}
          </Badge>
        </div>
        
        <Progress 
          value={feedback.overall_score} 
          className="h-3 mb-4" 
        />
        
        <p className="text-muted-foreground">
          Based on clarity, relevance, and completeness of your response
        </p>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Clarity Score */}
        <Card className="p-6 glass">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold">Clarity Score</h4>
              <p className="text-sm text-muted-foreground">How well-structured your answer was</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className={`text-2xl font-bold ${getScoreColor(feedback.clarity * 10)}`}>
              {feedback.clarity}/10
            </span>
            <Progress value={feedback.clarity * 10} className="flex-1 h-2" />
          </div>
        </Card>

        {/* Tone Assessment */}
        <Card className="p-6 glass">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              {getToneIcon(feedback.tone)}
            </div>
            <div>
              <h4 className="font-semibold">Communication Tone</h4>
              <p className="text-sm text-muted-foreground">Overall confidence level</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge 
              variant="outline" 
              className={`${getToneColor(feedback.tone)} border-current`}
            >
              {feedback.tone.charAt(0).toUpperCase() + feedback.tone.slice(1)}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {feedback.tone === 'confident' ? 'Keep up the great energy!' :
               feedback.tone === 'weak' ? 'Try to sound more assertive' :
               'Consider adding more enthusiasm'}
            </span>
          </div>
        </Card>
      </div>

      {/* Strengths */}
      {feedback.strengths.length > 0 && (
        <Card className="p-6 glass">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-success" />
            </div>
            <h4 className="text-lg font-semibold">What You Did Well</h4>
          </div>
          
          <ul className="space-y-2">
            {feedback.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">{strength}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Areas for Improvement */}
      {feedback.areas_for_improvement.length > 0 && (
        <Card className="p-6 glass">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-warning" />
            </div>
            <h4 className="text-lg font-semibold">Areas for Improvement</h4>
          </div>
          
          <ul className="space-y-2">
            {feedback.areas_for_improvement.map((area, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">{area}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Suggestions */}
      {feedback.suggestions.length > 0 && (
        <Card className="p-6 glass">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-accent" />
            </div>
            <h4 className="text-lg font-semibold">Specific Suggestions</h4>
          </div>
          
          <ul className="space-y-3">
            {feedback.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">{suggestion}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Keywords Missed */}
      {feedback.keywords_missed.length > 0 && (
        <Card className="p-6 glass">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-destructive/20 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-destructive" />
            </div>
            <h4 className="text-lg font-semibold">Keywords You Could Mention</h4>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            These terms from the job description could strengthen your answer:
          </p>
          
          <div className="flex flex-wrap gap-2">
            {feedback.keywords_missed.map((keyword, index) => (
              <Badge key={index} variant="outline" className="border-destructive/30 text-destructive">
                {keyword}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Grammar Mistakes */}
      {feedback.grammar_mistakes && feedback.grammar_mistakes.length > 0 && (
        <Card className="p-6 glass">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-warning" />
            </div>
            <h4 className="text-lg font-semibold">Grammar & Language Issues</h4>
          </div>
          
          <ul className="space-y-2">
            {feedback.grammar_mistakes.map((mistake, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">{mistake}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Suggested Better Answer */}
      {feedback.suggested_answer && (
        <Card className="p-6 glass border-primary/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-primary" />
            </div>
            <h4 className="text-lg font-semibold text-primary">Suggested Improved Answer</h4>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            Here's how you could enhance your response:
          </p>
          
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
            <p className="text-foreground">{feedback.suggested_answer}</p>
          </div>
        </Card>
      )}

      {/* Question and Answer Review */}
      <Card className="p-6 glass">
        <h4 className="text-lg font-semibold mb-4">Question & Answer Review</h4>
        
        <div className="space-y-4">
          <div>
            <h5 className="font-medium text-primary mb-2">Question:</h5>
            <p className="text-muted-foreground italic">{question}</p>
          </div>
          
          <div>
            <h5 className="font-medium text-primary mb-2">Your Answer:</h5>
            <p className="text-muted-foreground bg-muted/20 p-4 rounded-lg">{answer}</p>
          </div>
        </div>
      </Card>

      {/* Next Question Button */}
      {showNextButton && onNextQuestion && (
        <div className="text-center">
          <Button
            size="lg"
            onClick={onNextQuestion}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300 px-8 py-6 text-lg"
          >
            Continue to Next Question
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default FeedbackDisplay;