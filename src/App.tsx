import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ClusterList } from './components/ClusterList';
import { JobList } from './components/JobList';
import { Services } from './components/Services';
import { LogViewer } from './components/LogViewer';
import { Settings } from './components/Settings';
import { CommandPalette } from './components/CommandCenter';
import { useStore } from './store';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { currentView } = useStore();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'clusters': return <ClusterList />;
      case 'jobs': return <JobList />;
      case 'services': return <Services />;
      case 'logs': return <LogViewer />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#08080d]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <CommandPalette />
    </div>
  );
}

export default App;
