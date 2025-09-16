import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Sparkles, Users, Zap, Loader2, CheckCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-background flex">
      {/* Back to Home Button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 gap-2 text-muted-foreground hover:text-foreground z-10"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Button>

      <div className="w-full grid lg:grid-cols-2">
        {/* Left side - Welcome Form */}
        <div className="flex items-center justify-center p-8 lg:p-12">
          <Card className="w-full max-w-md bg-card/95 backdrop-blur-sm border-2 shadow-2xl">
            <CardHeader className="space-y-6 pb-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
                  <Brain className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">Welcome!</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Sign in to start your AI-powered interview preparation
                  </CardDescription>
                </div>
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
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>AI-powered personalized coaching</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>Industry-specific questions</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>Real-time feedback & analytics</span>
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

        {/* Right side - Stats & Visualization */}
        <div className="hidden lg:flex items-center justify-center p-8 lg:p-12 bg-gradient-to-br from-primary/10 via-background to-accent/10 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-primary/20 rounded-full"></div>
            <div className="absolute top-1/3 right-1/3 w-24 h-24 border border-accent/20 rounded-full"></div>
            <div className="absolute bottom-1/4 left-1/3 w-16 h-16 border border-success/20 rounded-full"></div>
          </div>

          <div className="relative z-10 max-w-lg space-y-12">
            {/* Stats Section */}
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  400K+ users, 50M+ AI
                </h2>
                <p className="text-xl text-muted-foreground font-medium">
                  generated matches
                </p>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20">
                  <Sparkles className="w-4 h-4" />
                  Trusted by professionals worldwide
                </div>
              </div>

              {/* 3D Cube Visualization */}
              <div className="flex justify-center">
                <div className="relative w-40 h-40">
                  {/* Cube faces */}
                  <div className="absolute inset-0 transform rotate-12">
                    <div className="w-full h-full bg-gradient-to-br from-primary/40 to-primary/20 rounded-lg border border-primary/30 backdrop-blur-sm"></div>
                  </div>
                  <div className="absolute inset-0 transform -rotate-12 translate-x-4 translate-y-4">
                    <div className="w-full h-full bg-gradient-to-br from-accent/40 to-accent/20 rounded-lg border border-accent/30 backdrop-blur-sm"></div>
                  </div>
                  <div className="absolute inset-0 transform rotate-45 translate-x-2 translate-y-2">
                    <div className="w-full h-full bg-gradient-to-br from-success/40 to-success/20 rounded-lg border border-success/30 backdrop-blur-sm"></div>
                  </div>
                  
                  {/* Center highlight */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-primary rounded-full shadow-glow"></div>
                </div>
              </div>

              {/* Feature highlights */}
              <div className="grid gap-6">
                <div className="flex items-center gap-4 p-4 bg-card/30 backdrop-blur-sm rounded-xl border border-card-border/50">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Smart AI Analysis</h3>
                    <p className="text-sm text-muted-foreground">Advanced algorithms analyze your performance</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-card/30 backdrop-blur-sm rounded-xl border border-card-border/50">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Global Community</h3>
                    <p className="text-sm text-muted-foreground">Join thousands of successful candidates</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-card/30 backdrop-blur-sm rounded-xl border border-card-border/50">
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Instant Results</h3>
                    <p className="text-sm text-muted-foreground">Get detailed feedback in real-time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;