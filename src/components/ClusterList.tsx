import { motion } from 'framer-motion';
import { useStore } from '../store';
import { Cluster, ClusterStatus } from '../types';
import { Server, Play, Square, Trash2, Clock, MapPin, Cpu, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-2xl bg-[#12121a] border border-white/[0.06] hover:border-white/[0.12] transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{cloudIcons[cluster.cloud] || '☁️'}</span>
          <div>
            <h3 className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">{cluster.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3 h-3 text-white/30" />
              <span className="text-[10px] text-white/40">{cluster.region}{cluster.zone ? ` (${cluster.zone})` : ''}</span>
            </div>
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${status.bg} ${status.color}`}>
          {status.label}
        </span>
      </div>

      {/* Resources */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
          <p className="text-[10px] text-white/30">GPUs</p>
          <p className="text-xs font-medium text-white/80">{cluster.resources.accelerators || 'None'}</p>
        </div>
        <div className="px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
          <p className="text-[10px] text-white/30">Nodes</p>
          <p className="text-xs font-medium text-white/80">{cluster.nodes}</p>
        </div>
      </div>

      {/* GPU Utilization */}
      {cluster.status === 'UP' && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-white/40">GPU Utilization</span>
            <span className="text-[10px] font-medium text-white/60">{cluster.gpuUtilization}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${cluster.gpuUtilization}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className={`h-full rounded-full ${
                cluster.gpuUtilization > 80 ? 'bg-emerald-500' :
                cluster.gpuUtilization > 50 ? 'bg-blue-500' : 'bg-orange-500'
              }`}
            />
          </div>
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center justify-between text-[10px] text-white/30 mb-3">
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDistanceToNow(new Date(cluster.launchedAt), { addSuffix: true })}</span>
        <span>${cluster.totalCost.toFixed(2)} total</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {cluster.status === 'UP' && (
          <>
            <button
              onClick={() => stopCluster(cluster.id)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[10px] text-white/60 hover:text-white hover:bg-white/[0.08] transition-all"
            >
              <Square className="w-3 h-3" /> Stop
            </button>
            <button
              onClick={() => terminateCluster(cluster.id)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/[0.06] border border-red-500/10 text-[10px] text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
            >
              <Trash2 className="w-3 h-3" /> Terminate
            </button>
          </>
        )}
        {cluster.status === 'STOPPED' && (
          <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/10 text-[10px] text-emerald-400/70 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all">
            <Play className="w-3 h-3" /> Start
          </button>
        )}
        {cluster.status === 'INIT' && (
          <div className="flex items-center gap-1.5 text-[10px] text-amber-400/70">
            <div className="w-3 h-3 border-2 border-amber-400/40 border-t-amber-400 rounded-full animate-spin" />
            Provisioning...
          </div>
        )}
        <button className="ml-auto flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] text-white/30 hover:text-white/60 transition-colors">
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}

export function ClusterList() {
  const { clusters } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Clusters</h1>
          <p className="text-sm text-white/40 mt-1">{clusters.length} clusters across {new Set(clusters.map(c => c.cloud)).size} providers</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500 hover:bg-violet-400 text-sm font-medium text-white transition-colors shadow-lg shadow-violet-500/20">
          <Server className="w-4 h-4" />
          Launch Cluster
        </button>
      </div>

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
