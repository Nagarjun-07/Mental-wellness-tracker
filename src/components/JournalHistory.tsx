"use client";

import { useEffect, useState } from "react";
import { getJournalHistory, deleteJournalEntry } from "@/app/actions";
import { useUser } from "@/lib/hooks/useUser";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface JournalEntry {
  id: string;
  text: string;
  date: string;
  emotions: string[];
}

export function JournalHistory() {
  const userId = useUser();
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    getJournalHistory(userId).then(res => {
      setJournals(res);
      setLoading(false);
    });
  }, [userId]);

  const handleDelete = async (id: string) => {
    // Optimistic UI update
    setJournals(prev => prev.filter(j => j.id !== id));
    
    // Server deletion
    const result = await deleteJournalEntry(id);
    if (!result.success) {
      // Revert if failed (optional, depending on UX desired)
      getJournalHistory(userId!).then(res => setJournals(res));
    }
  };

  if (loading) {
    return (
      <Card className="glass h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  if (journals.length === 0) {
    return (
      <Card className="glass h-[400px] flex items-center justify-center text-muted-foreground">
        No past journals found. Keep journaling!
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="glass h-full">
        <CardHeader>
          <CardTitle>Journal Archive</CardTitle>
          <CardDescription>Review your past entries and their emotional context.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-6">
              {journals.map((journal) => (
                <div key={journal.id} className="border-l-2 border-primary/30 pl-4 py-1 group relative">
                  <div className="flex items-center justify-between mb-2 group-hover:opacity-100">
                    <span className="text-xs text-muted-foreground">{journal.date}</span>
                    <div className="flex items-center gap-2">
                      {journal.emotions.slice(0, 2).map((emotion, i) => (
                        <span key={i} className="text-[10px] uppercase tracking-wider bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                          {emotion}
                        </span>
                      ))}
                      <button 
                        onClick={() => handleDelete(journal.id)}
                        className="p-1 ml-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Delete Entry"
                        aria-label="Delete this journal entry"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">
                    {journal.text}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
}
