interface RunData {
  duration: number;
  distance: number;
  averageSpeed: number;
  maxSpeed: number;
  route: Array<{lat: number, lng: number, timestamp: number}>;
  averagePace: string;
  calories: number;
  date: string;
}

interface AIFeedback {
  summary: string;
  performance: string;
  suggestions: string[];
  motivation: string;
}

class AIService {
  private geminiApiKey: string = '';
  private vapiApiKey: string = '';

  setApiKeys(geminiKey: string, vapiKey: string) {
    this.geminiApiKey = geminiKey;
    this.vapiApiKey = vapiKey;
  }

  async analyzeRun(runData: RunData): Promise<AIFeedback> {
    try {
      const prompt = this.createAnalysisPrompt(runData);
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Gemini API request failed');
      }

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;
      
      return this.parseAIResponse(aiResponse);
    } catch (error) {
      console.error('AI Analysis Error:', error);
      return this.getFallbackFeedback(runData);
    }
  }

  private createAnalysisPrompt(runData: RunData): string {
    return `
Analyze this running session and provide personalized feedback:

Run Statistics:
- Duration: ${Math.floor(runData.duration / 60)}:${(runData.duration % 60).toString().padStart(2, '0')}
- Distance: ${runData.distance.toFixed(2)} km
- Average Speed: ${runData.averageSpeed.toFixed(1)} km/h
- Max Speed: ${runData.maxSpeed.toFixed(1)} km/h
- Average Pace: ${runData.averagePace} per km
- Estimated Calories: ${runData.calories}
- Route Points: ${runData.route.length}

Please provide:
1. A brief summary of the performance
2. Performance analysis (pace consistency, speed variations)
3. 3 specific suggestions for improvement
4. Motivational message

Format as JSON:
{
  "summary": "Brief performance summary",
  "performance": "Detailed performance analysis",
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "motivation": "Encouraging message"
}
`;
  }

  private parseAIResponse(response: string): AIFeedback {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error);
    }

    // Fallback parsing
    return {
      summary: "Great run completed!",
      performance: "You maintained a steady pace throughout your run.",
      suggestions: [
        "Try interval training to improve speed",
        "Focus on consistent pacing",
        "Consider longer runs to build endurance"
      ],
      motivation: "Keep up the excellent work! Every run makes you stronger."
    };
  }

  private getFallbackFeedback(runData: RunData): AIFeedback {
    const pace = runData.distance > 0 ? (runData.duration / 60) / runData.distance : 0;
    
    return {
      summary: `Completed ${runData.distance.toFixed(1)}km in ${Math.floor(runData.duration / 60)}:${(runData.duration % 60).toString().padStart(2, '0')}`,
      performance: pace < 6 ? "Excellent pace! You're running strong." : "Good steady pace, perfect for building endurance.",
      suggestions: [
        runData.averageSpeed < 8 ? "Try adding some speed intervals" : "Great speed! Focus on maintaining consistency",
        "Consider tracking your heart rate zones",
        "Plan recovery runs between intense sessions"
      ],
      motivation: "Every step forward is progress. You're building strength and endurance!"
    };
  }

  async speakFeedback(feedback: AIFeedback): Promise<void> {
    if (!this.vapiApiKey) {
      // Fallback to browser speech synthesis
      this.speakWithBrowserAPI(feedback.motivation);
      return;
    }

    try {
      const response = await fetch('https://api.vapi.ai/call', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.vapiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assistant: {
            model: {
              provider: 'openai',
              model: 'gpt-3.5-turbo',
              messages: [{
                role: 'system',
                content: 'You are an encouraging running coach. Speak in a motivating, energetic tone.'
              }]
            },
            voice: {
              provider: 'elevenlabs',
              voiceId: 'pNInz6obpgDQGcFmaJgB' // Adam voice
            }
          },
          phoneNumberId: null,
          customer: {
            number: null
          },
          message: `${feedback.summary} ${feedback.motivation}`
        })
      });

      if (!response.ok) {
        throw new Error('VAPI request failed');
      }

      console.log('VAPI call initiated successfully');
    } catch (error) {
      console.error('VAPI Error:', error);
      this.speakWithBrowserAPI(feedback.motivation);
    }
  }

  private speakWithBrowserAPI(text: string): void {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      // Try to use a more natural voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') ||
        voice.lang.startsWith('en')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      speechSynthesis.speak(utterance);
    }
  }

  async getRealtimeFeedback(currentSpeed: number, targetPace: number): Promise<string> {
    const speedKmh = currentSpeed;
    const currentPaceMinPerKm = speedKmh > 0 ? 60 / speedKmh : 0;
    
    if (currentPaceMinPerKm === 0) {
      return "Keep moving! Let's get that pace up.";
    }
    
    if (currentPaceMinPerKm < targetPace - 0.5) {
      return "You're flying! Maybe ease up a bit to maintain this pace.";
    } else if (currentPaceMinPerKm > targetPace + 0.5) {
      return "Pick up the pace! You've got this!";
    } else {
      return "Perfect pace! Keep it steady.";
    }
  }
}

export const aiService = new AIService();
export type { RunData, AIFeedback };