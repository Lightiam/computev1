import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { CloudCredential } from '../types';
import { Shield, CheckCircle, XCircle, Clock, ExternalLink, Key } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from './Toast';

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

  const handleConfigure = () => {
    toast.info(`Configure ${credential.provider}`, 'Opening credential setup...');
  };

  const handleVerify = () => {
    toast.success(`${credential.provider} Verified`, 'Credentials are valid and up to date');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg border transition-all ${
        credential.configured
          ? 'bg-card border-border hover:border-lightrail/30'
          : 'bg-card/50 border-border border-dashed hover:border-lightrail/20'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${info.color} shadow-lg`}>
            <span className="text-sm">{info.emoji}</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground font-mono">{credential.provider}</h3>
            <p className="text-[10px] text-muted-foreground font-mono">{credential.regions.length} regions available</p>
          </div>
        </div>
        {credential.configured ? (
          <CheckCircle className="w-5 h-5 text-lightrail" />
        ) : (
          <XCircle className="w-5 h-5 text-muted-foreground" />
        )}
      </div>

      {credential.configured && credential.lastVerified && (
        <div className="flex items-center gap-1.5 mb-3">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground font-mono">
            Verified {formatDistanceToNow(new Date(credential.lastVerified), { addSuffix: true })}
          </span>
        </div>
      )}

      {credential.configured ? (
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap gap-1 flex-1">
            {credential.regions.slice(0, 3).map((r) => (
              <span key={r} className="px-1.5 py-0.5 rounded text-[9px] font-mono text-muted-foreground bg-accent border border-border">
                {r}
              </span>
            ))}
            {credential.regions.length > 3 && (
              <span className="px-1.5 py-0.5 rounded text-[9px] text-muted-foreground font-mono">+{credential.regions.length - 3}</span>
            )}
          </div>
          <button 
            onClick={handleVerify}
            className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-lightrail transition-all"
            title="Verify credentials"
          >
            <CheckCircle className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-all">
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button 
          onClick={handleConfigure}
          className="flex items-center gap-1.5 w-full px-3 py-2 rounded-lg bg-lightrail/10 border border-lightrail/20 text-xs text-lightrail hover:bg-lightrail/15 transition-all font-mono"
        >
          <Key className="w-3.5 h-3.5" />
          Configure credentials
        </button>
      )}
    </motion.div>
  );
}

export function Settings() {
  const { credentials } = useStore();
  const [settings, setSettings] = useState({
    autoStop: true,
    costAlerts: true,
    gpuHealth: true,
    jobRecovery: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    const labels = {
      autoStop: 'Auto-stop idle clusters',
      costAlerts: 'Cost alerts',
      gpuHealth: 'GPU health monitoring',
      jobRecovery: 'Managed job recovery',
    };
    const newState = !settings[key];
    toast.info(
      `${labels[key]} ${newState ? 'Enabled' : 'Disabled'}`,
      newState ? 'Setting is now active' : 'Setting has been turned off'
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight font-mono">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1 font-mono">Cloud credentials and platform configuration</p>
        </div>
      </div>

      {/* Cloud Providers */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-lightrail" />
          <h2 className="text-sm font-semibold text-foreground font-mono">Cloud Providers</h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-lightrail/10 border border-lightrail/20 text-lightrail font-mono">
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
      <div className="p-5 rounded-lg bg-card border border-border">
        <h2 className="text-sm font-semibold text-foreground mb-4 font-mono">Platform Settings</h2>
        <div className="space-y-4">
          {[
            { key: 'autoStop' as const, label: 'Auto-stop idle clusters', desc: 'Automatically stop clusters after idle period' },
            { key: 'costAlerts' as const, label: 'Cost alerts', desc: 'Get notified when spending exceeds threshold' },
            { key: 'gpuHealth' as const, label: 'GPU health monitoring', desc: 'Proactive health checks across GPU fleet' },
            { key: 'jobRecovery' as const, label: 'Managed job recovery', desc: 'Auto-retry failed spot instances' },
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div>
                <p className="text-sm text-foreground/80 font-mono">{setting.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">{setting.desc}</p>
              </div>
              <button 
                onClick={() => toggleSetting(setting.key)}
                className={`relative w-10 h-5 rounded-full transition-colors ${settings[setting.key] ? 'bg-lightrail' : 'bg-accent'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-foreground shadow transition-transform ${settings[setting.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
