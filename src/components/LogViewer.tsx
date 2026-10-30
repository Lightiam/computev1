import { motion } from 'framer-motion';
import { useStore } from '../store';
import { LogEntry } from '../types';
import { Terminal, Download, Search, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

const levelColors: Record<string, string> = {
  INFO: 'text-blue-400',
  WARN: 'text-amber-400',
  ERROR: 'text-red-400',
  DEBUG: 'text-white/30',
};

const levelBg: Record<string, string> = {
  INFO: 'bg-blue-400/10',
  WARN: 'bg-amber-400/10',
  ERROR: 'bg-red-400/10',
  DEBUG: 'bg-white/[0.02]',
};

export function LogViewer() {
  const { logs } = useStore();
  const [filter, setFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [isLive, setIsLive] = useState(true);
  const [liveLogs, setLiveLogs] = useState(logs);

  // Simulate live log streaming
  useEffect(() => {
    if (!isLive) return;
    const messages = [
      { level: 'INFO' as const, message: 'Epoch 1/10 | Step 600/1500 | Loss: 1.98 | LR: 2.5e-4', source: 'train' },
      { level: 'INFO' as const, message: 'Batch processed in 2.3s (throughput: 1,240 samples/s)', source: 'train' },
      { level: 'DEBUG' as const, message: 'Gradient norm: 0.847 | Clipping threshold: 1.0', source: 'train' },
      { level: 'INFO' as const, message: 'Memory allocated: 78.3GB / 80GB (97.9%)', source: 'monitor' },
      { level: 'INFO' as const, message: 'Syncing checkpoint to s3://bucket/checkpoints/step_600.pt', source: 'sync' },
      { level: 'WARN' as const, message: 'Network latency spike: 12ms -> 45ms (us-east-1a)', source: 'monitor' },
      { level: 'INFO' as const, message: 'Epoch 1/10 | Step 750/1500 | Loss: 1.91 | LR: 2.2e-4', source: 'train' },
      { level: 'INFO' as const, message: 'Validation accuracy: 0.847 (improvement: +0.003)', source: 'eval' },
    ];
    
    const interval = setInterval(() => {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      setLiveLogs(prev => [...prev.slice(-50), { ...msg, timestamp: Date.now() }]);
    }, 2000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const filteredLogs = liveLogs.filter(log => {
    if (filter !== 'ALL' && log.level !== filter) return false;
    if (search && !log.message.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Logs</h1>
          <p className="text-sm text-white/40 mt-1">Real-time job output and system logs</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/60 hover:text-white hover:bg-white/[0.06] transition-all">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 flex-1 px-3 py-2 rounded-xl bg-[#12121a] border border-white/[0.06]">
          <Search className="w-3.5 h-3.5 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logs..."
            className="flex-1 bg-transparent text-xs text-white placeholder:text-white/30 outline-none"
          />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#12121a] border border-white/[0.06]">
          {['ALL', 'INFO', 'WARN', 'ERROR'].map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
                filter === level
                  ? 'bg-white/[0.08] text-white'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Log Output */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl bg-[#0a0a0f] border border-white/[0.06] overflow-hidden"
      >
        {/* Terminal Header */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
          </div>
          <span className="text-[10px] text-white/30 font-mono ml-2">sky logs — train-llama-70b</span>
          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={() => setIsLive(!isLive)}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                isLive ? 'text-lightrail bg-lightrail/10' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-lightrail animate-pulse' : 'bg-muted-foreground'}`} />
              {isLive ? 'Live' : 'Paused'}
            </button>
          </div>
        </div>

        {/* Log Lines */}
        <div className="p-4 max-h-[500px] overflow-y-auto font-mono text-xs space-y-0.5 scrollbar-thin">
          {filteredLogs.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              className="flex items-start gap-3 py-0.5 hover:bg-white/[0.02] rounded px-2 -mx-2"
            >
              <span className="text-white/20 text-[10px] w-16 flex-shrink-0 tabular-nums">
                {format(new Date(log.timestamp), 'HH:mm:ss')}
              </span>
              <span className={`text-[10px] w-10 flex-shrink-0 font-semibold ${levelColors[log.level]}`}>
                {log.level}
              </span>
              <span className="text-[10px] text-violet-400/60 w-20 flex-shrink-0 truncate">
                [{log.source}]
              </span>
              <span className="text-white/70 flex-1">{log.message}</span>
            </motion.div>
          ))}
          {/* Cursor */}
          <div className="flex items-center gap-2 py-1">
            <span className="text-white/20 text-[10px] w-16" />
            <span className="text-white/40 text-[10px] w-10" />
            <span className="text-white/20 text-[10px] w-20" />
            <span className="inline-block w-2 h-3.5 bg-violet-400/60 animate-pulse" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
