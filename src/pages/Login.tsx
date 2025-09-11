import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';
import { Mail, Sparkles, Target, TrendingUp } from 'lucide-react';

const Login = () => {
  const { user, signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      toast({
        title: "Welcome to AI Interview Coach!",
        description: "You've successfully signed in. Let's start your interview preparation journey.",
      });
    } catch (error) {
      toast({
        title: "Sign In Failed",
        description: "There was an error signing in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Hero content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/90 to-accent bg-clip-text text-transparent">
              AI Interview Coach
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Master your interviews with AI-powered feedback, personalized coaching, 
              and comprehensive preparation tools.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="grid gap-4">
            {[
              {
                icon: <Sparkles className="h-5 w-5 text-primary" />,
                title: "AI-Powered Feedback",
                description: "Get instant, detailed feedback on your answers"
              },
              {
                icon: <Target className="h-5 w-5 text-accent" />,
                title: "Tailored Questions",
                description: "Practice with questions specific to your job description"
              },
              {
                icon: <TrendingUp className="h-5 w-5 text-secondary" />,
                title: "Track Progress",
                description: "Monitor your improvement with detailed analytics"
              }
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-background/50 border">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Login card */}
        <div className="flex justify-center lg:justify-end">
          <Card className="w-full max-w-md border-2 shadow-xl bg-card/95 backdrop-blur-sm">
            <CardHeader className="text-center space-y-3">
              <CardTitle className="text-2xl font-bold">Get Started Today</CardTitle>
              <CardDescription className="text-base">
                Sign in to unlock your personalized interview preparation experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                size="lg"
                className="w-full h-12 text-base bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-300 transform hover:scale-105"
              >
                <Mail className="mr-3 h-5 w-5" />
                {isLoading ? "Signing in..." : "Continue with Google"}
              </Button>
              
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  By signing in, you agree to our terms of service and privacy policy
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;