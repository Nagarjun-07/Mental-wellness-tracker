import { AIJournal } from "@/components/AIJournal";

export default function JournalPage() {
  return (
    <div className="py-8">
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">Daily Reflection</h1>
        <p className="text-muted-foreground mt-2">
          Your safe space to vent. Gemini will analyze your entry to track your emotional well-being over time.
        </p>
      </div>
      <AIJournal />
    </div>
  );
}
