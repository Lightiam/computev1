import { motion } from 'framer-motion';
import { useStore } from '../store';
import { DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from 'recharts';

export function CostAnalytics() {
  const { costData, clusters } = useStore();

  const totalSpend = costData.reduce((acc, d) => acc + d.total, 0);
  const avgDailySpend = totalSpend / costData.length;
  const maxSpendDay = costData.reduce((max, d) => d.total > max.total ? d : max, costData[0]);
  const minSpendDay = costData.reduce((min, d) => d.total < min.total ? d : min, costData[0]);

  const costByCloud = clusters.reduce((acc, c) => {
    acc[c.cloud] = (acc[c.cloud] || 0) + c.totalCost;
    return acc;
  }, {} as Record<string, number>);

  const cloudData = Object.entries(costByCloud).map(([cloud, cost]) => ({
    cloud,
    cost: Math.round(cost),
  }));

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-[#12121a] border border-white/[0.06]"
        >
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-white/40">Total Spend (7d)</span>
          </div>
          <p className="text-2xl font-bold text-white">${totalSpend.toFixed(0)}</p>
          <p className="text-[10px] text-emerald-400/70 mt-1 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> -12% vs last week
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-2xl bg-[#12121a] border border-white/[0.06]"
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-white/40">Avg Daily</span>
          </div>
          <p className="text-2xl font-bold text-white">${avgDailySpend.toFixed(0)}</p>
          <p className="text-[10px] text-white/40 mt-1">per day average</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-2xl bg-[#12121a] border border-white/[0.06]"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-white/40">Peak Day</span>
          </div>
          <p className="text-2xl font-bold text-white">${maxSpendDay.total}</p>
          <p className="text-[10px] text-white/40 mt-1">{maxSpendDay.date}</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daily Spend Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-2xl bg-[#12121a] border border-white/[0.06]"
        >
          <h3 className="text-sm font-semibold text-white mb-4">Daily Spend Trend</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={costData}>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                  labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                />
                <Line type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Cost by Cloud */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-5 rounded-2xl bg-[#12121a] border border-white/[0.06]"
        >
          <h3 className="text-sm font-semibold text-white mb-4">Cost by Cloud Provider</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cloudData}>
                <XAxis dataKey="cloud" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                  labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                />
                <Bar dataKey="cost" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
