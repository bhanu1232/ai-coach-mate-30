import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Brain,
  Clock,
  Target,
  TrendingUp,
  Users,
  Lightbulb,
  Star,
  ChevronRight,
  Play,
  CheckCircle
} from "lucide-react";

interface JobPreparationToolsProps {
  jobTitle?: string;
  onToolSelect: (tool: string) => void;
}

const JobPreparationTools = ({ jobTitle = "Software Engineer", onToolSelect }: JobPreparationToolsProps) => {
  const preparationTools = [
    {
      id: "company-research",
      title: "Company Research Guide",
      description: "Learn about the company culture, values, and recent news",
      icon: <BookOpen className="w-6 h-6" />,
      difficulty: "Beginner",
      estimatedTime: "30 mins",
      progress: 0,
      color: "bg-blue-500/20 text-blue-600"
    },
    {
      id: "technical-prep",
      title: "Technical Skills Assessment", 
      description: "Practice coding problems and system design questions",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Advanced",
      estimatedTime: "2 hours",
      progress: 25,
      color: "bg-purple-500/20 text-purple-600"
    },
    {
      id: "behavioral-prep",
      title: "Behavioral Question Bank",
      description: "Master STAR method with 50+ behavioral questions",
      icon: <Users className="w-6 h-6" />,
      difficulty: "Intermediate",
      estimatedTime: "1 hour",
      progress: 60,
      color: "bg-green-500/20 text-green-600"
    },
    {
      id: "salary-negotiation",
      title: "Salary Negotiation Tips",
      description: "Learn strategies to negotiate your best offer",
      icon: <TrendingUp className="w-6 h-6" />,
      difficulty: "Intermediate",
      estimatedTime: "45 mins",
      progress: 0,
      color: "bg-orange-500/20 text-orange-600"
    },
    {
      id: "mock-interviews",
      title: "Full Mock Interview Sessions",
      description: "Complete 45-minute interview simulations",
      icon: <Target className="w-6 h-6" />,
      difficulty: "Advanced",
      estimatedTime: "45 mins",
      progress: 40,
      color: "bg-red-500/20 text-red-600"
    },
    {
      id: "follow-up-prep",
      title: "Post-Interview Follow-up",
      description: "Templates and timing for thank you notes",
      icon: <Lightbulb className="w-6 h-6" />,
      difficulty: "Beginner",
      estimatedTime: "15 mins",
      progress: 0,
      color: "bg-yellow-500/20 text-yellow-600"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "text-green-600 bg-green-100";
      case "Intermediate": return "text-yellow-600 bg-yellow-100";
      case "Advanced": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 0) return "bg-gray-200";
    if (progress < 50) return "bg-yellow-400";
    if (progress < 100) return "bg-blue-400";
    return "bg-green-400";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Advanced Job Preparation Tools</h2>
        <p className="text-muted-foreground">Comprehensive resources to ace your {jobTitle} interview</p>
      </div>

      {/* Quick Stats */}
      <Card className="p-6 glass">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold">6</div>
            <div className="text-sm text-muted-foreground">Prep Tools</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div className="text-2xl font-bold">21%</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-warning/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Clock className="w-6 h-6 text-warning" />
            </div>
            <div className="text-2xl font-bold">5.5h</div>
            <div className="text-sm text-muted-foreground">Total Time</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Star className="w-6 h-6 text-accent" />
            </div>
            <div className="text-2xl font-bold">Pro</div>
            <div className="text-sm text-muted-foreground">Level</div>
          </div>
        </div>
      </Card>

      {/* Preparation Tools Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {preparationTools.map((tool) => (
          <Card key={tool.id} className="p-6 glass hover:shadow-glow transition-all duration-300 group cursor-pointer">
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${tool.color}`}>
                {tool.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {tool.title}
                  </h3>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">
                  {tool.description}
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm">
                    <Badge 
                      variant="secondary" 
                      className={getDifficultyColor(tool.difficulty)}
                    >
                      {tool.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {tool.estimatedTime}
                    </div>
                  </div>
                  
                  {tool.progress > 0 ? (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{tool.progress}%</span>
                      </div>
                      <Progress 
                        value={tool.progress} 
                        className="h-2"
                      />
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onToolSelect(tool.id)}
                      className="w-full bg-card/50 backdrop-blur-sm hover:bg-card/80"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Learning
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Study Plan */}
      <Card className="p-6 glass">
        <h3 className="text-xl font-semibold mb-4">Recommended Study Plan</h3>
        <div className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="text-lg font-bold text-primary mb-1">Week 1-2</div>
              <div className="text-sm text-muted-foreground">Foundation Building</div>
              <div className="text-xs mt-2">Company Research + Behavioral Prep</div>
            </div>
            <div className="text-center p-4 bg-warning/5 rounded-lg border border-warning/20">
              <div className="text-lg font-bold text-warning mb-1">Week 3-4</div>
              <div className="text-sm text-muted-foreground">Skills Practice</div>
              <div className="text-xs mt-2">Technical Assessment + Mock Interviews</div>
            </div>
            <div className="text-center p-4 bg-success/5 rounded-lg border border-success/20">
              <div className="text-lg font-bold text-success mb-1">Week 5</div>
              <div className="text-sm text-muted-foreground">Final Preparation</div>
              <div className="text-xs mt-2">Negotiation + Follow-up Prep</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default JobPreparationTools;