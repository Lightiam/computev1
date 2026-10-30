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
    <header className="sticky top-0 z-40 flex items-center justify-between h-14 px-6 bg-[#08080d]/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-medium text-white/80">{viewTitles[currentView]}</h2>
        <div className="flex items-center gap-2 ml-4">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-emerald-400 font-medium">{upClusters} clusters</span>
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span className="text-[10px] text-blue-400 font-medium">{runningJobs} jobs</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all">
          <Search className="w-3.5 h-3.5 text-white/40" />
          <span className="text-xs text-white/40">Search...</span>
          <kbd className="text-[10px] text-white/20 font-mono">⌘K</kbd>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/[0.06] transition-colors"
          >
            <Bell className="w-4 h-4 text-white/60" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-violet-500" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-80 bg-[#12121a] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <h3 className="text-sm font-semibold text-white">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <p className="text-xs text-white/70">{n.text}</p>
                      <p className="text-[10px] text-white/30 mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User */}
        <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/[0.06] transition-colors">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500">
            <User className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="text-left">
            <p className="text-xs font-medium text-white/80">alex.chen</p>
            <p className="text-[10px] text-white/40">Admin</p>
          </div>
          <ChevronDown className="w-3 h-3 text-white/40" />
        </button>
      </div>
    </header>
  );
}
