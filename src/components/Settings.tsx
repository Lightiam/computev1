import { motion } from 'framer-motion';
import { useStore } from '../store';
import { CloudCredential } from '../types';
import { Shield, CheckCircle, XCircle, Clock, ExternalLink, Key } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const providerInfo: Record<string, { color: string; emoji: string }> = {
  AWS: { color: 'from-orange-500 to-amber-500', emoji: '☁️' },
  GCP: { color: 'from-blue-500 to-red-500', emoji: '🌐' },
  Azure: { color: 'from-blue-600 to-blue-400', emoji: '🔷' },
  Lambda: { color: 'from-purple-500 to-pink-500', emoji: 'λ' },
  Kubernetes: { color: 'from-blue-500 to-cyan-500', emoji: '⎈' },
  CoreWeave: { color: 'from-violet-500 to-purple-500', emoji: '🔮' },
  RunPod: { color: 'from-green-500 to-emerald-500', emoji: '🐳' },
  Nebius: { color: 'from-yellow-500 to-orange-500', emoji: '⚡' },
};

function CredentialCard({ credential }: { credential: CloudCredential }) {
  const info = providerInfo[credential.provider] || { color: 'from-gray-500 to-gray-400', emoji: '☁️' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-2xl border transition-all ${
        credential.configured
          ? 'bg-[#12121a] border-white/[0.06] hover:border-white/[0.12]'
          : 'bg-white/[0.01] border-white/[0.04] border-dashed'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${info.color} shadow-lg`}>
            <span className="text-sm">{info.emoji}</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{credential.provider}</h3>
            <p className="text-[10px] text-white/40">{credential.regions.length} regions available</p>
          </div>
        </div>
        {credential.configured ? (
          <CheckCircle className="w-5 h-5 text-emerald-400" />
        ) : (
          <XCircle className="w-5 h-5 text-white/20" />
        )}
      </div>

      {credential.configured && credential.lastVerified && (
        <div className="flex items-center gap-1.5 mb-3">
          <Clock className="w-3 h-3 text-white/30" />
          <span className="text-[10px] text-white/40">
            Verified {formatDistanceToNow(new Date(credential.lastVerified), { addSuffix: true })}
          </span>
        </div>
      )}

      {credential.configured ? (
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap gap-1">
            {credential.regions.slice(0, 3).map((r) => (
              <span key={r} className="px-1.5 py-0.5 rounded text-[9px] font-mono text-white/40 bg-white/[0.04] border border-white/[0.06]">
                {r}
              </span>
            ))}
            {credential.regions.length > 3 && (
              <span className="px-1.5 py-0.5 rounded text-[9px] text-white/30">+{credential.regions.length - 3}</span>
            )}
          </div>
          <button className="ml-auto p-1.5 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition-all">
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button className="flex items-center gap-1.5 w-full px-3 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-xs text-violet-400 hover:bg-violet-500/15 transition-all">
          <Key className="w-3.5 h-3.5" />
          Configure credentials
        </button>
      )}
    </motion.div>
  );
}

export function Settings() {
  const { credentials } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
          <p className="text-sm text-white/40 mt-1">Cloud credentials and platform configuration</p>
        </div>
      </div>

      {/* Cloud Providers */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-violet-400" />
          <h2 className="text-sm font-semibold text-white">Cloud Providers</h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-400/10 border border-emerald-400/20 text-emerald-400">
            {credentials.filter(c => c.configured).length} configured
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {credentials.map((cred, i) => (
            <motion.div key={cred.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <CredentialCard credential={cred} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Platform Settings */}
      <div className="p-5 rounded-2xl bg-[#12121a] border border-white/[0.06]">
        <h2 className="text-sm font-semibold text-white mb-4">Platform Settings</h2>
        <div className="space-y-4">
          {[
            { label: 'Auto-stop idle clusters', desc: 'Automatically stop clusters after idle period', enabled: true },
            { label: 'Cost alerts', desc: 'Get notified when spending exceeds threshold', enabled: true },
            { label: 'GPU health monitoring', desc: 'Proactive health checks across GPU fleet', enabled: true },
            { label: 'Managed job recovery', desc: 'Auto-retry failed spot instances', enabled: true },
          ].map((setting, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
              <div>
                <p className="text-sm text-white/80">{setting.label}</p>
                <p className="text-[10px] text-white/40 mt-0.5">{setting.desc}</p>
              </div>
              <button className={`relative w-10 h-5 rounded-full transition-colors ${setting.enabled ? 'bg-violet-500' : 'bg-white/10'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${setting.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
