export interface UserProfile {
  id: string; // Matches Supabase auth.users.id
  display_name: string;
  avatar_url?: string;
  country?: string;
  preferred_language?: string;
  typing_preferences?: {
    theme?: string;
    sound_enabled?: boolean;
    blind_mode?: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface TypingSession {
  id: string;
  user_id: string;
  wpm: number;
  accuracy: number;
  duration: number; // in seconds
  mode: string; // e.g. "quote", "time", "words", "exam"
  timestamp: string;
}

export interface ExamProgress {
  id: string;
  user_id: string;
  exam_id: string;
  status: 'in_progress' | 'passed' | 'failed';
  score: number;
  started_at: string;
  completed_at?: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  badge_name: string;
  description: string;
  unlocked_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'exam';
  target: number; // e.g., 30 (minutes), 40 (wpm)
  progress: number;
  metric: 'minutes' | 'wpm' | 'accuracy' | 'simulations';
  deadline?: string;
  created_at: string;
  completed_at?: string;
}

export interface ReadinessSnapshot {
  id: string;
  user_id: string;
  readiness_score: number; // 0-100
  timestamp: string;
}

export interface Settings {
  id: string;
  user_id: string;
  sync_enabled: boolean;
  notifications_enabled: boolean;
  offline_mode: boolean;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsEvent {
  id: string;
  user_id: string;
  event_type: string;
  payload: Record<string, any>;
  timestamp: string;
}
