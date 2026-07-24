import { useState, useEffect } from 'react';
import { localDb } from '@/lib/local-db/db';
import { TypingSession } from '@/types/models';
import { startOfDay, differenceInDays } from 'date-fns';

export interface UserStatsAggregates {
  currentWpm: number;
  personalBestWpm: number;
  averageWpm: number;
  averageAccuracy: number;
  currentStreak: number;
  longestStreak: number;
  testsCompleted: number;
  totalPracticeTime: number; // in seconds
  totalWordsTyped: number;
  totalCharactersTyped: number;
  lastPracticeDate: string | null;
  sessions: TypingSession[];
}

export function useUserStats() {
  const [stats, setStats] = useState<UserStatsAggregates | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const sessions = await localDb.getAllSessions();
        if (!sessions || sessions.length === 0) {
          setStats({
            currentWpm: 0,
            personalBestWpm: 0,
            averageWpm: 0,
            averageAccuracy: 0,
            currentStreak: 0,
            longestStreak: 0,
            testsCompleted: 0,
            totalPracticeTime: 0,
            totalWordsTyped: 0,
            totalCharactersTyped: 0,
            lastPracticeDate: null,
            sessions: [],
          });
          return;
        }

        // Sort sessions by timestamp (oldest first for calculations)
        const sortedSessions = [...sessions].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        
        let totalWpm = 0;
        let totalAccuracy = 0;
        let bestWpm = 0;
        let practiceTime = 0;
        let wordsTyped = 0;
        let charsTyped = 0;
        
        let currentStreak = 0;
        let longestStreak = 0;
        let lastDate: Date | null = null;

        for (const session of sortedSessions) {
          totalWpm += session.wpm;
          totalAccuracy += session.accuracy;
          if (session.wpm > bestWpm) bestWpm = session.wpm;
          practiceTime += session.duration;
          
          // Estimate words and chars
          const chars = Math.round((session.wpm * 5) * (session.duration / 60));
          charsTyped += chars;
          wordsTyped += Math.round(chars / 5);

          // Streak calculation
          const sessionDate = startOfDay(new Date(session.timestamp));
          if (!lastDate) {
            currentStreak = 1;
            longestStreak = 1;
          } else {
            const diff = differenceInDays(sessionDate, lastDate);
            if (diff === 1) {
              currentStreak += 1;
              if (currentStreak > longestStreak) longestStreak = currentStreak;
            } else if (diff > 1) {
              currentStreak = 1; // Reset streak
            }
          }
          lastDate = sessionDate;
        }

        // Check if current streak is broken today
        const today = startOfDay(new Date());
        if (lastDate && differenceInDays(today, lastDate) > 1) {
          currentStreak = 0;
        }

        const latestSession = sortedSessions[sortedSessions.length - 1];

        setStats({
          currentWpm: latestSession.wpm,
          personalBestWpm: bestWpm,
          averageWpm: Math.round(totalWpm / sessions.length),
          averageAccuracy: Math.round(totalAccuracy / sessions.length),
          currentStreak,
          longestStreak,
          testsCompleted: sessions.length,
          totalPracticeTime: practiceTime,
          totalWordsTyped: wordsTyped,
          totalCharactersTyped: charsTyped,
          lastPracticeDate: latestSession.timestamp,
          sessions: sortedSessions,
        });
      } catch (err) {
        console.error("Failed to load user stats", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return { stats, loading };
}
