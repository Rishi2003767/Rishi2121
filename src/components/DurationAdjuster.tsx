import { TimerMode } from '../hooks/useTimer';

interface DurationAdjusterProps {
  mode: TimerMode;
  currentDuration: number; // in minutes
  isRunning: boolean;
  onDurationChange: (minutes: number) => void;
}

const presets: Record<TimerMode, number[]> = {
  focus: [15, 25, 30, 45, 60],
  shortBreak: [3, 5, 10, 15],
  longBreak: [15, 20, 30, 45],
};

const modeColors: Record<TimerMode, string> = {
  focus: 'bg-red-500 hover:bg-red-600',
  shortBreak: 'bg-green-500 hover:bg-green-600',
  longBreak: 'bg-blue-500 hover:bg-blue-600',
};

const modeRingColors: Record<TimerMode, string> = {
  focus: 'ring-red-500',
  shortBreak: 'ring-green-500',
  longBreak: 'ring-blue-500',
};

export function DurationAdjuster({ mode, currentDuration, isRunning, onDurationChange }: DurationAdjusterProps) {
  const modePresets = presets[mode];

  const handleDecrement = () => {
    if (!isRunning && currentDuration > 1) {
      onDurationChange(currentDuration - 1);
    }
  };

  const handleIncrement = () => {
    if (!isRunning && currentDuration < 180) {
      onDurationChange(currentDuration + 1);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-sm">
      {/* +/- Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleDecrement}
          disabled={isRunning || currentDuration <= 1}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-gray-700 dark:text-gray-300 font-bold text-lg"
          aria-label="Decrease duration"
        >
          −
        </button>

        <div className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <span className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums min-w-[3ch] text-center">
            {currentDuration}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">min</span>
        </div>

        <button
          onClick={handleIncrement}
          disabled={isRunning || currentDuration >= 180}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-gray-700 dark:text-gray-300 font-bold text-lg"
          aria-label="Increase duration"
        >
          +
        </button>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap justify-center gap-2">
        {modePresets.map((preset) => (
          <button
            key={preset}
            onClick={() => !isRunning && onDurationChange(preset)}
            disabled={isRunning}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
              currentDuration === preset
                ? `${modeColors[mode]} text-white shadow-md ring-2 ${modeRingColors[mode]} ring-offset-2 dark:ring-offset-gray-900`
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {preset}m
          </button>
        ))}
      </div>

      {isRunning && (
        <p className="text-xs text-gray-400 dark:text-gray-500 italic">
          Pause the timer to adjust duration
        </p>
      )}
    </div>
  );
}
