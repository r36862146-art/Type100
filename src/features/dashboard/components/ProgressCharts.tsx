import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TypingSession } from '@/types/models';
import { format } from 'date-fns';

interface ProgressChartsProps {
  sessions: TypingSession[];
}

export function ProgressCharts({ sessions }: ProgressChartsProps) {
  // Process data for charts
  const chartData = useMemo(() => {
    // Only take the last 50 sessions for readability
    const recentSessions = sessions.slice(-50);
    return recentSessions.map((s, index) => ({
      name: format(new Date(s.timestamp), 'MMM dd'),
      wpm: s.wpm,
      accuracy: s.accuracy,
      sessionIndex: index + 1
    }));
  }, [sessions]);

  if (chartData.length === 0) {
    return (
      <Card className="w-full h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">Complete some tests to see your progress!</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* WPM Chart */}
      <Card className="shadow-premium-sm transition-all hover:shadow-premium border-white/5 dark:border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg">WPM History</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                minTickGap={30}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderRadius: '8px', 
                  border: '1px solid hsl(var(--border))',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="wpm" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorWpm)" 
                activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Accuracy Chart */}
      <Card className="shadow-premium-sm transition-all hover:shadow-premium border-white/5 dark:border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg">Accuracy History</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                minTickGap={30}
              />
              <YAxis 
                domain={['auto', 100]}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderRadius: '8px', 
                  border: '1px solid hsl(var(--border))',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
