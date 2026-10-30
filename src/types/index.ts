// Core data models derived from SkyPilot's architecture

export type ClusterStatus = 'INIT' | 'UP' | 'STOPPED' | 'TERMINATED';
export type JobStatus = 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED';
export type ManagedJobStatus = 'SUBMITTED' | 'STARTING' | 'RUNNING' | 'RECOVERING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED';
export type CloudProvider = 'AWS' | 'GCP' | 'Azure' | 'Lambda' | 'Kubernetes' | 'RunPod' | 'CoreWeave' | 'Nebius';
export type ServiceStatus = 'READY' | 'CONTROLLER_INIT' | 'FAILED' | 'SHUTTING_DOWN';

export interface Cluster {
  id: string;
  name: string;
  status: ClusterStatus;
  cloud: CloudProvider;
  region: string;
  zone?: string;
  resources: ResourceSpec;
  launchedAt: number;
  lastUse: string;
  autostop?: number; // minutes
  toDown: boolean;
  userHash: string;
  userName: string;
  costPerHour: number;
  totalCost: number;
  gpuUtilization: number;
  nodes: number;
}

export interface ResourceSpec {
  accelerators?: string; // e.g. "A100:4"
  cpus?: string; // e.g. "8+"
  memory?: string; // e.g. "64+"
  instanceType?: string;
  diskSize?: number; // GiB
  useSpot: boolean;
}

export interface Job {
  id: number;
  name: string;
  clusterId: string;
  clusterName: string;
  status: JobStatus;
  submittedAt: number;
  startedAt?: number;
  endedAt?: number;
  resources: string;
  logPath: string;
  userName: string;
  duration?: number; // seconds
}

export interface ManagedJob {
  id: number;
  name: string;
  status: ManagedJobStatus;
  resources: string;
  submittedAt: number;
  endAt?: number;
  duration?: number;
  recoveryCount: number;
  region?: string;
  cloud?: CloudProvider;
}

export interface Service {
  name: string;
  status: ServiceStatus;
  replicas: number;
  activeVersions: number[];
  endpoint?: string;
  policy?: string;
  requestedResources: string;
  loadBalancingPolicy: string;
  uptime: number;
}

export interface LogEntry {
  timestamp: number;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  source?: string;
}

export interface CommandResult {
  id: string;
  command: string;
  output: string[];
  status: 'success' | 'error' | 'pending';
  timestamp: number;
}

export interface CloudCredential {
  id: string;
  provider: CloudProvider;
  enabled: boolean;
  configured: boolean;
  lastVerified?: number;
  regions: string[];
}

export interface CostBreakdown {
  date: string;
  compute: number;
  storage: number;
  network: number;
  total: number;
}
