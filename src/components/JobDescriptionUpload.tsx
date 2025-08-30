import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Loader2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JobDescriptionUploadProps {
  onJobDescriptionSubmit: (jobDescription: string) => void;
  isLoading?: boolean;
}

const JobDescriptionUpload = ({ onJobDescriptionSubmit, isLoading }: JobDescriptionUploadProps) => {
  const [jobDescription, setJobDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job Description Required",
        description: "Please paste or type a job description to continue.",
        variant: "destructive",
      });
      return;
    }

    if (jobDescription.trim().length < 50) {
      toast({
        title: "Job Description Too Short",
        description: "Please provide a more detailed job description (at least 50 characters).",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      onJobDescriptionSubmit(jobDescription);
      
      toast({
        title: "Job Description Processed",
        description: "AI is now generating tailored interview questions for you!",
      });
    } catch (error) {
      toast({
        title: "Error Processing Job Description",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setJobDescription(content);
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please upload a plain text file (.txt)",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Upload Job Description</h2>
        <p className="text-muted-foreground text-lg">
          Paste or upload the job description to get personalized interview questions
        </p>
      </div>

      <Card className="p-8 glass">
        <div className="space-y-6">
          {/* File Upload Section */}
          <div className="border-2 border-dashed border-card-border rounded-2xl p-8 text-center hover:border-primary/50 transition-colors">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Upload Job Description File</h3>
                <p className="text-muted-foreground mb-4">
                  Drop a .txt file here or click to browse
                </p>
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>
                      <FileText className="w-4 h-4 mr-2" />
                      Choose File
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          </div>

          {/* Text Input Section */}
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">OR</span>
              </div>
              <h3 className="text-lg font-semibold">Paste Job Description</h3>
            </div>
            
            <Textarea
              placeholder="Paste the complete job description here. Include responsibilities, requirements, qualifications, and any other relevant details..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[300px] bg-input/50 border-card-border focus:border-primary resize-none text-base leading-relaxed"
            />
            
            <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
              <span>{jobDescription.length} characters</span>
              <span>Minimum 50 characters required</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={isProcessing || isLoading || jobDescription.trim().length < 50}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 px-8 py-6 text-lg rounded-2xl min-w-[200px]"
            >
              {isProcessing || isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Questions...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Generate Interview Questions
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default JobDescriptionUpload;