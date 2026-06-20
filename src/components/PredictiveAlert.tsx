"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/lib/hooks/useUser";
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore/lite";
import { db } from "@/lib/firebase";
import { ai } from "@/lib/gemini";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export function PredictiveAlert() {
  const userId = useUser();
  const [prediction, setPrediction] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    async function fetchPrediction() {
      try {
        const q = query(collection(db, "journals"), where("userId", "==", userId), orderBy("createdAt", "desc"), limit(7));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.docs.length < 3) return; // Not enough data
        
        const journals = querySnapshot.docs.map(doc => doc.data().analysis);
        
        const prompt = `
          Based on this recent emotional data of a student over the last week:
          ${JSON.stringify(journals)}
          
          Predict the potential stress risk for the next 7 days in exactly one sentence.
          Format example: "Based on your recent sleep deprivation and anxiety spikes, your stress may increase by 25% next week."
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        setPrediction(response.text || null);
      } catch (error) {
        if ((error as any)?.code !== 'failed-precondition') {
          console.error("Failed to generate prediction:", error);
        }
      }
    }

    fetchPrediction();
  }, [userId]);

  if (!prediction) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
      <Alert className="bg-primary/10 border-primary/20 text-primary-foreground backdrop-blur-md">
        <Sparkles className="h-5 w-5 text-primary" />
        <AlertTitle className="text-primary font-bold flex items-center gap-2">
          7-Day Predictive AI Alert <TrendingUp className="h-4 w-4" />
        </AlertTitle>
        <AlertDescription className="mt-1 text-white/80">
          {prediction}
        </AlertDescription>
      </Alert>
    </motion.div>
  );
}
