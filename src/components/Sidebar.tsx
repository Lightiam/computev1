import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import {
  LayoutDashboard, Server, Briefcase, Globe, FileText,
  Settings, ChevronLeft, ChevronRight, Zap, Terminal
} from 'lucide-react';

const navItems = [
  { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'clusters' as const, label: 'Clusters', icon: Server },
  { id: 'jobs' as const, label: 'Jobs', icon: Briefcase },
  { id: 'services' as const, label: 'Services', icon: Globe },
  { id: 'logs' as const, label: 'Logs', icon: FileText },
  { id: 'settings' as const, label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const { currentView, setView, sidebarCollapsed, toggleSidebar, setShowCommandPalette } = useStore();

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 72 : 260 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="relative flex flex-col h-full bg-[#0a0a0f] border-r border-white/[0.06] overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/[0.06]">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col"
            >
              <span className="text-sm font-semibold text-white tracking-tight">SkyPilot</span>
              <span className="text-[10px] text-white/40 font-medium">AI Compute Platform</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Command shortcut */}
      <div className="px-3 pt-4 pb-2">
        <button
          onClick={() => setShowCommandPalette(true)}
          className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all group"
        >
          <Terminal className="w-4 h-4 text-white/40 group-hover:text-violet-400 transition-colors" />
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-white/40 group-hover:text-white/70 transition-colors"
              >
                Command ⌘K
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-violet-500/10 border border-violet-500/20 text-violet-300'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-violet-400' : ''}`} />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && !sidebarCollapsed && (
                <motion.div
                  layoutId="activeNav"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="px-3 pb-4">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full py-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all"
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  );
}
