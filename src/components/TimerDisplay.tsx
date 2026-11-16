import { TimerMode } from '../hooks/useTimer';

interface TimerDisplayProps {
  timeLeft: number;
  totalDuration: number;
  mode: TimerMode;
}

const modeColors: Record<TimerMode, { ring: string; text: string; bg: string }> = {
  focus: { ring: '#ef4444', text: 'text-red-500', bg: 'bg-red-500/10' },
  shortBreak: { ring: '#22c55e', text: 'text-green-500', bg: 'bg-green-500/10' },
  longBreak: { ring: '#3b82f6', text: 'text-blue-500', bg: 'bg-blue-500/10' },
};

export function TimerDisplay({ timeLeft, totalDuration, mode }: TimerDisplayProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;
  
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  
  const colors = modeColors[mode];

  return (
    <div className="relative flex items-center justify-center">
      <svg width="320" height="320" className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="160"
          cy="160"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx="160"
          cy="160"
          r={radius}
          fill="none"
          stroke={colors.ring}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-6xl font-mono font-bold tracking-wider ${colors.text}`}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
