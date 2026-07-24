"use client";

import React from 'react';
import { useUserStats } from '../hooks/useUserStats';
import dynamic from 'next/dynamic';
const ProgressCharts = dynamic(() => import('./ProgressCharts').then(m => m.ProgressCharts), { 
  ssr: false,
  loading: () => <div className="w-full h-[400px] bg-muted/20 animate-pulse rounded-xl" />
});
import { InsightsGenerator } from './InsightsGenerator';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, Clock, Type, Trophy, Target } from 'lucide-react';

export function DashboardLayout() {
  const { stats, loading } = useUserStats();

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stats) return null;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Progress</h1>
          <p className="text-muted-foreground mt-1">Track your typing speed and consistency.</p>
        </div>
        <div className="flex items-center gap-2 bg-card border rounded-full px-4 py-1.5 shadow-premium-sm">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="font-semibold text-sm">{stats.currentStreak} Day Streak</span>
        </div>
      </div>

      <InsightsGenerator stats={stats} />

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Current WPM" value={stats.currentWpm} subtitle="Last session" icon={<Zap className="w-4 h-4 text-primary" />} />
        <StatCard title="Average WPM" value={stats.averageWpm} subtitle="All time" icon={<Activity className="w-4 h-4 text-blue-500" />} />
        <StatCard title="Best WPM" value={stats.personalBestWpm} subtitle="Personal record" icon={<Trophy className="w-4 h-4 text-yellow-500" />} />
        <StatCard title="Accuracy" value={`${stats.averageAccuracy}%`} subtitle="Average" icon={<Target className="w-4 h-4 text-green-500" />} />
        <StatCard title="Practice Time" value={formatTime(stats.totalPracticeTime)} subtitle="Total duration" icon={<Clock className="w-4 h-4 text-purple-500" />} />
        <StatCard title="Tests" value={stats.testsCompleted} subtitle="Completed" icon={<Type className="w-4 h-4 text-orange-500" />} />
      </div>

      <ProgressCharts sessions={stats.sessions} />
    </div>
  );
}

function StatCard({ title, value, subtitle, icon }: { title: string, value: string | number, subtitle: string, icon: React.ReactNode }) {
  return (
    <Card className="shadow-premium-sm border-white/5 dark:border-white/10 backdrop-blur-xl hover:-translate-y-1 transition-all duration-300 hover:shadow-premium">
      <CardContent className="p-4 flex flex-col justify-between h-full">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon}
        </div>
        <div>
          <h3 className="text-2xl font-bold">{value}</h3>
          <p className="text-xs text-muted-foreground mt-1 opacity-80">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Temporary internal icons for the grid
import { Zap, Activity } from 'lucide-react';
