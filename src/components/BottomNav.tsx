import { useStore, type TabId } from '../store/useStore';

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'today', label: 'TODAY', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' },
  { id: 'programme', label: 'PLAN', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z' },
  { id: 'prehab', label: 'PREHAB', icon: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' },
  { id: 'nutrition', label: 'FOOD', icon: 'M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1zm15.03-7c0-4.5-5.46-5.46-8.03-5.85L6.93 5.05H1v2.5S8 8.05 8 14.05v5h8.03v-4.06z' },
  { id: 'progress', label: 'STATS', icon: 'M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z' },
];

export function BottomNav() {
  const { activeTab, setActiveTab } = useStore();

  return (
    <nav className="flex-shrink-0 relative bg-surface/80 backdrop-blur-xl border-t border-white/8 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around px-1" style={{ height: '64px' }}>
        {tabs.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-all duration-300 active:scale-90 ${
                active ? '' : 'text-secondary'
              }`}
            >
              {/* Active glow background */}
              {active && (
                <div className="absolute inset-x-2 -top-1 bottom-2 rounded-2xl animate-scale-in"
                  style={{ background: 'radial-gradient(ellipse at top, rgba(255,45,120,0.15) 0%, transparent 70%)' }}
                />
              )}

              {/* Top indicator bar */}
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-accent-pink transition-all" />
              )}

              <div className="relative">
                <svg className={`w-5 h-5 transition-all duration-300 ${active ? 'text-accent-pink scale-110' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d={tab.icon} />
                </svg>
              </div>
              <span className={`relative text-[10px] font-bold tracking-wider transition-colors duration-300 ${active ? 'text-accent-pink' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
