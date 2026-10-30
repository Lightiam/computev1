import { motion } from 'framer-motion';
import { useStore } from '../store';
import { CommandCenter } from './CommandCenter';
import { CostAnalytics } from './CostAnalytics';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Server, Briefcase, DollarSign, Cpu, TrendingUp, Activity, Zap, ArrowUpRight } from 'lucide-react';

export function Dashboard() {
  const { clusters, jobs, managedJobs, costData } = useStore();

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
          <h1 className="text-2xl font-bold text-white tracking-tight">Command Center</h1>
          <p className="text-sm text-white/40 mt-1">Orchestrate your AI compute across any cloud</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400">All systems operational</span>
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
            className="relative p-4 rounded-2xl bg-[#12121a] border border-white/[0.06] overflow-hidden group hover:border-white/[0.12] transition-colors"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-[0.03] rounded-full blur-2xl group-hover:opacity-[0.06] transition-opacity`} />
            <div className="flex items-start justify-between mb-3">
              <div className={`flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                <stat.icon className="w-4.5 h-4.5 text-white" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
              <p className="text-xs text-white/40">{stat.label}</p>
              {stat.change && <p className="text-[10px] text-emerald-400/70 font-medium">{stat.change}</p>}
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
          className="lg:col-span-2 p-5 rounded-2xl bg-[#12121a] border border-white/[0.06]"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Weekly Compute Spend</h3>
              <p className="text-xs text-white/40 mt-0.5">Cost breakdown by category</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-violet-500" />Compute</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" />Storage</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-500" />Network</span>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={costData}>
                <defs>
                  <linearGradient id="computeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="storageGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="networkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                  labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                />
                <Area type="monotone" dataKey="compute" stackId="1" stroke="#8b5cf6" fill="url(#computeGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="storage" stackId="1" stroke="#3b82f6" fill="url(#storageGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="network" stackId="1" stroke="#06b6d4" fill="url(#networkGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-5 rounded-2xl bg-[#12121a] border border-white/[0.06]"
        >
          <h3 className="text-sm font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { icon: Zap, text: 'Cluster rl-experiment launched', time: '2m ago', color: 'text-violet-400' },
              { icon: Activity, text: 'Job train-llama-70b running', time: '15m ago', color: 'text-blue-400' },
              { icon: TrendingUp, text: 'GPU utilization peaked at 94%', time: '1h ago', color: 'text-emerald-400' },
              { icon: Server, text: 'data-pipeline stopped (idle)', time: '3h ago', color: 'text-orange-400' },
              { icon: Briefcase, text: 'Managed job eval-mmlu succeeded', time: '5h ago', color: 'text-cyan-400' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-0.5 ${item.color}`}>
                  <item.icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/70 truncate">{item.text}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">{item.time}</p>
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
        className="p-5 rounded-2xl bg-[#12121a] border border-white/[0.06]"
      >
        <h3 className="text-sm font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Launch Cluster', desc: 'Provision GPU compute', emoji: '🚀' },
            { label: 'Submit Job', desc: 'Run training/inference', emoji: '▶️' },
            { label: 'Deploy Service', desc: 'Auto-scaling endpoint', emoji: '🌐' },
            { label: 'View Costs', desc: 'Spending analytics', emoji: '💰' },
          ].map((action, i) => (
            <button
              key={i}
              className="flex flex-col items-start p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all group"
            >
              <span className="text-lg mb-1">{action.emoji}</span>
              <span className="text-xs font-medium text-white/80 group-hover:text-white">{action.label}</span>
              <span className="text-[10px] text-white/30">{action.desc}</span>
            </button>
          ))}
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
    </div>
  );
}
