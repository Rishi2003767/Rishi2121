import { TimerMode } from '../hooks/useTimer';

interface ModeSelectorProps {
  mode: TimerMode;
  onModeChange: (mode: TimerMode) => void;
}

const modes: { key: TimerMode; label: string }[] = [
  { key: 'focus', label: 'Focus' },
  { key: 'shortBreak', label: 'Short Break' },
  { key: 'longBreak', label: 'Long Break' },
];

const modeStyles: Record<TimerMode, string> = {
  focus: 'bg-red-500 text-white shadow-lg',
  shortBreak: 'bg-green-500 text-white shadow-lg',
  longBreak: 'bg-blue-500 text-white shadow-lg',
};

export function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
      {modes.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onModeChange(key)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            mode === key
              ? modeStyles[key]
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
