import React from 'react';
import { UserStatsAggregates } from '../hooks/useUserStats';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Award, Zap, Activity } from 'lucide-react';

interface InsightsGeneratorProps {
  stats: UserStatsAggregates;
}

export function InsightsGenerator({ stats }: InsightsGeneratorProps) {
  const insights = [];

  // Generate dynamic insights
  if (stats.currentStreak > 3) {
    insights.push({
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      text: `You're on fire! ${stats.currentStreak} day streak. Keep it up!`,
      color: 'bg-yellow-500/10 border-yellow-500/20'
    });
  }

  if (stats.testsCompleted > 10) {
    // Compare last 5 with previous 5
    const recent = stats.sessions.slice(-5);
    const previous = stats.sessions.slice(-10, -5);
    
    const recentAvg = recent.reduce((sum, s) => sum + s.wpm, 0) / 5;
    const prevAvg = previous.reduce((sum, s) => sum + s.wpm, 0) / 5;
    
    if (recentAvg > prevAvg + 2) {
      const improvement = Math.round(((recentAvg - prevAvg) / prevAvg) * 100);
      insights.push({
        icon: <TrendingUp className="w-5 h-5 text-green-500" />,
        text: `Your speed increased by ${improvement}% over your last 5 sessions!`,
        color: 'bg-green-500/10 border-green-500/20'
      });
    }
  }

  if (stats.currentWpm >= stats.personalBestWpm && stats.testsCompleted > 0) {
    insights.push({
      icon: <Award className="w-5 h-5 text-purple-500" />,
      text: `New Personal Best! You reached ${stats.personalBestWpm} WPM.`,
      color: 'bg-purple-500/10 border-purple-500/20'
    });
  } else if (stats.averageAccuracy > 96) {
    insights.push({
      icon: <Activity className="w-5 h-5 text-blue-500" />,
      text: `Incredible accuracy! You're averaging ${stats.averageAccuracy}% correct.`,
      color: 'bg-blue-500/10 border-blue-500/20'
    });
  }

  // Fallback insight
  if (insights.length === 0) {
    insights.push({
      icon: <Activity className="w-5 h-5 text-primary" />,
      text: `Consistency is key. Practice for 5 minutes today!`,
      color: 'bg-primary/5 border-primary/10'
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {insights.slice(0, 2).map((insight, i) => (
        <Card key={i} className={`shadow-sm border ${insight.color} transition-all`}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 rounded-full bg-background/50 shrink-0">
              {insight.icon}
            </div>
            <p className="font-medium text-sm leading-snug">{insight.text}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
