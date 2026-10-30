import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ClusterList } from './components/ClusterList';
import { JobList } from './components/JobList';
import { Services } from './components/Services';
import { LogViewer } from './components/LogViewer';
import { Settings } from './components/Settings';
import { CommandPalette } from './components/CommandCenter';
import { ToastContainer } from './components/Toast';
import { useStore } from './store';
import { motion, AnimatePresence } from 'framer-motion';

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('LightOS Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'white', background: '#0a0a0a' }}>
          <h1>Something went wrong</h1>
          <pre style={{ color: '#ef4444' }}>{this.state.error?.toString()}</pre>
          <pre style={{ color: '#737373' }}>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  console.log('App component rendering...');
  
  try {
    const { currentView } = useStore();
    console.log('Current view:', currentView);

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
      <ErrorBoundary>
        <div className="flex h-screen w-screen overflow-hidden bg-background">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
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
          </div>
          <CommandPalette />
          <ToastContainer />
        </div>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Error in App component:', error);
    return (
      <div style={{ padding: '40px', color: 'white', background: '#0a0a0a' }}>
        <h1 style={{ color: '#ef4444' }}>App Component Error</h1>
        <pre style={{ color: '#fbbf24' }}>{error instanceof Error ? error.message : String(error)}</pre>
        <pre style={{ color: '#737373', whiteSpace: 'pre-wrap' }}>{error instanceof Error ? error.stack : ''}</pre>
      </div>
    );
  }
}

export default App;
