import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useJobSessions } from '@/hooks/useJobSessions';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import MainLayout from '@/components/layout/MainLayout';
import JobCard from '@/components/JobCard';
import ProgressTracker from '@/components/ProgressTracker';
import { Plus, Sparkles, Target, TrendingUp, Brain, Mic, Code, Award } from 'lucide-react';

const Home = () => {
  const { user, loading } = useAuth();
  const { jobs, createJob, getUserProgress } = useJobSessions();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userProgress = getUserProgress();

  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    description: '',
    requirements: [] as string[]
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleCreateJob = async () => {
    if (!newJob.title.trim() || !newJob.company.trim() || !newJob.description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const requirements = newJob.description
        .split(/[.!?]/)
        .filter(sentence => sentence.trim().length > 10)
        .slice(0, 10);

      await createJob({
        ...newJob,
        requirements
      });

      toast({
        title: "Job Created Successfully!",
        description: "You can now start practicing interview questions for this position.",
      });

      setNewJob({ title: '', company: '', description: '', requirements: [] });
      setIsCreateDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error Creating Job",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-card rounded-2xl p-8 border border-primary/20 shadow-card">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                {getGreeting()}, {user?.displayName?.split(' ')[0] || 'there'}!
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Welcome to your AI-powered interview preparation dashboard. Track your progress and master your next interview.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center space-y-2 p-4 bg-background/50 rounded-xl border border-primary/10">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">AI Questions</h3>
                <p className="text-sm text-muted-foreground">Personalized for each job</p>
              </div>
              
              <div className="text-center space-y-2 p-4 bg-background/50 rounded-xl border border-accent/10">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <Mic className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold">Mock Interviews</h3>
                <p className="text-sm text-muted-foreground">Realistic practice sessions</p>
              </div>
              
              <div className="text-center space-y-2 p-4 bg-background/50 rounded-xl border border-success/10">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                  <Code className="w-6 h-6 text-success" />
                </div>
                <h3 className="font-semibold">Coding Practice</h3>
                <p className="text-sm text-muted-foreground">Built-in IDE with tests</p>
              </div>
              
              <div className="text-center space-y-2 p-4 bg-background/50 rounded-xl border border-warning/10">
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto">
                  <Award className="w-6 h-6 text-warning" />
                </div>
                <h3 className="font-semibold">Progress Tracking</h3>
                <p className="text-sm text-muted-foreground">Detailed analytics</p>
              </div>
            </div>

            {/* Quick Stats */}
            {userProgress.totalSessions > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg border border-primary/10">
                  <Target className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{userProgress.totalSessions}</p>
                    <p className="text-sm text-muted-foreground">Total Sessions</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg border border-accent/10">
                  <TrendingUp className="h-8 w-8 text-accent" />
                  <div>
                    <p className="text-2xl font-bold">{userProgress.averageScore}%</p>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg border border-success/10">
                  <Sparkles className="h-8 w-8 text-success" />
                  <div>
                    <p className="text-2xl font-bold">{userProgress.completedSessions}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress Tracker */}
        {userProgress.totalSessions > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Progress</h2>
            <ProgressTracker progress={userProgress} />
          </div>
        )}

        {/* Jobs Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Interview Preparations</h2>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Job
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
                    <Plus className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <DialogTitle className="text-2xl">Add New Job Position</DialogTitle>
                  <DialogDescription className="text-base">
                    Create a new job preparation session. Our AI will analyze the job description and generate personalized interview questions, coding challenges, and practice scenarios.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="title" className="text-base font-semibold">Job Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g. Senior Software Engineer"
                        value={newJob.title}
                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                        className="h-12 text-base"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="company" className="text-base font-semibold">Company *</Label>
                      <Input
                        id="company"
                        placeholder="e.g. Google, Microsoft"
                        value={newJob.company}
                        onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                        className="h-12 text-base"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-base font-semibold">Job Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Paste the complete job description here. Include responsibilities, requirements, qualifications, and any specific skills or technologies mentioned. The more detailed the description, the better our AI can tailor the interview experience."
                      className="min-h-[240px] text-base leading-relaxed resize-none"
                      value={newJob.description}
                      onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    />
                    <div className="flex items-center justify-between text-sm">
                      <p className="text-muted-foreground">
                        💡 Pro tip: Include tech stack, experience level, and key responsibilities for best results
                      </p>
                      <span className="text-muted-foreground">
                        {newJob.description.length} characters
                      </span>
                    </div>
                  </div>
                  
                  {newJob.description.length > 100 && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <h4 className="font-semibold text-primary mb-2">✨ What you'll get:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Personalized behavioral interview questions</li>
                        <li>• Technical questions based on job requirements</li>
                        <li>• Coding challenges in relevant languages</li>
                        <li>• Mock interview practice with AI feedback</li>
                        <li>• Performance analytics and improvement suggestions</li>
                      </ul>
                    </div>
                  )}
                </div>

                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="px-6">
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateJob} 
                    disabled={isLoading || !newJob.title.trim() || !newJob.company.trim() || !newJob.description.trim()}
                    className="bg-gradient-primary hover:shadow-glow transition-all duration-300 px-8"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                        Generating Questions...
                      </div>
                    ) : (
                      "🚀 Create Job Preparation"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {jobs.length === 0 ? (
            <Card className="border-dashed border-2 border-primary/20 bg-gradient-card">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6 shadow-glow">
                  <Plus className="h-10 w-10 text-primary-foreground" />
                </div>
                <CardTitle className="mb-4 text-2xl">Ready to Start Your Interview Journey?</CardTitle>
                <CardDescription className="mb-8 max-w-lg text-lg leading-relaxed">
                  Add your first job description and let our AI create personalized interview questions tailored specifically for that role.
                </CardDescription>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)} 
                  className="gap-2 bg-gradient-primary hover:shadow-glow transition-all duration-300 px-8 py-6 text-lg rounded-2xl"
                >
                  <Plus className="h-5 h-5" />
                  Create Your First Job Preparation
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;