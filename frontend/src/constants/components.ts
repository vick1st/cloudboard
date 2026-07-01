import {
  Waypoints,
  Split,
  Box,
  Database,
  Layers,
  Zap,
  ListOrdered,
  Globe,
  HardDrive,
  type LucideProps,
} from '@lucide/vue'
import type { FunctionalComponent } from 'vue'
import type { ArchNodeType } from '../types/diagram'

export type ArchCategory =
  | 'network'
  | 'compute'
  | 'database'
  | 'cache'
  | 'queue'
  | 'storage'

export interface ArchComponentConfig {
  type: ArchNodeType
  label: string
  category: ArchCategory
  icon: FunctionalComponent<LucideProps>
  color: string
}

export const CATEGORY_COLORS: Record<ArchCategory, string> = {
  network: 'bg-blue-100 text-blue-700 border-blue-300',
  compute: 'bg-slate-100 text-slate-700 border-slate-300',
  database: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  cache: 'bg-amber-100 text-amber-700 border-amber-300',
  queue: 'bg-purple-100 text-purple-700 border-purple-300',
  storage: 'bg-rose-100 text-rose-700 border-rose-300',
}

export const ARCH_COMPONENTS: ArchComponentConfig[] = [
  {
    type: 'api-gateway',
    label: 'API Gateway',
    category: 'network',
    icon: Waypoints,
    color: CATEGORY_COLORS.network,
  },
  {
    type: 'load-balancer',
    label: 'Load Balancer',
    category: 'network',
    icon: Split,
    color: CATEGORY_COLORS.network,
  },
  {
    type: 'service',
    label: 'Service',
    category: 'compute',
    icon: Box,
    color: CATEGORY_COLORS.compute,
  },
  {
    type: 'sql-db',
    label: 'SQL Database',
    category: 'database',
    icon: Database,
    color: CATEGORY_COLORS.database,
  },
  {
    type: 'nosql-db',
    label: 'NoSQL Database',
    category: 'database',
    icon: Layers,
    color: CATEGORY_COLORS.database,
  },
  {
    type: 'cache',
    label: 'Cache',
    category: 'cache',
    icon: Zap,
    color: CATEGORY_COLORS.cache,
  },
  {
    type: 'queue',
    label: 'Queue',
    category: 'queue',
    icon: ListOrdered,
    color: CATEGORY_COLORS.queue,
  },
  {
    type: 'cdn',
    label: 'CDN',
    category: 'network',
    icon: Globe,
    color: CATEGORY_COLORS.network,
  },
  {
    type: 'object-storage',
    label: 'Object Storage',
    category: 'storage',
    icon: HardDrive,
    color: CATEGORY_COLORS.storage,
  },
]

export function getComponentConfig(type: ArchNodeType): ArchComponentConfig {
  const config = ARCH_COMPONENTS.find((c) => c.type === type)
  if (!config) {
    throw new Error(`Componente desconhecido: ${type}`)
  }
  return config
}
