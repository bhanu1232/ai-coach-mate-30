import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  User,
  Settings,
  Bell,
  Mic,
  Video,
  Volume2,
  Brain,
  Trophy,
  CreditCard,
  Shield,
  Download,
  Upload,
  Trash2,
  Edit,
  Save,
  X
} from 'lucide-react';

const SettingsProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState({
    // Profile
    displayName: user?.displayName || '',
    email: user?.email || '',
    bio: '',
    jobTitle: '',
    company: '',
    location: '',
    
    // AI Preferences
    aiVoice: 'sarah',
    aiPersonality: 'professional',
    interviewStyle: 'standard',
    difficultyLevel: 'medium',
    
    // Skills
    skills: ['JavaScript', 'React', 'Node.js', 'Python'],
    
    // Notifications
    emailNotifications: true,
    practiceReminders: true,
    progressUpdates: true,
    weeklyReports: true,
    
    // Audio/Video
    microphoneEnabled: true,
    cameraEnabled: true,
    soundEnabled: true,
    autoRecord: true,
    
    // Privacy
    shareProgress: false,
    publicProfile: false,
    dataCollection: true
  });

  const aiVoices = [
    { value: 'sarah', label: 'Sarah (Female, American)' },
    { value: 'david', label: 'David (Male, British)' },
    { value: 'anna', label: 'Anna (Female, Australian)' },
    { value: 'michael', label: 'Michael (Male, Canadian)' }
  ];

  const aiPersonalities = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'challenging', label: 'Challenging' },
    { value: 'supportive', label: 'Supportive' }
  ];

  const interviewStyles = [
    { value: 'standard', label: 'Standard Interview' },
    { value: 'behavioral', label: 'Behavioral Focus' },
    { value: 'technical', label: 'Technical Focus' },
    { value: 'case-study', label: 'Case Study Based' }
  ];

  const difficultyLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'medium', label: 'Medium' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];

  const handleSave = () => {
    // Save settings logic here
    toast({
      title: 'Settings Saved',
      description: 'Your preferences have been updated successfully.',
    });
    setIsEditing(false);
  };

  const handleSkillAdd = (skill: string) => {
    if (skill && !settings.skills.includes(skill)) {
      setSettings(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setSettings(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings & Profile</h1>
          <p className="text-muted-foreground">Manage your account and interview preferences</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={() => setIsEditing(false)} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-gradient-primary hover:shadow-glow">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="ai-preferences">
            <Brain className="w-4 h-4 mr-2" />
            AI Settings
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="audio-video">
            <Video className="w-4 h-4 mr-2" />
            Audio/Video
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Shield className="w-4 h-4 mr-2" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="subscription">
            <CreditCard className="w-4 h-4 mr-2" />
            Subscription
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Profile Header */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and professional details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20 border-4 border-primary/20">
                  <AvatarImage src={user?.photoURL || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                    {user?.displayName?.charAt(0) || user?.email?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={settings.displayName}
                    onChange={(e) => setSettings(prev => ({ ...prev, displayName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    placeholder="e.g. Software Engineer"
                    value={settings.jobTitle}
                    onChange={(e) => setSettings(prev => ({ ...prev, jobTitle: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="e.g. Google"
                    value={settings.company}
                    onChange={(e) => setSettings(prev => ({ ...prev, company: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g. San Francisco, CA"
                    value={settings.location}
                    onChange={(e) => setSettings(prev => ({ ...prev, location: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <div>
                  <Label>Skills</Label>
                  <p className="text-sm text-muted-foreground">Add your technical skills and expertise</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {settings.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="gap-2">
                      {skill}
                      {isEditing && (
                        <button onClick={() => handleSkillRemove(skill)}>
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSkillAdd(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button variant="outline" size="sm">Add</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Interviewer Preferences</CardTitle>
              <CardDescription>Customize your AI interviewer experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>AI Voice</Label>
                  <Select
                    value={settings.aiVoice}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, aiVoice: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {aiVoices.map(voice => (
                        <SelectItem key={voice.value} value={voice.value}>
                          {voice.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>AI Personality</Label>
                  <Select
                    value={settings.aiPersonality}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, aiPersonality: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {aiPersonalities.map(personality => (
                        <SelectItem key={personality.value} value={personality.value}>
                          {personality.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Interview Style</Label>
                  <Select
                    value={settings.interviewStyle}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, interviewStyle: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {interviewStyles.map(style => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Difficulty Level</Label>
                  <Select
                    value={settings.difficultyLevel}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, difficultyLevel: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficultyLevels.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you'd like to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Practice Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get reminded to practice regularly</p>
                  </div>
                  <Switch
                    checked={settings.practiceReminders}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, practiceReminders: checked }))}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Progress Updates</Label>
                    <p className="text-sm text-muted-foreground">Updates on your interview progress</p>
                  </div>
                  <Switch
                    checked={settings.progressUpdates}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, progressUpdates: checked }))}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Weekly summary of your activities</p>
                  </div>
                  <Switch
                    checked={settings.weeklyReports}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, weeklyReports: checked }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audio-video" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audio & Video Settings</CardTitle>
              <CardDescription>Configure your multimedia preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mic className="w-5 h-5 text-primary" />
                    <div>
                      <Label>Microphone</Label>
                      <p className="text-sm text-muted-foreground">Enable microphone for voice responses</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.microphoneEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, microphoneEnabled: checked }))}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Video className="w-5 h-5 text-accent" />
                    <div>
                      <Label>Camera</Label>
                      <p className="text-sm text-muted-foreground">Enable camera for video practice</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.cameraEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, cameraEnabled: checked }))}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-success" />
                    <div>
                      <Label>Sound</Label>
                      <p className="text-sm text-muted-foreground">Enable audio feedback and notifications</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, soundEnabled: checked }))}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Record</Label>
                    <p className="text-sm text-muted-foreground">Automatically start recording during practice</p>
                  </div>
                  <Switch
                    checked={settings.autoRecord}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoRecord: checked }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control your data and privacy preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Share Progress</Label>
                    <p className="text-sm text-muted-foreground">Allow others to see your progress</p>
                  </div>
                  <Switch
                    checked={settings.shareProgress}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, shareProgress: checked }))}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Public Profile</Label>
                    <p className="text-sm text-muted-foreground">Make your profile visible to others</p>
                  </div>
                  <Switch
                    checked={settings.publicProfile}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, publicProfile: checked }))}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Data Collection</Label>
                    <p className="text-sm text-muted-foreground">Allow anonymous data collection for improvements</p>
                  </div>
                  <Switch
                    checked={settings.dataCollection}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, dataCollection: checked }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Data Management</h3>
                <div className="flex gap-4">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription & Billing</CardTitle>
              <CardDescription>Manage your subscription and payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-gradient-primary rounded-lg text-primary-foreground">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">Pro Plan</h3>
                    <p className="opacity-90">Unlimited interviews and advanced features</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">$19.99</div>
                    <div className="opacity-90">per month</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Plan Features</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-primary" />
                    <span className="text-sm">Unlimited AI interviews</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary" />
                    <span className="text-sm">Advanced AI feedback</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-primary" />
                    <span className="text-sm">Video recording & analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-primary" />
                    <span className="text-sm">Export interview reports</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex gap-4">
                <Button variant="outline">
                  Manage Billing
                </Button>
                <Button variant="outline" className="text-destructive">
                  Cancel Subscription
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsProfile;