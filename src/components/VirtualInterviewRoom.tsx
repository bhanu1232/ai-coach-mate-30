import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Play, 
  Pause, 
  Square, 
  Clock,
  Brain,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Volume2,
  VolumeX
} from 'lucide-react';

interface InterviewQuestion {
  id: string;
  type: 'behavioral' | 'technical' | 'situational';
  question: string;
  hints?: string[];
  followUp?: string;
}

interface VirtualInterviewRoomProps {
  jobTitle: string;
  questions: InterviewQuestion[];
  onComplete: (results: any) => void;
}

const VirtualInterviewRoom = ({ jobTitle, questions, onComplete }: VirtualInterviewRoomProps) => {
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [responses, setResponses] = useState<string[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');
  
  const recordingTimerRef = useRef<NodeJS.Timeout>();
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    if (isRecording && !isPaused) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording, isPaused]);

  useEffect(() => {
    // Simulate AI thinking time before showing question
    if (isStarted && !isPaused) {
      setIsThinking(true);
      const timer = setTimeout(() => {
        setIsThinking(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex, isStarted, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartInterview = () => {
    setIsStarted(true);
    setIsRecording(true);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleNextQuestion = () => {
    setResponses([...responses, currentResponse]);
    setCurrentResponse('');
    setRecordingTime(0);
    setShowHints(false);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleCompleteInterview();
    }
  };

  const handleCompleteInterview = () => {
    setIsRecording(false);
    const results = {
      jobTitle,
      totalQuestions: questions.length,
      responses: [...responses, currentResponse],
      totalTime: recordingTime,
      completed: true
    };
    onComplete(results);
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'behavioral': return 'bg-blue-500';
      case 'technical': return 'bg-green-500';
      case 'situational': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  if (!isStarted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="glass">
          <CardHeader className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
              <Video className="w-10 h-10 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">
              Virtual Interview Room
            </CardTitle>
            <p className="text-muted-foreground">
              Prepare for your <strong>{jobTitle}</strong> interview with AI-powered questions
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Pre-interview Setup */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Interview Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Questions:</span>
                    <span>{questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Time:</span>
                    <span>{questions.length * 3} - {questions.length * 5} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Question Types:</span>
                    <div className="flex gap-1">
                      <Badge className="text-xs bg-blue-500">Behavioral</Badge>
                      <Badge className="text-xs bg-green-500">Technical</Badge>
                      <Badge className="text-xs bg-purple-500">Situational</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Camera & Audio Check</h3>
                <div className="bg-muted/50 rounded-lg p-4 aspect-video flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Video className="w-12 h-12 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">Camera preview will appear here</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant={cameraEnabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCameraEnabled(!cameraEnabled)}
                    className="flex-1"
                  >
                    {cameraEnabled ? <Video className="w-4 h-4 mr-2" /> : <VideoOff className="w-4 h-4 mr-2" />}
                    Camera
                  </Button>
                  <Button
                    variant={micEnabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMicEnabled(!micEnabled)}
                    className="flex-1"
                  >
                    {micEnabled ? <Mic className="w-4 h-4 mr-2" /> : <MicOff className="w-4 h-4 mr-2" />}
                    Mic
                  </Button>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-primary mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Interview Tips</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Speak clearly and maintain eye contact with the camera</li>
                    <li>• Use the STAR method for behavioral questions (Situation, Task, Action, Result)</li>
                    <li>• Take your time to think before answering</li>
                    <li>• Ask for clarification if needed</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button 
              size="lg" 
              onClick={handleStartInterview}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Interview
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
        {/* Video Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isRecording && !isPaused ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
                <span className="text-sm font-medium">
                  {isRecording && !isPaused ? 'Recording' : isPaused ? 'Paused' : 'Stopped'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {formatTime(recordingTime)}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
          </div>

          {/* Progress */}
          <Progress value={progress} className="h-2" />

          {/* Video Interface */}
          <Card className="flex-1 bg-gradient-card">
            <CardContent className="p-6 h-full">
              <div className="grid md:grid-cols-2 gap-6 h-full">
                {/* AI Interviewer */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border-2 border-primary">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        AI
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">AI Interviewer</h3>
                      <p className="text-sm text-muted-foreground">
                        {isThinking ? 'Thinking...' : 'Ready to listen'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-6 aspect-video flex items-center justify-center">
                    {isThinking ? (
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                          <Brain className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground">Preparing next question...</p>
                      </div>
                    ) : (
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                          <Brain className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground">Listening to your response...</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* User Video */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">Your Response</h3>
                      <p className="text-sm text-muted-foreground">
                        {cameraEnabled ? 'Camera on' : 'Camera off'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-6 aspect-video flex items-center justify-center">
                    {cameraEnabled ? (
                      <div className="text-center space-y-2">
                        <Video className="w-16 h-16 text-muted-foreground mx-auto" />
                        <p className="text-sm text-muted-foreground">Your video feed</p>
                      </div>
                    ) : (
                      <div className="text-center space-y-2">
                        <VideoOff className="w-16 h-16 text-muted-foreground mx-auto" />
                        <p className="text-sm text-muted-foreground">Camera disabled</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={micEnabled ? "default" : "destructive"}
              size="lg"
              onClick={() => setMicEnabled(!micEnabled)}
              className="rounded-full w-14 h-14"
            >
              {micEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </Button>
            
            <Button
              variant={cameraEnabled ? "default" : "outline"}
              size="lg"
              onClick={() => setCameraEnabled(!cameraEnabled)}
              className="rounded-full w-14 h-14"
            >
              {cameraEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handlePauseResume}
              className="rounded-full w-14 h-14"
            >
              {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
            </Button>

            <Button
              variant={soundEnabled ? "default" : "outline"}
              size="lg"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="rounded-full w-14 h-14"
            >
              {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </Button>

            <Button
              variant="destructive"
              size="lg"
              onClick={handleCompleteInterview}
              className="rounded-full w-14 h-14"
            >
              <Square className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Question Panel */}
        <Card className="glass">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Current Question</CardTitle>
              <Badge className={`${getQuestionTypeColor(currentQuestion?.type)} text-white`}>
                {currentQuestion?.type}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Question */}
            <div className="space-y-4">
              {isThinking ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              ) : (
                <ScrollArea className="h-32">
                  <p className="text-lg leading-relaxed">{currentQuestion?.question}</p>
                </ScrollArea>
              )}
            </div>

            {/* Hints */}
            {currentQuestion?.hints && (
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHints(!showHints)}
                  className="w-full"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {showHints ? 'Hide Hints' : 'Show Hints'}
                </Button>
                
                {showHints && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                    <ul className="text-sm space-y-1">
                      {currentQuestion.hints.map((hint, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                          <span>{hint}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Live Feedback */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Live Feedback</span>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>✓ Good eye contact</p>
                <p>✓ Clear pronunciation</p>
                <p>⚠ Consider using specific examples</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="space-y-3">
              <Button
                onClick={handleNextQuestion}
                className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                disabled={isThinking}
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Interview'}
              </Button>
              
              {currentQuestionIndex > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                  className="w-full"
                  disabled={isThinking}
                >
                  Previous Question
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VirtualInterviewRoom;