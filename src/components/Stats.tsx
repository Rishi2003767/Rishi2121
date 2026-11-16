interface StatsProps {
  totalFocusToday: number;
  sessionsCompleted: number;
  sessionCount: number;
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function Stats({ totalFocusToday, sessionsCompleted, sessionCount }: StatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-md">
      <div className="flex flex-col items-center p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
        <div className="text-2xl mb-1">🔥</div>
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {sessionCount}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Today's Sessions
        </span>
      </div>
      
      <div className="flex flex-col items-center p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
        <div className="text-2xl mb-1">⏱️</div>
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatTime(totalFocusToday)}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Focus Time
        </span>
      </div>
      
      <div className="flex flex-col items-center p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
        <div className="text-2xl mb-1">🏆</div>
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {sessionsCompleted}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Total Sessions
        </span>
      </div>
    </div>
  );
}
