interface QuestionGenerationResponse {
  questions: Array<{
    id: string;
    text: string;
    type: 'technical' | 'behavioral';
    category: string;
  }>;
}

interface FeedbackResponse {
  clarity: number;
  tone: 'confident' | 'weak' | 'neutral';
  keywords_missed: string[];
  suggestions: string[];
  overall_score: number;
  strengths: string[];
  areas_for_improvement: string[];
}

const GEMINI_API_KEY = 'AIzaSyBwHG1OPwiL4hG6J_zs5SPXpldiOvPCr-E';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

class GeminiService {
  private async makeAPICall(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API request failed: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from Gemini API');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to communicate with AI service');
    }
  }

  async generateQuestions(jobDescription: string): Promise<QuestionGenerationResponse> {
    const prompt = `
As an expert interview coach, analyze this job description and generate 8 tailored interview questions.

Job Description:
${jobDescription}

Generate exactly 8 questions:
- 4 technical questions related to the specific skills, technologies, and requirements mentioned
- 4 behavioral questions that assess soft skills and cultural fit for this role

For each question, provide:
1. The question text
2. Type (technical or behavioral)  
3. Category (the specific skill/area being assessed)

Respond ONLY with valid JSON in this exact format:
{
  "questions": [
    {
      "id": "unique-id-1",
      "text": "Question text here",
      "type": "technical",
      "category": "Programming Languages"
    }
  ]
}

Make questions challenging but fair, relevant to the job requirements, and designed to reveal the candidate's true capabilities and experience level.
`;

    try {
      const response = await this.makeAPICall(prompt);
      
      // Clean the response to extract JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const parsedResponse = JSON.parse(jsonMatch[0]) as QuestionGenerationResponse;
      
      // Validate the response structure
      if (!parsedResponse.questions || !Array.isArray(parsedResponse.questions)) {
        throw new Error('Invalid response structure: missing questions array');
      }

      // Add unique IDs if missing and validate structure
      parsedResponse.questions = parsedResponse.questions.map((q, index) => ({
        id: q.id || `question-${Date.now()}-${index}`,
        text: q.text || '',
        type: q.type === 'technical' || q.type === 'behavioral' ? q.type : 'behavioral',
        category: q.category || 'General'
      }));

      return parsedResponse;
    } catch (error) {
      console.error('Error generating questions:', error);
      
      // Fallback questions if API fails
      return {
        questions: [
          {
            id: 'fallback-1',
            text: 'Tell me about your experience with the technologies mentioned in this job description.',
            type: 'technical',
            category: 'Technical Experience'
          },
          {
            id: 'fallback-2',
            text: 'Describe a challenging project you worked on and how you overcame obstacles.',
            type: 'behavioral',
            category: 'Problem Solving'
          },
          {
            id: 'fallback-3',
            text: 'How do you stay current with industry trends and technologies?',
            type: 'technical',
            category: 'Continuous Learning'
          },
          {
            id: 'fallback-4',
            text: 'Give an example of a time when you had to work with a difficult team member.',
            type: 'behavioral',
            category: 'Teamwork'
          }
        ]
      };
    }
  }

  async getFeedback(jobDescription: string, question: string, answer: string): Promise<FeedbackResponse> {
    const prompt = `
As an expert interview coach, evaluate this candidate's answer to an interview question.

Job Description Context:
${jobDescription}

Interview Question:
${question}

Candidate Answer:
${answer}

Provide comprehensive feedback evaluating:

1. CLARITY (1-10): How well-structured and understandable is the answer?
2. TONE: Does the candidate sound confident, weak, or neutral?
3. KEYWORDS MISSED: Important terms from the job description not mentioned in the answer
4. SPECIFIC SUGGESTIONS: Actionable advice to improve the answer
5. OVERALL SCORE (1-100): Holistic assessment of the answer quality
6. STRENGTHS: What the candidate did well
7. AREAS FOR IMPROVEMENT: Specific areas that need work

Respond ONLY with valid JSON in this exact format:
{
  "clarity": 8,
  "tone": "confident",
  "keywords_missed": ["specific keyword1", "specific keyword2"],
  "suggestions": ["Specific suggestion 1", "Specific suggestion 2"],
  "overall_score": 75,
  "strengths": ["Strength 1", "Strength 2"],
  "areas_for_improvement": ["Area 1", "Area 2"]
}

Be constructive, specific, and helpful in your feedback. Focus on actionable improvements.
`;

    try {
      const response = await this.makeAPICall(prompt);
      
      // Clean the response to extract JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in feedback response');
      }

      const parsedResponse = JSON.parse(jsonMatch[0]) as FeedbackResponse;
      
      // Validate and set defaults
      return {
        clarity: Math.max(1, Math.min(10, parsedResponse.clarity || 5)),
        tone: ['confident', 'weak', 'neutral'].includes(parsedResponse.tone) ? parsedResponse.tone : 'neutral',
        keywords_missed: Array.isArray(parsedResponse.keywords_missed) ? parsedResponse.keywords_missed : [],
        suggestions: Array.isArray(parsedResponse.suggestions) ? parsedResponse.suggestions : ['Consider providing more specific examples'],
        overall_score: Math.max(1, Math.min(100, parsedResponse.overall_score || 50)),
        strengths: Array.isArray(parsedResponse.strengths) ? parsedResponse.strengths : ['Provided a complete answer'],
        areas_for_improvement: Array.isArray(parsedResponse.areas_for_improvement) ? parsedResponse.areas_for_improvement : ['Add more specific details']
      };
    } catch (error) {
      console.error('Error getting feedback:', error);
      
      // Fallback feedback
      return {
        clarity: 6,
        tone: 'neutral',
        keywords_missed: ['Unable to analyze - please try again'],
        suggestions: ['Try to be more specific with examples', 'Structure your answer with clear beginning, middle, and end'],
        overall_score: 60,
        strengths: ['Provided a response to the question'],
        areas_for_improvement: ['Add more specific examples', 'Consider using the STAR method for behavioral questions']
      };
    }
  }

  async generateSessionReport(
    jobDescription: string, 
    questionsAndAnswers: Array<{question: string, answer: string, feedback: FeedbackResponse}>
  ): Promise<{
    overall_performance: number;
    key_strengths: string[];
    priority_improvements: string[];
    recommendations: string[];
    interview_readiness: 'Excellent' | 'Good' | 'Needs Improvement' | 'Not Ready';
  }> {
    const prompt = `
As an expert interview coach, analyze this complete interview practice session and provide a comprehensive report.

Job Description:
${jobDescription}

Interview Session Data:
${questionsAndAnswers.map((qa, i) => `
Question ${i + 1}: ${qa.question}
Answer: ${qa.answer}
Individual Score: ${qa.feedback.overall_score}/100
`).join('\n')}

Provide a comprehensive session analysis:

1. OVERALL PERFORMANCE (1-100): Average performance across all questions
2. KEY STRENGTHS: Top 3-4 strengths demonstrated across answers
3. PRIORITY IMPROVEMENTS: Most important areas to focus on next
4. RECOMMENDATIONS: Specific actionable advice for interview preparation
5. INTERVIEW READINESS: Overall assessment (Excellent/Good/Needs Improvement/Not Ready)

Respond ONLY with valid JSON in this exact format:
{
  "overall_performance": 75,
  "key_strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "priority_improvements": ["Improvement 1", "Improvement 2", "Improvement 3"],
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "interview_readiness": "Good"
}

Be encouraging yet realistic in your assessment.
`;

    try {
      const response = await this.makeAPICall(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in session report response');
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);
      
      return {
        overall_performance: Math.max(1, Math.min(100, parsedResponse.overall_performance || 50)),
        key_strengths: Array.isArray(parsedResponse.key_strengths) ? parsedResponse.key_strengths : ['Completed the session'],
        priority_improvements: Array.isArray(parsedResponse.priority_improvements) ? parsedResponse.priority_improvements : ['Practice more regularly'],
        recommendations: Array.isArray(parsedResponse.recommendations) ? parsedResponse.recommendations : ['Continue practicing with various questions'],
        interview_readiness: ['Excellent', 'Good', 'Needs Improvement', 'Not Ready'].includes(parsedResponse.interview_readiness) 
          ? parsedResponse.interview_readiness 
          : 'Needs Improvement'
      };
    } catch (error) {
      console.error('Error generating session report:', error);
      
      // Calculate fallback metrics
      const avgScore = questionsAndAnswers.reduce((sum, qa) => sum + qa.feedback.overall_score, 0) / questionsAndAnswers.length;
      
      return {
        overall_performance: Math.round(avgScore),
        key_strengths: ['Completed all questions', 'Showed engagement with the process'],
        priority_improvements: ['Provide more specific examples', 'Improve answer structure'],
        recommendations: ['Practice the STAR method', 'Research the company more thoroughly', 'Prepare specific examples beforehand'],
        interview_readiness: avgScore >= 80 ? 'Good' : avgScore >= 60 ? 'Needs Improvement' : 'Not Ready'
      };
    }
  }
}

export const geminiService = new GeminiService();
export type { QuestionGenerationResponse, FeedbackResponse };