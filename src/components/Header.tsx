import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { Bell, Search, User, ChevronDown, Zap } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { currentView, clusters, jobs } = useStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const upClusters = clusters.filter(c => c.status === 'UP').length;
  const runningJobs = jobs.filter(j => j.status === 'RUNNING').length;

  const viewTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    clusters: 'Clusters',
    jobs: 'Jobs',
    services: 'Services',
    logs: 'Logs',
    settings: 'Settings',
  };

  const notifications = [
    { id: 1, text: 'Cluster rl-experiment GPU utilization at 94%', time: '2m ago', type: 'info' },
    { id: 2, text: 'Job train-llama-70b completed checkpoint', time: '15m ago', type: 'success' },
    { id: 3, text: 'Cost alert: Weekly spend approaching $500', time: '1h ago', type: 'warning' },
  ];

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-14 px-6 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono text-lightrail uppercase tracking-widest">LightOS</span>
        <span className="text-muted-foreground">/</span>
        <h2 className="text-sm font-medium text-foreground/80 font-mono">{viewTitles[currentView]}</h2>
        <div className="flex items-center gap-2 ml-4">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-lightrail/10 border border-lightrail/20">
            <span className="w-1.5 h-1.5 rounded-full bg-lightrail" />
            <span className="text-[10px] text-lightrail font-medium font-mono">{upClusters} clusters</span>
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-glow-secondary/10 border border-glow-secondary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-glow-secondary" />
            <span className="text-[10px] text-glow-secondary font-medium font-mono">{runningJobs} jobs</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/50 border border-border hover:bg-accent hover:border-lightrail/30 transition-all">
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-mono">Search...</span>
          <kbd className="text-[10px] text-muted-foreground/50 font-mono">⌘K</kbd>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex items-center justify-center w-8 h-8 rounded-lg hover:bg-accent transition-colors"
          >
            <Bell className="w-4 h-4 text-foreground/60" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-lightrail" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-border">
                  <h3 className="text-sm font-semibold text-foreground font-mono">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="px-4 py-3 border-b border-border/50 hover:bg-accent/50 transition-colors">
                      <p className="text-xs text-foreground/70">{n.text}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 font-mono">{n.time}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User */}
        <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-accent transition-colors">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-lightrail/10 border border-lightrail/20">
            <User className="w-3.5 h-3.5 text-lightrail" />
          </div>
          <div className="text-left">
            <p className="text-xs font-medium text-foreground/80 font-mono">alex.chen</p>
            <p className="text-[10px] text-muted-foreground font-mono">Admin</p>
          </div>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
