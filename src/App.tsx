import { useTimer, TimerMode } from './hooks/useTimer';
import { TimerDisplay } from './components/TimerDisplay';
import { Controls } from './components/Controls';
import { ModeSelector } from './components/ModeSelector';
import { Settings } from './components/Settings';
import { Stats } from './components/Stats';

const modeLabels: Record<TimerMode, string> = {
  focus: 'Focus Time',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};

const modeEmojis: Record<TimerMode, string> = {
  focus: '🎯',
  shortBreak: '☕',
  longBreak: '🌿',
};

function App() {
  const {
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
  } = useTimer();

  const totalDuration = (() => {
    switch (mode) {
      case 'focus': return settings.focus * 60;
      case 'shortBreak': return settings.shortBreak * 60;
      case 'longBreak': return settings.longBreak * 60;
    }
  })();

  // Update document title with timer
  if (typeof document !== 'undefined') {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.title = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} - ${modeLabels[mode]}`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      {/* Header */}
      <div className="w-full max-w-lg flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <span className="text-2xl">🍅</span>
          Pomodoro
        </h1>
        <Settings settings={settings} onUpdate={updateSettings} />
      </div>

      {/* Mode Selector */}
      <ModeSelector mode={mode} onModeChange={switchMode} />

      {/* Current Mode Label */}
      <div className="mt-6 mb-4 flex items-center gap-2">
        <span className="text-2xl">{modeEmojis[mode]}</span>
        <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
          {modeLabels[mode]}
        </span>
      </div>

      {/* Timer Display */}
      <TimerDisplay timeLeft={timeLeft} totalDuration={totalDuration} mode={mode} />

      {/* Controls */}
      <div className="mt-8">
        <Controls
          isRunning={isRunning}
          onStart={start}
          onPause={pause}
          onReset={reset}
        />
      </div>

      {/* Session Progress Dots */}
      <div className="mt-6 flex items-center gap-2">
        {Array.from({ length: settings.longBreakInterval }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              i < (sessionsCompleted % settings.longBreakInterval)
                ? 'bg-red-500 scale-110'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
          {sessionsCompleted % settings.longBreakInterval}/{settings.longBreakInterval} to long break
        </span>
      </div>

      {/* Stats */}
      <div className="mt-8">
        <Stats
          totalFocusToday={totalFocusToday}
          sessionsCompleted={sessionsCompleted}
          sessionCount={todaySessions.length}
        />
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-gray-400 dark:text-gray-500">
        Stay focused. Take breaks. Be productive.
      </p>
    </div>
  );
}

export default App;
