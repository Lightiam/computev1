import { motion } from 'framer-motion';
import { useStore } from '../store';
import { Globe, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function Services() {
  const { services } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Services</h1>
          <p className="text-sm text-white/40 mt-1">Auto-scaling inference endpoints</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500 hover:bg-violet-400 text-sm font-medium text-white transition-colors shadow-lg shadow-violet-500/20">
          <Globe className="w-4 h-4" />
          Deploy Service
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {services.map((service, i) => (
          <motion.div
            key={service.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 rounded-2xl bg-[#12121a] border border-white/[0.06] hover:border-white/[0.12] transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">{service.name}</h3>
                <p className="text-[10px] text-white/40 mt-0.5">{service.requestedResources} • {service.loadBalancingPolicy}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                service.status === 'READY' ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400' :
                service.status === 'CONTROLLER_INIT' ? 'bg-amber-400/10 border-amber-400/20 text-amber-400' :
                'bg-red-400/10 border-red-400/20 text-red-400'
              }`}>
                {service.status}
              </span>
            </div>

            {/* Endpoint */}
            {service.endpoint && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04] mb-3">
                <ExternalLink className="w-3 h-3 text-white/30" />
                <span className="text-[11px] font-mono text-white/60 flex-1 truncate">{service.endpoint}</span>
                <button className="text-white/30 hover:text-white/60 transition-colors">
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center">
                <p className="text-lg font-bold text-white">{service.replicas}</p>
                <p className="text-[10px] text-white/40">Replicas</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">{service.activeVersions.length}</p>
                <p className="text-[10px] text-white/40">Versions</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">{formatDistanceToNow(new Date(Date.now() - service.uptime * 1000))}</p>
                <p className="text-[10px] text-white/40">Uptime</p>
              </div>
            </div>

            {/* Policy */}
            {service.policy && (
              <div className="px-3 py-2 rounded-lg bg-violet-500/[0.04] border border-violet-500/10">
                <p className="text-[10px] text-violet-400/70 font-mono">{service.policy}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
