"use client";

import { EmotionalTimeline } from "@/components/EmotionalTimeline";
import { StudyWellnessBalance } from "@/components/StudyWellnessBalance";
import { PredictiveAlert } from "@/components/PredictiveAlert";
import { Download } from "lucide-react";

export default function InsightsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Insights & Reports</h1>
          <p className="text-muted-foreground mt-2">Deep analytics into your behavioral patterns and wellness trajectory.</p>
        </div>
        <button 
          onClick={() => typeof window !== 'undefined' && window.print()}
          className="hidden md:flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors"
        >
          <Download className="h-4 w-4" />
          Export Weekly PDF
        </button>
      </header>
      
      <PredictiveAlert />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EmotionalTimeline />
        </div>
        <div className="lg:col-span-1">
          <StudyWellnessBalance />
        </div>
      </div>
    </div>
  );
}
