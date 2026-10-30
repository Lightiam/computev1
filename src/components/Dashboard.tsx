import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { CommandCenter } from './CommandCenter';
import { CostAnalytics } from './CostAnalytics';
import { LaunchClusterModal } from './LaunchClusterModal';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Server, Briefcase, DollarSign, Cpu, TrendingUp, Activity, Zap, ArrowUpRight } from 'lucide-react';

export function Dashboard() {
  const { clusters, jobs, managedJobs, costData, setView } = useStore();
  const [showLaunchModal, setShowLaunchModal] = useState(false);

  const upClusters = clusters.filter(c => c.status === 'UP');
  const runningJobs = jobs.filter(j => j.status === 'RUNNING');
  const totalCost = clusters.reduce((acc, c) => acc + c.totalCost, 0);
  const avgGpuUtil = upClusters.length > 0 ? Math.round(upClusters.reduce((acc, c) => acc + c.gpuUtilization, 0) / upClusters.length) : 0;

  const stats = [
    { label: 'Active Clusters', value: upClusters.length, total: clusters.length, icon: Server, color: 'from-violet-500 to-purple-500', change: '+2 this week' },
    { label: 'Running Jobs', value: runningJobs.length, total: jobs.length, icon: Briefcase, color: 'from-blue-500 to-cyan-500', change: '+5 today' },
    { label: 'Total Spend (7d)', value: `$${totalCost.toFixed(0)}`, total: null, icon: DollarSign, color: 'from-emerald-500 to-teal-500', change: '-12% vs last week' },
    { label: 'Avg GPU Util', value: `${avgGpuUtil}%`, total: null, icon: Cpu, color: 'from-orange-500 to-amber-500', change: '+8% improvement' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] text-lightrail mb-2 uppercase tracking-widest">Agent-first infrastructure</p>
          <h1 className="text-2xl font-bold text-foreground tracking-tight font-mono">LightOS <span className="text-muted-foreground">/</span> <span className="text-foreground">Command Center</span></h1>
          <p className="text-sm text-muted-foreground mt-1 font-mono">AI workload orchestration across any cloud</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-lightrail/10 border border-lightrail/20">
            <div className="w-1.5 h-1.5 rounded-full bg-lightrail animate-pulse" />
            <span className="text-xs font-medium text-lightrail font-mono">All systems operational</span>
          </div>
        </div>
      </div>

      {/* Command Center */}
      <CommandCenter />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative p-4 rounded-lg bg-card border border-border overflow-hidden group hover:border-lightrail/30 transition-colors"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-[0.03] rounded-full blur-2xl group-hover:opacity-[0.06] transition-opacity`} />
            <div className="flex items-start justify-between mb-3">
              <div className={`flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br ${stat.color} shadow-lg`}>
                <stat.icon className="w-4.5 h-4.5 text-white" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground tracking-tight font-mono">{stat.value}</p>
              <p className="text-xs text-muted-foreground font-mono">{stat.label}</p>
              {stat.change && <p className="text-[10px] text-lightrail/70 font-medium font-mono">{stat.change}</p>}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Cost Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 p-5 rounded-lg bg-card border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground font-mono">Weekly Compute Spend</h3>
              <p className="text-xs text-muted-foreground mt-0.5 font-mono">Cost breakdown by category</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-lightrail" />Compute</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-glow-secondary" />Storage</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" />Network</span>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={costData}>
                <defs>
                  <linearGradient id="computeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="storageGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="networkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ background: '#171717', border: '1px solid #262626', borderRadius: '8px', fontSize: '12px', fontFamily: 'monospace' }}
                  labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                />
                <Area type="monotone" dataKey="compute" stackId="1" stroke="#06b6d4" fill="url(#computeGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="storage" stackId="1" stroke="#8b5cf6" fill="url(#storageGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="network" stackId="1" stroke="#10b981" fill="url(#networkGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-5 rounded-lg bg-card border border-border"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4 font-mono">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { icon: Zap, text: 'Cluster rl-experiment launched', time: '2m ago', color: 'text-lightrail' },
              { icon: Activity, text: 'Job train-llama-70b running', time: '15m ago', color: 'text-glow-secondary' },
              { icon: TrendingUp, text: 'GPU utilization peaked at 94%', time: '1h ago', color: 'text-emerald-400' },
              { icon: Server, text: 'data-pipeline stopped (idle)', time: '3h ago', color: 'text-amber-400' },
              { icon: Briefcase, text: 'Managed job eval-mmlu succeeded', time: '5h ago', color: 'text-lightrail' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-0.5 ${item.color}`}>
                  <item.icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground/70 truncate font-mono">{item.text}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-5 rounded-lg bg-card border border-border"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4 font-mono">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setShowLaunchModal(true)}
            className="flex flex-col items-start p-3 rounded-lg bg-card/50 border border-border hover:bg-accent hover:border-lightrail/30 transition-all group"
          >
            <span className="text-lg mb-1">🚀</span>
            <span className="text-xs font-medium text-foreground/80 group-hover:text-foreground font-mono">Launch Cluster</span>
            <span className="text-[10px] text-muted-foreground font-mono">Provision GPU compute</span>
          </button>
          <button
            onClick={() => setView('jobs')}
            className="flex flex-col items-start p-3 rounded-lg bg-card/50 border border-border hover:bg-accent hover:border-lightrail/30 transition-all group"
          >
            <span className="text-lg mb-1">▶️</span>
            <span className="text-xs font-medium text-foreground/80 group-hover:text-foreground font-mono">Submit Job</span>
            <span className="text-[10px] text-muted-foreground font-mono">Run training/inference</span>
          </button>
          <button
            onClick={() => setView('services')}
            className="flex flex-col items-start p-3 rounded-lg bg-card/50 border border-border hover:bg-accent hover:border-lightrail/30 transition-all group"
          >
            <span className="text-lg mb-1">🌐</span>
            <span className="text-xs font-medium text-foreground/80 group-hover:text-foreground font-mono">Deploy Service</span>
            <span className="text-[10px] text-muted-foreground font-mono">Auto-scaling endpoint</span>
          </button>
          <button
            onClick={() => setView('dashboard')}
            className="flex flex-col items-start p-3 rounded-lg bg-card/50 border border-border hover:bg-accent hover:border-lightrail/30 transition-all group"
          >
            <span className="text-lg mb-1">💰</span>
            <span className="text-xs font-medium text-foreground/80 group-hover:text-foreground font-mono">View Costs</span>
            <span className="text-[10px] text-muted-foreground font-mono">Spending analytics</span>
          </button>
        </div>
      </motion.div>

      {/* Cost Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <CostAnalytics />
      </motion.div>

      {/* Launch Cluster Modal */}
      <LaunchClusterModal isOpen={showLaunchModal} onClose={() => setShowLaunchModal(false)} />
    </div>
  );
}
