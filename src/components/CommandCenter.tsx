import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { CommandResult } from '../types';
import { Terminal, Sparkles, ArrowUp, Loader2, X } from 'lucide-react';

const suggestions = [
  'Launch 4x A100 cluster on AWS',
  'Show all running clusters',
  'Submit training job to llama-train-v3',
  'Stop cluster data-pipeline',
  'Show GPU utilization across all clusters',
  'Launch inference service with auto-scaling',
];

export function CommandCenter() {
  const { commandHistory, addCommand, isCommandExecuting, setCommandExecuting, clusters, launchCluster, stopCluster } = useStore();
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const executeCommand = async (cmd: string) => {
    if (!cmd.trim()) return;
    setCommandExecuting(true);
    setInput('');
    setShowSuggestions(false);

    // Parse command
    const result: CommandResult = {
      id: `cmd-${Date.now()}`,
      command: cmd,
      output: [],
      status: 'pending',
      timestamp: Date.now(),
    };

    // Simulate command execution
    await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));

    const lower = cmd.toLowerCase();
    if (lower.includes('launch') || lower.includes('spin up') || lower.includes('create')) {
      const nameMatch = cmd.match(/(?:cluster\s+)?(\w[\w-]*)/i);
      const name = nameMatch ? nameMatch[1] : `cluster-${Date.now().toString(36)}`;
      const cloud = lower.includes('aws') ? 'AWS' : lower.includes('gcp') ? 'GCP' : lower.includes('azure') ? 'Azure' : lower.includes('lambda') ? 'Lambda' : 'AWS';
      const gpuMatch = cmd.match(/(\d+x?\s*(?:A100|H100|V100|A10G|L4))/i);
      const gpu = gpuMatch ? gpuMatch[1] : 'A100:1';
      launchCluster(name, cloud, gpu);
      result.output = [
        `⚡ Launching cluster "${name}" on ${cloud}...`,
        `   Resources: ${gpu}`,
        `   Status: INIT → Provisioning...`,
        `   Request ID: ${Math.random().toString(36).slice(2, 10)}`,
        `✓ Cluster launch initiated. Use 'sky status' to check progress.`,
      ];
      result.status = 'success';
    } else if (lower.includes('stop')) {
      const clusterName = clusters.find(c => lower.includes(c.name.toLowerCase()));
      if (clusterName) {
        stopCluster(clusterName.id);
        result.output = [`⏹ Stopping cluster "${clusterName.name}"...`, `✓ Cluster stop initiated.`];
        result.status = 'success';
      } else {
        result.output = [`⚠ No matching cluster found. Available: ${clusters.map(c => c.name).join(', ')}`];
        result.status = 'error';
      }
    } else if (lower.includes('status') || lower.includes('show') || lower.includes('list')) {
      const upClusters = clusters.filter(c => c.status === 'UP');
      result.output = [
        `📊 Cluster Status (${clusters.length} total, ${upClusters.length} running):`,
        ...clusters.map(c => `  ${c.status === 'UP' ? '🟢' : c.status === 'STOPPED' ? '🔴' : '🟡'} ${c.name.padEnd(20)} ${c.cloud.padEnd(12)} ${c.status.padEnd(10)} ${c.resources.accelerators || c.resources.cpus || 'CPU'}`),
      ];
      result.status = 'success';
    } else {
      result.output = [
        `🤖 Processing: "${cmd}"`,
        `   Analyzing intent...`,
        `   Mapping to SkyPilot API...`,
        `✓ Command executed successfully.`,
      ];
      result.status = 'success';
    }

    addCommand(result);
    setCommandExecuting(false);
  };

  return (
    <div className="relative">
      {/* Input Area */}
      <div className="relative">
        <div className="flex items-center gap-3 px-4 py-3 bg-[#12121a] border border-white/[0.08] rounded-2xl focus-within:border-violet-500/40 focus-within:shadow-lg focus-within:shadow-violet-500/5 transition-all duration-300">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/20">
            <Sparkles className="w-4 h-4 text-violet-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); setShowSuggestions(e.target.value.length > 0); }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => { if (e.key === 'Enter') executeCommand(input); }}
            placeholder="Describe what you want to do... (e.g., 'Launch 4x A100 on AWS')"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
          />
          <button
            onClick={() => executeCommand(input)}
            disabled={isCommandExecuting || !input.trim()}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-500 hover:bg-violet-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            {isCommandExecuting ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : (
              <ArrowUp className="w-4 h-4 text-white" />
            )}
          </button>
        </div>

        {/* Suggestions dropdown */}
        <AnimatePresence>
          {showSuggestions && input.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute top-full left-0 right-0 mt-2 bg-[#12121a] border border-white/[0.08] rounded-xl overflow-hidden z-50 shadow-2xl"
            >
              {suggestions.filter(s => s.toLowerCase().includes(input.toLowerCase())).slice(0, 4).map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(s); setShowSuggestions(false); executeCommand(s); }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  <Terminal className="w-3.5 h-3.5 text-white/30" />
                  {s}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Command History */}
      <AnimatePresence>
        {commandHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <div ref={scrollRef} className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
              {commandHistory.slice(0, 5).map((cmd) => (
                <motion.div
                  key={cmd.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-xl border ${
                    cmd.status === 'success' ? 'bg-emerald-500/[0.03] border-emerald-500/10' :
                    cmd.status === 'error' ? 'bg-red-500/[0.03] border-red-500/10' :
                    'bg-white/[0.02] border-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-mono text-white/30">$</span>
                    <span className="text-xs font-mono text-white/70">{cmd.command}</span>
                  </div>
                  <div className="space-y-0.5 pl-4">
                    {cmd.output.map((line, i) => (
                      <p key={i} className="text-[11px] font-mono text-white/50 leading-relaxed">{line}</p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CommandPalette() {
  const { showCommandPalette, setShowCommandPalette, setView } = useStore();
  const [query, setQuery] = useState('');

  const actions = [
    { label: 'Go to Dashboard', action: () => setView('dashboard'), icon: '📊' },
    { label: 'View Clusters', action: () => setView('clusters'), icon: '🖥' },
    { label: 'View Jobs', action: () => setView('jobs'), icon: '📋' },
    { label: 'View Services', action: () => setView('services'), icon: '🌐' },
    { label: 'View Logs', action: () => setView('logs'), icon: '📝' },
    { label: 'Settings', action: () => setView('settings'), icon: '⚙️' },
    { label: 'Launch New Cluster', action: () => { setView('clusters'); setShowCommandPalette(false); }, icon: '🚀' },
    { label: 'Submit New Job', action: () => { setView('jobs'); setShowCommandPalette(false); }, icon: '▶️' },
  ];

  const filtered = actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()));

  if (!showCommandPalette) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]"
        onClick={() => setShowCommandPalette(false)}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg bg-[#12121a] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
            />
            <button onClick={() => setShowCommandPalette(false)} className="text-white/30 hover:text-white/60">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="max-h-72 overflow-y-auto p-2">
            {filtered.map((item, i) => (
              <button
                key={i}
                onClick={() => { item.action(); setShowCommandPalette(false); setQuery(''); }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors"
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
