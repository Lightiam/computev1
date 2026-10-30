import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import {
  LayoutDashboard, Server, Briefcase, Globe, FileText,
  Settings, ChevronLeft, ChevronRight, BrainCircuit, Terminal
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
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-lightrail/10 border border-lightrail/20">
          <BrainCircuit className="w-5 h-5 text-lightrail" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col"
            >
              <span className="text-sm font-bold text-foreground tracking-tight font-mono">LightOS</span>
              <span className="text-[10px] text-lightrail font-mono uppercase tracking-wider">Agent-first</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Command shortcut */}
      <div className="px-3 pt-4 pb-2">
        <button
          onClick={() => setShowCommandPalette(true)}
          className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg bg-card/50 border border-border hover:bg-accent hover:border-lightrail/30 transition-all group"
        >
          <Terminal className="w-4 h-4 text-muted-foreground group-hover:text-lightrail transition-colors" />
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-muted-foreground group-hover:text-foreground transition-colors font-mono"
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
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-lightrail/10 border border-lightrail/20 text-lightrail'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent'
              }`}
            >
              <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-lightrail' : ''}`} />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium truncate font-mono"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && !sidebarCollapsed && (
                <motion.div
                  layoutId="activeNav"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-lightrail"
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
          className="flex items-center justify-center w-full py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  );
}
