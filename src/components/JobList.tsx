import { motion } from 'framer-motion';
import { useStore } from '../store';
import { Job, JobStatus, ManagedJob, ManagedJobStatus } from '../types';
import { Briefcase, Play, XCircle, Clock, Terminal as TermIcon, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const jobStatusConfig: Record<JobStatus, { color: string; bg: string; icon: typeof Play }> = {
  PENDING: { color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20', icon: Clock },
  RUNNING: { color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20', icon: Play },
  SUCCEEDED: { color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', icon: Play },
  FAILED: { color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20', icon: XCircle },
  CANCELLED: { color: 'text-gray-400', bg: 'bg-gray-400/10 border-gray-400/20', icon: XCircle },
};

const managedStatusConfig: Record<ManagedJobStatus, { color: string; bg: string }> = {
  SUBMITTED: { color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
  STARTING: { color: 'text-blue-300', bg: 'bg-blue-300/10 border-blue-300/20' },
  RUNNING: { color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
  RECOVERING: { color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/20' },
  SUCCEEDED: { color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
  FAILED: { color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' },
  CANCELLED: { color: 'text-gray-400', bg: 'bg-gray-400/10 border-gray-400/20' },
};

function formatDuration(seconds?: number): string {
  if (!seconds) return '—';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function JobList() {
  const { jobs, managedJobs, cancelJob } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight font-mono">Jobs</h1>
          <p className="text-sm text-muted-foreground mt-1 font-mono">Cluster jobs and managed jobs</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-lightrail hover:bg-lightrail/90 text-sm font-medium text-lightrail-foreground transition-colors shadow-lg shadow-lightrail/20 font-mono glow-primary">
          <Briefcase className="w-4 h-4" />
          Submit Job
        </button>
      </div>

      {/* Cluster Jobs */}
      <div className="rounded-lg bg-card border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground font-mono">Cluster Jobs</h2>
          <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">Jobs running on provisioned clusters</p>
        </div>
        <div className="divide-y divide-border/50">
          {jobs.map((job, i) => {
            const status = jobStatusConfig[job.status];
            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 px-5 py-3 hover:bg-accent/50 transition-colors group"
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg border ${status.bg}`}>
                  <status.icon className={`w-3.5 h-3.5 ${status.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground/90 truncate font-mono">{job.name}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">#{job.id}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px] text-muted-foreground font-mono">{job.clusterName}</span>
                    <span className="text-[10px] text-muted-foreground">•</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{job.resources}</span>
                    <span className="text-[10px] text-muted-foreground">•</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{job.userName}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border font-mono ${status.bg} ${status.color}`}>
                    {job.status}
                  </span>
                  <p className="text-[10px] text-muted-foreground mt-1 font-mono">{formatDuration(job.duration)}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {(job.status === 'RUNNING' || job.status === 'PENDING') && (
                    <button
                      onClick={() => cancelJob(job.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-all">
                    <TermIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Managed Jobs */}
      <div className="rounded-lg bg-card border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground font-mono">Managed Jobs</h2>
          <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">Auto-managed jobs with fault tolerance</p>
        </div>
        <div className="divide-y divide-border/50">
          {managedJobs.map((job, i) => {
            const status = managedStatusConfig[job.status];
            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 px-5 py-3 hover:bg-white/[0.02] transition-colors group"
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg border ${status.bg}`}>
                  {job.status === 'RECOVERING' ? (
                    <RefreshCw className={`w-3.5 h-3.5 ${status.color} animate-spin`} />
                  ) : (
                    <Briefcase className={`w-3.5 h-3.5 ${status.color}`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white/90 truncate">{job.name}</span>
                    <span className="text-[10px] font-mono text-white/30">#{job.id}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px] text-white/40">{job.resources}</span>
                    {job.cloud && <span className="text-[10px] text-white/30">• {job.cloud}</span>}
                    {job.recoveryCount > 0 && (
                      <span className="text-[10px] text-orange-400/70 flex items-center gap-0.5">
                        <RefreshCw className="w-2.5 h-2.5" /> {job.recoveryCount} recoveries
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${status.bg} ${status.color}`}>
                    {job.status}
                  </span>
                  <p className="text-[10px] text-white/30 mt-1">{formatDuration(job.duration)}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
