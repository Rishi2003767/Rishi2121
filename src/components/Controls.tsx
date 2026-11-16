interface ControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function Controls({ isRunning, onStart, onPause, onReset }: ControlsProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onReset}
        className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        aria-label="Reset"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </button>
      
      <button
        onClick={isRunning ? onPause : onStart}
        className="w-16 h-16 rounded-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        aria-label={isRunning ? 'Pause' : 'Start'}
      >
        {isRunning ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="6,3 20,12 6,21" />
          </svg>
        )}
      </button>

      <div className="w-12 h-12" /> {/* Spacer for symmetry */}
    </div>
  );
}
