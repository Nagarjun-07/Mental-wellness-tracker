"use client";

import { useEffect, useState } from "react";
import { getBurnoutScore } from "@/app/actions";
import { useUser } from "@/lib/hooks/useUser";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function BurnoutRadar() {
  const userId = useUser();
  const [data, setData] = useState<{ score: number; explanation: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    getBurnoutScore(userId).then(res => {
      setData(res);
      setLoading(false);
    });
  }, [userId]);

  if (loading) {
    return (
      <Card className="glass h-[350px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  const score = data?.score || 0;
  const chartData = [{ name: "Burnout", value: score, fill: score > 75 ? "hsl(var(--destructive))" : score > 50 ? "#f59e0b" : "hsl(var(--primary))" }];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="glass h-full">
        <CardHeader>
          <CardTitle>Burnout Radar</CardTitle>
          <CardDescription>Real-time emotional exhaustion tracking</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4">
          <div className="h-[180px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" cy="50%" 
                innerRadius="70%" outerRadius="100%" 
                barSize={15} data={chartData} 
                startAngle={180} endAngle={0}
              >
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar 
                  background={{ fill: "rgba(255,255,255,0.02)" }} 
                  dataKey="value" 
                  cornerRadius={10} 
                  style={{ filter: 'url(#glow)' }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center mt-6">
              <motion.span 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="text-4xl font-bold tracking-tighter text-white"
              >
                {score}
              </motion.span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Risk</span>
            </div>
          </div>
          <p className="text-sm text-center text-muted-foreground mt-4 leading-relaxed">
            {data?.explanation}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
