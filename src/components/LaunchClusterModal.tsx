import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { X, Server, Cpu, Zap, DollarSign, Check } from 'lucide-react';

interface LaunchClusterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LaunchClusterModal({ isOpen, onClose }: LaunchClusterModalProps) {
  const { launchCluster } = useStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    cloud: 'AWS',
    region: 'us-east-1',
    gpuType: 'A100',
    gpuCount: 4,
    instanceType: 'p4d.24xlarge',
    useSpot: false,
    autostop: 60,
  });

  const clouds = [
    { id: 'AWS', name: 'Amazon Web Services', emoji: '☁️', regions: ['us-east-1', 'us-west-2', 'eu-west-1'] },
    { id: 'GCP', name: 'Google Cloud', emoji: '🌐', regions: ['us-central1', 'us-east1', 'europe-west4'] },
    { id: 'Azure', name: 'Microsoft Azure', emoji: '🔷', regions: ['eastus', 'westus2', 'westeurope'] },
    { id: 'Lambda', name: 'Lambda Cloud', emoji: 'λ', regions: ['us-west-2', 'us-east-1'] },
    { id: 'Kubernetes', name: 'Kubernetes', emoji: '⎈', regions: ['us-west1', 'us-east1'] },
  ];

  const gpuOptions = [
    { type: 'A100', price: 3.5, vram: '80GB' },
    { type: 'H100', price: 5.0, vram: '80GB' },
    { type: 'V100', price: 2.5, vram: '32GB' },
    { type: 'A10G', price: 1.5, vram: '24GB' },
    { type: 'L4', price: 1.0, vram: '24GB' },
  ];

  const handleSubmit = () => {
    const resources = `${formData.gpuType}:${formData.gpuCount}`;
    launchCluster(formData.name, formData.cloud, resources);
    onClose();
  };

  const selectedCloud = clouds.find(c => c.id === formData.cloud);
  const selectedGpu = gpuOptions.find(g => g.type === formData.gpuType);
  const estimatedCost = selectedGpu ? selectedGpu.price * formData.gpuCount : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-card border border-border rounded-lg shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h2 className="text-lg font-semibold text-foreground font-mono">Launch Cluster</h2>
                <p className="text-xs text-muted-foreground mt-0.5 font-mono">Provision GPU compute resources</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-accent transition-colors">
                <X className="w-5 h-5 text-foreground/60" />
              </button>
            </div>

            {/* Progress */}
            <div className="px-6 py-3 border-b border-border bg-card/50">
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium font-mono ${
                      step >= s ? 'bg-lightrail text-lightrail-foreground' : 'bg-accent text-muted-foreground'
                    }`}>
                      {step > s ? <Check className="w-3 h-3" /> : s}
                    </div>
                    <span className={`text-xs font-mono ${step >= s ? 'text-foreground/80' : 'text-muted-foreground'}`}>
                      {s === 1 ? 'Basic' : s === 2 ? 'Resources' : 'Review'}
                    </span>
                    {s < 3 && <div className="w-8 h-px bg-border" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-medium text-foreground/70 mb-2 font-mono">Cluster Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="my-training-cluster"
                      className="w-full px-3 py-2 rounded-lg bg-card/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-lightrail/50 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground/70 mb-2 font-mono">Cloud Provider</label>
                    <div className="grid grid-cols-2 gap-2">
                      {clouds.map((cloud) => (
                        <button
                          key={cloud.id}
                          onClick={() => setFormData({ ...formData, cloud: cloud.id })}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                            formData.cloud === cloud.id
                              ? 'bg-lightrail/10 border-lightrail/30'
                              : 'bg-card/50 border-border hover:bg-accent'
                          }`}
                        >
                          <span className="text-lg">{cloud.emoji}</span>
                          <div className="text-left">
                            <p className="text-xs font-medium text-foreground/80 font-mono">{cloud.name}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">{cloud.regions.length} regions</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-2">Region</label>
                    <select
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-violet-500/50"
                    >
                      {selectedCloud?.regions.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-2">GPU Type</label>
                    <div className="grid grid-cols-1 gap-2">
                      {gpuOptions.map((gpu) => (
                        <button
                          key={gpu.type}
                          onClick={() => setFormData({ ...formData, gpuType: gpu.type })}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                            formData.gpuType === gpu.type
                              ? 'bg-violet-500/10 border-violet-500/30'
                              : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Zap className="w-4 h-4 text-violet-400" />
                            <div className="text-left">
                              <p className="text-xs font-medium text-white/80">{gpu.type}</p>
                              <p className="text-[10px] text-white/40">{gpu.vram} VRAM</p>
                            </div>
                          </div>
                          <span className="text-xs text-white/60">${gpu.price}/hr</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-2">GPU Count</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 4, 8].map((count) => (
                        <button
                          key={count}
                          onClick={() => setFormData({ ...formData, gpuCount: count })}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                            formData.gpuCount === count
                              ? 'bg-violet-500 text-white'
                              : 'bg-white/[0.04] text-white/60 hover:bg-white/[0.06]'
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.useSpot}
                        onChange={(e) => setFormData({ ...formData, useSpot: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-xs text-white/70">Use Spot Instances (lower cost, may be interrupted)</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-2">Auto-stop after idle (minutes)</label>
                    <input
                      type="number"
                      value={formData.autostop}
                      onChange={(e) => setFormData({ ...formData, autostop: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <h3 className="text-sm font-semibold text-white mb-3">Cluster Configuration</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                        <span className="text-xs text-white/60">Name</span>
                        <span className="text-xs text-white/80 font-medium">{formData.name || 'Unnamed'}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                        <span className="text-xs text-white/60">Cloud</span>
                        <span className="text-xs text-white/80 font-medium">{formData.cloud}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                        <span className="text-xs text-white/60">Region</span>
                        <span className="text-xs text-white/80 font-medium">{formData.region}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                        <span className="text-xs text-white/60">GPUs</span>
                        <span className="text-xs text-white/80 font-medium">{formData.gpuCount}x {formData.gpuType}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                        <span className="text-xs text-white/60">Instance Type</span>
                        <span className="text-xs text-white/80 font-medium">{formData.instanceType}</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-xs text-white/60">Auto-stop</span>
                        <span className="text-xs text-white/80 font-medium">{formData.autostop} minutes</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-violet-500/[0.05] border border-violet-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-violet-400" />
                      <span className="text-xs font-medium text-white/80">Estimated Cost</span>
                    </div>
                    <p className="text-2xl font-bold text-white">${estimatedCost.toFixed(2)}<span className="text-sm font-normal text-white/40">/hr</span></p>
                    <p className="text-[10px] text-white/40 mt-1">
                      {formData.useSpot ? 'Spot pricing' : 'On-demand pricing'} • Auto-stop after {formData.autostop}min idle
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-card/50">
              <button
                onClick={() => step > 1 && setStep(step - 1)}
                disabled={step === 1}
                className="px-4 py-2 rounded-lg text-xs font-medium text-foreground/60 hover:text-foreground hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all font-mono"
              >
                Back
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-foreground/60 hover:text-foreground hover:bg-accent transition-all font-mono"
                >
                  Cancel
                </button>
                {step < 3 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    disabled={step === 1 && !formData.name}
                    className="px-4 py-2 rounded-lg bg-lightrail hover:bg-lightrail/90 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium text-lightrail-foreground transition-colors font-mono"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 rounded-lg bg-lightrail hover:bg-lightrail/90 text-xs font-medium text-lightrail-foreground transition-colors font-mono glow-primary"
                  >
                    Launch Cluster
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
