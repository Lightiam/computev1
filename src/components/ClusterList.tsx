import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { Cluster, ClusterStatus } from '../types';
import { Server, Play, Square, Trash2, Clock, MapPin, Cpu, ExternalLink, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { LaunchClusterModal } from './LaunchClusterModal';
import { toast } from './Toast';

const statusConfig: Record<ClusterStatus, { color: string; bg: string; label: string }> = {
  INIT: { color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20', label: 'Initializing' },
  UP: { color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', label: 'Running' },
  STOPPED: { color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20', label: 'Stopped' },
  TERMINATED: { color: 'text-gray-400', bg: 'bg-gray-400/10 border-gray-400/20', label: 'Terminated' },
};

const cloudIcons: Record<string, string> = {
  AWS: '☁️', GCP: '🌐', Azure: '🔷', Lambda: 'λ', Kubernetes: '⎈', CoreWeave: '🔮', RunPod: '🐳', Nebius: '⚡',
};

function ClusterCard({ cluster }: { cluster: Cluster }) {
  const { stopCluster, terminateCluster } = useStore();
  const status = statusConfig[cluster.status];

  const handleStop = () => {
    stopCluster(cluster.id);
    toast.success('Cluster Stopped', `${cluster.name} has been stopped`);
  };

  const handleTerminate = () => {
    terminateCluster(cluster.id);
    toast.warning('Cluster Terminated', `${cluster.name} has been terminated`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-lg bg-card border border-border hover:border-lightrail/30 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{cloudIcons[cluster.cloud] || '☁️'}</span>
          <div>
            <h3 className="text-sm font-semibold text-foreground group-hover:text-lightrail transition-colors font-mono">{cluster.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-mono">{cluster.region}{cluster.zone ? ` (${cluster.zone})` : ''}</span>
            </div>
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border font-mono ${status.bg} ${status.color}`}>
          {status.label}
        </span>
      </div>

      {/* Resources */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="px-2.5 py-1.5 rounded-lg bg-card/50 border border-border">
          <p className="text-[10px] text-muted-foreground font-mono">GPUs</p>
          <p className="text-xs font-medium text-foreground/80 font-mono">{cluster.resources.accelerators || 'None'}</p>
        </div>
        <div className="px-2.5 py-1.5 rounded-lg bg-card/50 border border-border">
          <p className="text-[10px] text-muted-foreground font-mono">Nodes</p>
          <p className="text-xs font-medium text-foreground/80 font-mono">{cluster.nodes}</p>
        </div>
      </div>

      {/* GPU Utilization */}
      {cluster.status === 'UP' && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-muted-foreground font-mono">GPU Utilization</span>
            <span className="text-[10px] font-medium text-foreground/60 font-mono">{cluster.gpuUtilization}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-border overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${cluster.gpuUtilization}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className={`h-full rounded-full ${
                cluster.gpuUtilization > 80 ? 'bg-lightrail' :
                cluster.gpuUtilization > 50 ? 'bg-glow-secondary' : 'bg-amber-400'
              }`}
            />
          </div>
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-3 font-mono">
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDistanceToNow(new Date(cluster.launchedAt), { addSuffix: true })}</span>
        <span>${cluster.totalCost.toFixed(2)} total</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {cluster.status === 'UP' && (
          <>
            <button
              onClick={handleStop}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-accent border border-border text-[10px] text-foreground/60 hover:text-foreground hover:bg-accent/80 transition-all font-mono"
            >
              <Square className="w-3 h-3" /> Stop
            </button>
            <button
              onClick={handleTerminate}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/[0.06] border border-red-500/10 text-[10px] text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all font-mono"
            >
              <Trash2 className="w-3 h-3" /> Terminate
            </button>
          </>
        )}
        {cluster.status === 'STOPPED' && (
          <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-lightrail/[0.06] border border-lightrail/10 text-[10px] text-lightrail/70 hover:text-lightrail hover:bg-lightrail/10 transition-all font-mono">
            <Play className="w-3 h-3" /> Start
          </button>
        )}
        {cluster.status === 'INIT' && (
          <div className="flex items-center gap-1.5 text-[10px] text-lightrail/70 font-mono">
            <div className="w-3 h-3 border-2 border-lightrail/40 border-t-lightrail rounded-full animate-spin" />
            Provisioning...
          </div>
        )}
        <button className="ml-auto flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] text-muted-foreground hover:text-foreground transition-colors">
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}

export function ClusterList() {
  const { clusters } = useStore();
  const [showLaunchModal, setShowLaunchModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight font-mono">Clusters</h1>
          <p className="text-sm text-muted-foreground mt-1 font-mono">{clusters.length} clusters across {new Set(clusters.map(c => c.cloud)).size} providers</p>
        </div>
        <button 
          onClick={() => setShowLaunchModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-lightrail hover:bg-lightrail/90 text-sm font-medium text-lightrail-foreground transition-colors shadow-lg shadow-lightrail/20 font-mono glow-primary"
        >
          <Plus className="w-4 h-4" />
          Launch Cluster
        </button>
      </div>

      <LaunchClusterModal isOpen={showLaunchModal} onClose={() => setShowLaunchModal(false)} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {clusters.map((cluster, i) => (
          <motion.div key={cluster.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <ClusterCard cluster={cluster} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
