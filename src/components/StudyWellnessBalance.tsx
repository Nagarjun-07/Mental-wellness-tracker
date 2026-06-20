"use client";

import { useState } from "react";
import { evaluateStudyBalance } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Activity, BookOpen, Moon, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function StudyWellnessBalance() {
  const [study, setStudy] = useState("6");
  const [sleep, setSleep] = useState("7");
  const [exercise, setExercise] = useState("30");
  const [result, setResult] = useState<{score: number, feedback: string, recommendation: string} | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEvaluate = async () => {
    setLoading(true);
    const res = await evaluateStudyBalance(Number(study), Number(sleep), Number(exercise));
    setResult(res);
    setLoading(false);
  };

  return (
    <Card className="glass h-full">
      <CardHeader>
        <CardTitle>Study-Wellness Balance</CardTitle>
        <CardDescription>Let AI analyze your daily routine for optimal performance.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="study-hours-input" className="text-xs text-muted-foreground flex items-center gap-1"><BookOpen className="h-3 w-3"/> Study (hrs)</label>
            <Input id="study-hours-input" type="number" value={study} onChange={e => setStudy(e.target.value)} className="bg-black/20 border-white/10" />
          </div>
          <div className="space-y-2">
            <label htmlFor="sleep-hours-input" className="text-xs text-muted-foreground flex items-center gap-1"><Moon className="h-3 w-3"/> Sleep (hrs)</label>
            <Input id="sleep-hours-input" type="number" value={sleep} onChange={e => setSleep(e.target.value)} className="bg-black/20 border-white/10" />
          </div>
          <div className="space-y-2">
            <label htmlFor="exercise-minutes-input" className="text-xs text-muted-foreground flex items-center gap-1"><Activity className="h-3 w-3"/> Exercise (min)</label>
            <Input id="exercise-minutes-input" type="number" value={exercise} onChange={e => setExercise(e.target.value)} className="bg-black/20 border-white/10" />
          </div>
        </div>
        
        <button 
          onClick={handleEvaluate}
          disabled={loading}
          className="w-full bg-primary/20 text-primary border border-primary/50 py-2 rounded-md font-medium hover:bg-primary/30 transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Evaluate Balance"}
        </button>

        {result && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 p-4 bg-black/40 rounded-lg border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Wellness Score</span>
              <span className={`text-xl font-bold ${result.score > 70 ? 'text-primary' : result.score > 40 ? 'text-yellow-500' : 'text-destructive'}`}>
                {result.score}/100
              </span>
            </div>
            <p className="text-sm italic">&ldquo;{result.feedback}&rdquo;</p>
            <div className="bg-primary/10 p-2 rounded text-xs text-primary">
              <span className="font-semibold block mb-1">Recommendation:</span>
              {result.recommendation}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
