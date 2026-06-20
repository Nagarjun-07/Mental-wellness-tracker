"use client";

import { useEffect, useState } from "react";
import { getTriggerInsights } from "@/app/actions";
import { useUser } from "@/lib/hooks/useUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, Zap, AlertTriangle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

type Trigger = {
  trigger: string;
  confidencePercent: number;
  evidence: string;
  suggestedAction: string;
};

export function TriggerEngine() {
  const userId = useUser();
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    getTriggerInsights(userId).then(res => {
      setTriggers(res);
      setLoading(false);
    });
  }, [userId]);

  if (loading) {
    return (
      <Card className="glass min-h-[300px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  if (triggers.length === 0) {
    return (
      <Card className="glass min-h-[300px] flex flex-col items-center justify-center p-6 text-center">
        <ShieldCheck className="h-12 w-12 text-primary/50 mb-4" />
        <h3 className="text-lg font-medium">Not enough data</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Keep journaling for a few more days so the AI can identify your hidden stress patterns.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Zap className="h-5 w-5 text-primary" /> Hidden Triggers Detected
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {triggers.map((trigger, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <Card className="glass h-full flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-start">
                  <span>{trigger.trigger}</span>
                  <AlertTriangle className="h-4 w-4 text-destructive opacity-80" />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Confidence</span>
                    <span className="font-mono">{trigger.confidencePercent}%</span>
                  </div>
                  <Progress value={trigger.confidencePercent} className="h-1" />
                </div>
                
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wider">Evidence</p>
                  <p className="text-sm italic text-white/80 border-l-2 border-primary/50 pl-3">&ldquo;{trigger.evidence}&rdquo;</p>
                </div>
                
                <div className="bg-primary/10 rounded-md p-3 mt-auto">
                  <p className="text-xs text-primary font-semibold mb-1 uppercase tracking-wider">Action Plan</p>
                  <p className="text-sm">{trigger.suggestedAction}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
