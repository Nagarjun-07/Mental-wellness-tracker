import { AIJournal } from "@/components/AIJournal";
import { JournalHistory } from "@/components/JournalHistory";
import { BurnoutRadar } from "@/components/BurnoutRadar";
import { TriggerEngine } from "@/components/TriggerEngine";
import { CrisisMode } from "@/components/CrisisMode";

export default function UnifiedDashboard() {
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* 1. The Input (Top) */}
      <section>
        <header className="mb-8 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight">How are you feeling today?</h1>
          <p className="text-muted-foreground mt-2">
            Your safe space to vent. Gemini will analyze your entry to track your emotional well-being over time.
          </p>
        </header>
        <AIJournal />
      </section>

      {/* 2. The Archive (Middle) */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight">Recent Reflections</h2>
          <p className="text-sm text-muted-foreground">Review your past entries and their emotional composition.</p>
        </div>
        <JournalHistory />
      </section>

      <hr className="border-white/10" />

      {/* 3. The Results Dashboard (Bottom) */}
      <section className="space-y-8">
        <header>
          <h2 className="text-3xl font-bold tracking-tight">AI Analytics Dashboard</h2>
          <p className="text-muted-foreground mt-2">Deep insights generated from your recent reflections.</p>
        </header>
        
        <CrisisMode />
        
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <BurnoutRadar />
          </div>
          <div className="lg:col-span-2">
             <TriggerEngine />
          </div>
        </div>
      </section>
    </div>
  );
}
