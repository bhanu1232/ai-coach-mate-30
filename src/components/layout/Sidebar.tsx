import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useJobSessions } from '@/hooks/useJobSessions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Plus,
  Briefcase,
  TrendingUp,
  Clock,
  LogOut,
  Settings,
  ChevronRight,
  Play,
  CheckCircle,
  PauseCircle
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { jobs, sessions } = useJobSessions();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getSessionStatus = (jobId: string) => {
    const jobSessions = sessions.filter(s => s.jobId === jobId);
    const activeSession = jobSessions.find(s => s.status === 'in_progress');
    const completedSessions = jobSessions.filter(s => s.status === 'completed');
    
    return {
      hasActive: !!activeSession,
      activeSession,
      completedCount: completedSessions.length,
      totalSessions: jobSessions.length
    };
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const isJobPath = (jobId: string) => {
    return location.pathname === `/job/${jobId}`;
  };

  return (
    <div className={`bg-card border-r transition-all duration-300 ${collapsed ? 'w-16' : 'w-80'} flex flex-col h-screen flex-shrink-0`}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          {!collapsed && (
            <>
              <Avatar className="h-10 w-10 border-2 border-primary/20">
                <AvatarImage src={user?.photoURL || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-sm truncate">
                  {user?.displayName || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="shrink-0"
          >
            <ChevronRight className={`h-4 w-4 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {/* Main Navigation */}
          <div className="space-y-1">
            <Button
              variant={isActivePath('/dashboard') ? 'default' : 'ghost'}
              className={`w-full justify-start ${collapsed ? 'px-2' : ''}`}
              onClick={() => navigate('/dashboard')}
            >
              <Home className="h-4 w-4" />
              {!collapsed && <span className="ml-2">Dashboard</span>}
            </Button>

            <Button
              variant="ghost"
              className={`w-full justify-start ${collapsed ? 'px-2' : ''}`}
              onClick={() => navigate('/dashboard')}
            >
              <Plus className="h-4 w-4" />
              {!collapsed && <span className="ml-2">New Job</span>}
            </Button>

            <Button
              variant={isActivePath('/analytics') ? 'default' : 'ghost'}
              className={`w-full justify-start ${collapsed ? 'px-2' : ''}`}
              onClick={() => navigate('/analytics')}
            >
              <TrendingUp className="h-4 w-4" />
              {!collapsed && <span className="ml-2">Analytics</span>}
            </Button>
          </div>

          {/* Jobs Section */}
          {!collapsed && (
            <>
              <div className="pt-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Your Jobs
                </h3>
                
                {jobs.length === 0 ? (
                  <Card className="bg-muted/50">
                    <CardContent className="p-4 text-center">
                      <Briefcase className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        No jobs yet. Create your first job to start practicing!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-2">
                    {jobs.map((job) => {
                      const status = getSessionStatus(job.id);
                      return (
                        <Card
                          key={job.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            isJobPath(job.id) ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => navigate(`/job/${job.id}`)}
                        >
                          <CardContent className="p-3">
                            <div className="space-y-2">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1 flex-1">
                                  <h4 className="font-semibold text-sm truncate">
                                    {job.title}
                                  </h4>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {job.company}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 ml-2">
                                  {status.hasActive ? (
                                    <PauseCircle className="h-4 w-4 text-orange-500" />
                                  ) : status.completedCount > 0 ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <Play className="h-4 w-4 text-blue-500" />
                                  )}
                                </div>
                              </div>

                              {status.hasActive && status.activeSession && (
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-medium">
                                      {Math.round(status.activeSession.progress)}%
                                    </span>
                                  </div>
                                  <Progress 
                                    value={status.activeSession.progress} 
                                    className="h-1"
                                  />
                                </div>
                              )}

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {status.hasActive && (
                                    <Badge variant="secondary" className="text-xs">
                                      In Progress
                                    </Badge>
                                  )}
                                  {status.completedCount > 0 && (
                                    <Badge variant="outline" className="text-xs">
                                      {status.completedCount} completed
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {new Date(job.updatedAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t space-y-2">
        <Button
          variant="ghost"
          className={`w-full justify-start ${collapsed ? 'px-2' : ''}`}
          onClick={() => navigate('/settings')}
        >
          <Settings className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Settings</span>}
        </Button>
        
        <Button
          variant="ghost"
          className={`w-full justify-start text-destructive hover:text-destructive ${collapsed ? 'px-2' : ''}`}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Sign Out</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;