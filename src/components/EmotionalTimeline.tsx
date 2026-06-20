"use client";

import { useEffect, useState } from "react";
import { getEmotionalTimeline } from "@/app/actions";
import { useUser } from "@/lib/hooks/useUser";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function EmotionalTimeline() {
  const userId = useUser();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    getEmotionalTimeline(userId).then(res => {
      setData(res);
      setLoading(false);
    });
  }, [userId]);

  if (loading) {
    return (
      <Card className="glass h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="glass h-[400px] flex items-center justify-center text-muted-foreground">
        No emotional data available. Keep journaling!
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="glass">
        <CardHeader>
          <CardTitle>Emotional Timeline</CardTitle>
          <CardDescription>Track your stress and confidence levels over the past 30 days.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} 
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="stress" stroke="hsl(var(--destructive))" fillOpacity={1} fill="url(#colorStress)" name="Stress Level" />
                <Area type="monotone" dataKey="confidence" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorConfidence)" name="Confidence" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
