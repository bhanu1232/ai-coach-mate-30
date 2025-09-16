import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Sparkles, Target, TrendingUp, Loader2 } from 'lucide-react';

const Login = () => {
  const { user, signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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
      console.error('Sign in error:', error);
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
      {/* Back to Home Button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Button>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Hero content */}
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
              <Brain className="w-4 h-4" />
              AI-Powered Interview Preparation
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Master Your Next
              <span className="block gradient-text">Interview</span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Get personalized interview questions, practice with AI feedback, and track your progress. 
              Turn your dream job into reality with intelligent preparation.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="grid gap-6">
            {[
              {
                icon: <Sparkles className="h-6 w-6 text-primary" />,
                title: "AI-Powered Questions",
                description: "Get personalized interview questions tailored to your specific job description and industry requirements."
              },
              {
                icon: <Target className="h-6 w-6 text-accent" />,
                title: "Real-time Feedback",
                description: "Receive instant, detailed feedback on your answers with suggestions for improvement."
              },
              {
                icon: <TrendingUp className="h-6 w-6 text-success" />,
                title: "Progress Tracking",
                description: "Monitor your improvement with comprehensive analytics and performance metrics."
              }
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-card/50 border border-card-border">
                <div className="p-2 rounded-lg bg-background/80">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Sign in card */}
        <div className="flex justify-center lg:justify-end">
          <Card className="w-full max-w-md border-2 shadow-2xl bg-card/95 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4 pb-8">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
                <Brain className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                <CardDescription className="text-base mt-2">
                  Sign in to continue your interview preparation journey
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6 pb-8">
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                size="lg"
                className="w-full h-14 text-base bg-gradient-primary hover:shadow-glow transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>
              
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-muted" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Why choose us?</span>
                  </div>
                </div>
                
                <div className="grid gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Personalized AI coaching</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>Industry-specific questions</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span>Detailed performance analytics</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  By signing in, you agree to our{' '}
                  <a href="#" className="text-primary hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-primary hover:underline">Privacy Policy</a>
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