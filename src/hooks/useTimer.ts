import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

interface TimerSettings {
  focus: number;
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number;
}

interface FocusSession {
  date: string;
  duration: number; // in seconds
  completedAt: string;
}

interface TimerState {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  sessionsCompleted: number;
  todaySessions: FocusSession[];
  settings: TimerSettings;
}

const getTodayKey = () => new Date().toISOString().split('T')[0];

const getDefaultDuration = (mode: TimerMode, settings: TimerSettings): number => {
  switch (mode) {
    case 'focus': return settings.focus * 60;
    case 'shortBreak': return settings.shortBreak * 60;
    case 'longBreak': return settings.longBreak * 60;
  }
};

export function useTimer() {
  const [settings, setSettings] = useLocalStorage<TimerSettings>('pomodoro-settings', {
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
  });

  const [todaySessions, setTodaySessions] = useLocalStorage<FocusSession[]>('pomodoro-sessions', []);
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(settings.focus * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useLocalStorage<number>('pomodoro-completed', 0);
  const intervalRef = useRef<number | null>(null);
  const sessionStartRef = useRef<number>(0);

  // Clean up old sessions (keep only today's)
  useEffect(() => {
    const today = getTodayKey();
    const filtered = todaySessions.filter((s: FocusSession) => s.date === today);
    if (filtered.length !== todaySessions.length) {
      setTodaySessions(filtered);
    }
  }, []);

  // Timer tick
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer completed
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);
    
    if (mode === 'focus') {
      const session: FocusSession = {
        date: getTodayKey(),
        duration: settings.focus * 60,
        completedAt: new Date().toISOString(),
      };
      setTodaySessions((prev: FocusSession[]) => [...prev, session]);
      const newCompleted = sessionsCompleted + 1;
      setSessionsCompleted(newCompleted);

      // Auto switch to break
      if (newCompleted % settings.longBreakInterval === 0) {
        switchMode('longBreak');
      } else {
        switchMode('shortBreak');
      }
    } else {
      // After break, switch back to focus
      switchMode('focus');
    }

    // Play notification sound
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.3;
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 300);
    } catch {}
  }, [mode, settings, sessionsCompleted]);

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(getDefaultDuration(newMode, settings));
  };

  const start = () => {
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(getDefaultDuration(mode, settings));
  };

  const updateSettings = (newSettings: Partial<TimerSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    if (!isRunning) {
      setTimeLeft(getDefaultDuration(mode, updated));
    }
  };

  // Set duration directly for the current mode (in minutes)
  const setDuration = (minutes: number) => {
    const clamped = Math.max(1, Math.min(180, minutes));
    const key = mode === 'focus' ? 'focus' : mode === 'shortBreak' ? 'shortBreak' : 'longBreak';
    const updated = { ...settings, [key]: clamped };
    setSettings(updated);
    if (!isRunning) {
      setTimeLeft(clamped * 60);
    }
  };

  const totalFocusToday = todaySessions.reduce((acc: number, s: FocusSession) => acc + s.duration, 0);

  return {
    mode,
    timeLeft,
    isRunning,
    sessionsCompleted,
    todaySessions,
    settings,
    totalFocusToday,
    start,
    pause,
    reset,
    switchMode,
    updateSettings,
    setDuration,
  };
}
