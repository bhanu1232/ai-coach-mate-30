import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useJobSessions } from '@/hooks/useJobSessions';
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
import { Plus, Sparkles, Target, TrendingUp } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const { jobs, createJob, getUserProgress } = useJobSessions();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 rounded-2xl p-8 border">
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {getGreeting()}, {user?.displayName?.split(' ')[0] || 'there'}!
              </h1>
              <p className="text-lg text-muted-foreground">
                Ready to ace your next interview? Let's practice together.
              </p>
            </div>

            {/* Quick Stats */}
            {userProgress.totalSessions > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg border">
                  <Target className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{userProgress.totalSessions}</p>
                    <p className="text-sm text-muted-foreground">Total Sessions</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg border">
                  <TrendingUp className="h-8 w-8 text-accent" />
                  <div>
                    <p className="text-2xl font-bold">{userProgress.averageScore}%</p>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg border">
                  <Sparkles className="h-8 w-8 text-secondary" />
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
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Job Position</DialogTitle>
                  <DialogDescription>
                    Create a new job preparation session. We'll generate personalized interview questions based on the job description.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g. Senior Software Engineer"
                        value={newJob.title}
                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company *</Label>
                      <Input
                        id="company"
                        placeholder="e.g. Google, Microsoft"
                        value={newJob.company}
                        onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Job Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Paste the complete job description here. Include responsibilities, requirements, and any specific skills mentioned."
                      className="min-h-[200px]"
                      value={newJob.description}
                      onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      The more detailed the job description, the better we can tailor the interview questions.
                    </p>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateJob} disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Job"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {jobs.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 rounded-full bg-primary/10 mb-4">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mb-2">No Job Preparations Yet</CardTitle>
                <CardDescription className="mb-6 max-w-md">
                  Get started by adding your first job description. We'll create personalized interview questions to help you prepare.
                </CardDescription>
                <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Your First Job
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