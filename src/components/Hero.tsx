import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Mic, BarChart3, Upload } from "lucide-react";

interface HeroProps {
  onStartPracticing?: () => void;
  onUploadJobDescription?: () => void;
}

const Hero = ({ onStartPracticing, onUploadJobDescription }: HeroProps) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background/80" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 glass p-4 rounded-2xl float">
        <Brain className="w-8 h-8 text-primary" />
      </div>
      <div className="absolute top-40 right-20 glass p-4 rounded-2xl float" style={{ animationDelay: '1s' }}>
        <Mic className="w-8 h-8 text-accent" />
      </div>
      <div className="absolute bottom-40 left-20 glass p-4 rounded-2xl float" style={{ animationDelay: '2s' }}>
        <BarChart3 className="w-8 h-8 text-primary-glow" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Brain className="w-4 h-4" />
              AI-Powered Interview Preparation
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Ace Your Next
              <span className="block gradient-text">Interview</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Get personalized interview questions, practice with AI feedback, and track your progress. 
              Turn your dream job into reality with intelligent preparation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={onStartPracticing}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-6 rounded-2xl group"
            >
              Start Practicing
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              onClick={onUploadJobDescription}
              className="border-2 border-card-border bg-card/50 backdrop-blur-sm hover:bg-card/80 text-lg px-8 py-6 rounded-2xl transition-all duration-300"
            >
              <Upload className="mr-2 w-5 h-5" />
              Upload Job Description
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="p-6 glass hover:shadow-card transition-all duration-300 group cursor-pointer rounded-2xl border border-card-border">
              <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                Smart Question Generation
              </h3>
              <p className="text-muted-foreground">
                AI analyzes your job description to create tailored interview questions
              </p>
            </div>

            <div className="p-6 glass hover:shadow-card transition-all duration-300 group cursor-pointer rounded-2xl border border-card-border">
              <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Mic className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                Voice Practice Mode
              </h3>
              <p className="text-muted-foreground">
                Practice answers with speech-to-text and get real-time feedback
              </p>
            </div>

            <div className="p-6 glass hover:shadow-card transition-all duration-300 group cursor-pointer rounded-2xl border border-card-border">
              <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <BarChart3 className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                Performance Analytics
              </h3>
              <p className="text-muted-foreground">
                Track improvement with detailed scoring and progress metrics
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;