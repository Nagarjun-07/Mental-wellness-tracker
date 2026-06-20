"use client";

import { useState, useRef } from "react";
import { useUser } from "@/lib/hooks/useUser";
import { analyzeJournalEntry } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Mic, MicOff, Send, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function AIJournal() {
  const userId = useUser();
  const [text, setText] = useState("");
  const [mood, setMood] = useState([50]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const recognitionRef = useRef<any>(null);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        }
      }
      if (finalTranscript) {
        setText(prev => prev + finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error(event.error);
      setIsRecording(false);
      toast.error("Microphone error.");
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  const handleSubmit = async () => {
    if (!text.trim() || !userId) return;

    setIsSubmitting(true);
    const fullEntry = `Mood Level (0-100): ${mood[0]}. ${text}`;
    
    const result = await analyzeJournalEntry(userId, fullEntry);
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Journal saved. AI has analyzed your emotional state.");
      setText("");
      setMood([50]);
    } else {
      toast.error(result.error || "Failed to analyze journal.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="glass max-w-2xl mx-auto overflow-hidden relative">
        {isSubmitting && (
          <div 
            className="absolute inset-0 z-10 bg-background/50 backdrop-blur-sm flex flex-col items-center justify-center"
            aria-live="polite"
            aria-atomic="true"
          >
            <Sparkles className="h-8 w-8 text-primary animate-pulse mb-4" />
            <p className="font-medium animate-pulse">Gemini is analyzing your emotions...</p>
          </div>
        )}
        
        <CardHeader>
          <CardTitle>AI Wellness Journal</CardTitle>
          <CardDescription>Speak or type your thoughts. Our AI will uncover hidden patterns.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground flex justify-between">
              <span>Current Stress / Mood Level</span>
              <span>{mood[0]}%</span>
            </label>
            <Slider 
              value={mood} 
              onValueChange={(val) => setMood(Array.isArray(val) ? Array.from(val) : [val as number])} 
              max={100} step={1}
              className="py-4"
              aria-label="Mood Slider"
            />
          </div>

          <div className="relative">
            <Textarea 
              placeholder="How are you feeling today? Any specific triggers?"
              className="min-h-[200px] resize-none bg-black/20 border-white/10 text-base p-4 focus-visible:ring-primary/50"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleRecording}
              aria-label={isRecording ? "Stop recording" : "Start recording"}
              aria-pressed={isRecording}
              className={`absolute bottom-4 right-4 p-3 rounded-full transition-colors shadow-lg ${
                isRecording 
                  ? "bg-destructive text-destructive-foreground animate-pulse shadow-[0_0_20px_rgba(var(--destructive),0.5)]" 
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-white/10"
              }`}
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </motion.button>
          </div>
        </CardContent>
        <CardFooter className="justify-end bg-black/10 border-t border-white/5 mt-4 pt-4">
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            disabled={!text.trim() || isSubmitting}
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] disabled:opacity-50 transition-all border border-white/10"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Analyze & Save
          </motion.button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
