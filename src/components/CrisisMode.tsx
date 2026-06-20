"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/lib/hooks/useUser";
import { getBurnoutScore } from "@/app/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, HeartPulse, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CrisisMode() {
  const userId = useUser();
  const [showCrisis, setShowCrisis] = useState(false);

  useEffect(() => {
    if (!userId) return;
    getBurnoutScore(userId).then(res => {
      if ((res?.score || 0) > 80) {
        setShowCrisis(true);
      }
    });
  }, [userId]);

  return (
    <AnimatePresence>
      {showCrisis && (
        <motion.div
          initial={{ opacity: 0, height: 0, scale: 0.95 }}
          animate={{ opacity: 1, height: "auto", scale: 1 }}
          exit={{ opacity: 0, height: 0, scale: 0.95 }}
        >
          <Alert variant="destructive" className="bg-destructive border-destructive/50 text-destructive-foreground relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldAlert className="h-24 w-24" />
            </div>
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-lg font-bold flex items-center gap-2">
              Exam Crisis Mode Activated <HeartPulse className="h-4 w-4 animate-pulse text-red-400" />
            </AlertTitle>
            <AlertDescription className="mt-2 text-sm leading-relaxed max-w-[85%]">
              Your burnout risk is critically high. 
              <br/><br/>
              <strong>Action Plan:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Stop studying immediately and take a 30-minute break.</li>
                <li>Do the 4-7-8 breathing exercise.</li>
                <li>Hydrate and step outside if possible.</li>
              </ul>
              <br/>
              <em>You are more than your exam scores. Take care of yourself first.</em>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
