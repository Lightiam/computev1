import { create } from 'zustand';
import { Cluster, Job, ManagedJob, Service, LogEntry, CommandResult, CloudCredential, CostBreakdown } from '../types';
import { mockClusters, mockJobs, mockManagedJobs, mockServices, mockLogs, mockCredentials, mockCostData } from '../data/mockData';

type View = 'dashboard' | 'clusters' | 'jobs' | 'services' | 'logs' | 'settings';

interface AppState {
  // Navigation
  currentView: View;
  setView: (view: View) => void;

  // Data
  clusters: Cluster[];
  jobs: Job[];
  managedJobs: ManagedJob[];
  services: Service[];
  logs: LogEntry[];
  credentials: CloudCredential[];
  costData: CostBreakdown[];

  // Command Center
  commandHistory: CommandResult[];
  addCommand: (cmd: CommandResult) => void;
  isCommandExecuting: boolean;
  setCommandExecuting: (v: boolean) => void;

  // Selected items
  selectedCluster: Cluster | null;
  setSelectedCluster: (c: Cluster | null) => void;
  selectedJob: Job | null;
  setSelectedJob: (j: Job | null) => void;

  // Actions
  launchCluster: (name: string, cloud: string, resources: string) => void;
  stopCluster: (id: string) => void;
  terminateCluster: (id: string) => void;
  submitJob: (name: string, clusterId: string, resources: string) => void;
  cancelJob: (id: number) => void;

  // UI
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  showCommandPalette: boolean;
  setShowCommandPalette: (v: boolean) => void;
}

export const useStore = create<AppState>((set, get) => ({
  currentView: 'dashboard',
  setView: (view) => set({ currentView: view }),

  clusters: mockClusters,
  jobs: mockJobs,
  managedJobs: mockManagedJobs,
  services: mockServices,
  logs: mockLogs,
  credentials: mockCredentials,
  costData: mockCostData,

  commandHistory: [],
  addCommand: (cmd) => set((state) => ({ commandHistory: [cmd, ...state.commandHistory].slice(0, 50) })),
  isCommandExecuting: false,
  setCommandExecuting: (v) => set({ isCommandExecuting: v }),

  selectedCluster: null,
  setSelectedCluster: (c) => set({ selectedCluster: c }),
  selectedJob: null,
  setSelectedJob: (j) => set({ selectedJob: j }),

  launchCluster: (name, cloud, resources) => {
    const newCluster: Cluster = {
      id: `c${Date.now()}`,
      name,
      status: 'INIT',
      cloud: cloud as Cluster['cloud'],
      region: 'us-east-1',
      resources: { accelerators: resources, useSpot: false },
      launchedAt: Date.now(),
      lastUse: `sky launch --infra ${cloud.toLowerCase()} -c ${name}`,
      toDown: false,
      userHash: 'u1',
      userName: 'alex.chen',
      costPerHour: 0,
      totalCost: 0,
      gpuUtilization: 0,
      nodes: 1,
    };
    set((state) => ({ clusters: [...state.clusters, newCluster] }));
    // Simulate status change
    setTimeout(() => {
      set((state) => ({
        clusters: state.clusters.map(c => c.id === newCluster.id ? { ...c, status: 'UP' as const } : c)
      }));
    }, 3000);
  },

  stopCluster: (id) => {
    set((state) => ({
      clusters: state.clusters.map(c => c.id === id ? { ...c, status: 'STOPPED' as const, gpuUtilization: 0, costPerHour: 0 } : c)
    }));
  },

  terminateCluster: (id) => {
    set((state) => ({
      clusters: state.clusters.filter(c => c.id !== id)
    }));
  },

  submitJob: (name, clusterId, resources) => {
    const cluster = get().clusters.find(c => c.id === clusterId);
    if (!cluster) return;
    const newJob: Job = {
      id: Date.now(),
      name,
      clusterId,
      clusterName: cluster.name,
      status: 'PENDING',
      submittedAt: Date.now(),
      resources,
      logPath: `/sky/logs/${Date.now()}.log`,
      userName: 'alex.chen',
    };
    set((state) => ({ jobs: [...state.jobs, newJob] }));
    // Simulate job starting
    setTimeout(() => {
      set((state) => ({
        jobs: state.jobs.map(j => j.id === newJob.id ? { ...j, status: 'RUNNING' as const, startedAt: Date.now() } : j)
      }));
    }, 2000);
  },

  cancelJob: (id) => {
    set((state) => ({
      jobs: state.jobs.map(j => j.id === id ? { ...j, status: 'CANCELLED' as const, endedAt: Date.now() } : j)
    }));
  },

  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  showCommandPalette: false,
  setShowCommandPalette: (v) => set({ showCommandPalette: v }),
}));
