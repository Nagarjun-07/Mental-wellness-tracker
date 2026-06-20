import { BurnoutRadar } from "@/components/BurnoutRadar";
import { TriggerEngine } from "@/components/TriggerEngine";
import { CrisisMode } from "@/components/CrisisMode";

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Dashboard</h1>
        <p className="text-muted-foreground mt-2">Monitor your emotional wellbeing and discover hidden triggers.</p>
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
    </div>
  );
}
