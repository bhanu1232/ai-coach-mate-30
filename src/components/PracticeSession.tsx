import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
  MicOff, 
  Send, 
  SkipForward, 
  Timer, 
  MessageSquare,
  VolumeX,
  Volume2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  text: string;
  type: 'technical' | 'behavioral';
  category: string;
}

interface PracticeSessionProps {
  questions: Question[];
  jobDescription: string;
  onAnswerSubmit: (questionId: string, answer: string, isVoice: boolean) => void;
  onSessionComplete: (sessionData: SessionData) => void;
}

interface SessionData {
  totalQuestions: number;
  answeredQuestions: number;
  totalTime: number;
  answers: Array<{
    questionId: string;
    answer: string;
    timeSpent: number;
    isVoice: boolean;
  }>;
}

const PracticeSession = ({ 
  questions, 
  jobDescription, 
  onAnswerSubmit, 
  onSessionComplete 
}: PracticeSessionProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sessionStartTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [answers, setAnswers] = useState<SessionData['answers']>([]);
  const [sessionTime, setSessionTime] = useState(0);
  
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionConstructor();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          if (finalTranscript) {
            setAnswer(prev => prev + finalTranscript + ' ');
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
          setIsListening(false);
          toast({
            title: "Speech Recognition Error",
            description: "Please try again or use text input.",
            variant: "destructive",
          });
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
          setIsListening(false);
        };
      }
    }
  }, [toast]);

  // Session timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSessionTime(Date.now() - sessionStartTime);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [sessionStartTime]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      setIsRecording(true);
      setIsListening(true);
      recognitionRef.current.start();
      
      toast({
        title: "Recording Started",
        description: "Speak your answer clearly. Click the mic again to stop.",
      });
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setIsListening(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      toast({
        title: "Answer Required",
        description: "Please provide an answer before submitting.",
        variant: "destructive",
      });
      return;
    }

    const timeSpent = Date.now() - questionStartTime;
    const newAnswer = {
      questionId: currentQuestion.id,
      answer: answer.trim(),
      timeSpent,
      isVoice: isRecording || isListening
    };

    setAnswers(prev => [...prev, newAnswer]);
    onAnswerSubmit(currentQuestion.id, answer.trim(), isRecording || isListening);

    // Move to next question or complete session
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setAnswer("");
      setQuestionStartTime(Date.now());
      
      toast({
        title: "Answer Submitted",
        description: "Moving to next question...",
      });
    } else {
      // Session complete
      const sessionData: SessionData = {
        totalQuestions: questions.length,
        answeredQuestions: answers.length + 1,
        totalTime: Date.now() - sessionStartTime,
        answers: [...answers, newAnswer]
      };
      
      onSessionComplete(sessionData);
    }
  };

  const handleSkipQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setAnswer("");
      setQuestionStartTime(Date.now());
      
      toast({
        title: "Question Skipped",
        description: "Moving to next question...",
      });
    }
  };

  if (!currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <Card className="p-8 glass">
          <h2 className="text-2xl font-bold mb-4">No Questions Available</h2>
          <p className="text-muted-foreground">Please upload a job description first to generate questions.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Session Header */}
      <Card className="p-6 glass mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Interview Practice Session</h2>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-primary/30">
                Question {currentQuestionIndex + 1} of {questions.length}
              </Badge>
              <Badge 
                variant="outline" 
                className={`${currentQuestion.type === 'technical' ? 'border-accent/30' : 'border-primary/30'}`}
              >
                {currentQuestion.type === 'technical' ? 'Technical' : 'Behavioral'}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Timer className="w-4 h-4" />
              <span className="font-mono">{formatTime(sessionTime)}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
        </div>
      </Card>

      {/* Current Question */}
      <Card className="p-8 glass mb-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 text-primary">
            {currentQuestion.category}
          </h3>
          <p className="text-lg leading-relaxed">
            {currentQuestion.text}
          </p>
        </div>

        {/* Answer Input */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">Your Answer</h4>
            <div className="flex items-center gap-2">
              {isListening && (
                <div className="flex items-center gap-2 text-accent">
                  <Volume2 className="w-4 h-4 animate-pulse" />
                  <span className="text-sm">Listening...</span>
                </div>
              )}
            </div>
          </div>

          <Textarea
            placeholder="Type your answer here, or use the microphone to speak your response..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="min-h-[200px] bg-input/50 border-card-border focus:border-primary resize-none text-base leading-relaxed"
          />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={isRecording ? stopRecording : startRecording}
                className={`${
                  isRecording 
                    ? 'border-destructive text-destructive hover:bg-destructive/10' 
                    : 'border-accent/30 text-accent hover:bg-accent/10'
                } transition-all duration-300`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-5 h-5 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 mr-2" />
                    Voice Answer
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={handleSkipQuestion}
                className="border-muted-foreground/30 text-muted-foreground hover:bg-muted/50"
              >
                <SkipForward className="w-5 h-5 mr-2" />
                Skip Question
              </Button>
            </div>

            <Button
              size="lg"
              onClick={handleSubmitAnswer}
              disabled={!answer.trim()}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 px-8"
            >
              <Send className="w-5 h-5 mr-2" />
              {currentQuestionIndex === questions.length - 1 ? 'Complete Session' : 'Submit & Next'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Tips Card */}
      <Card className="p-6 glass">
        <div className="flex items-start gap-3">
          <MessageSquare className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-semibold mb-2">Interview Tips</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use the STAR method (Situation, Task, Action, Result) for behavioral questions</li>
              <li>• Be specific with examples and quantify your achievements when possible</li>
              <li>• Take your time to think before answering - it's okay to pause</li>
              <li>• Speak clearly if using voice input, or review your text before submitting</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PracticeSession;