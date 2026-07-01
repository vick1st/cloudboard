import {
  User,
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
  | 'client'
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
  client: 'bg-category-client-bg text-category-client-text border-category-client-border',
  network: 'bg-category-network-bg text-category-network-text border-category-network-border',
  compute: 'bg-category-compute-bg text-category-compute-text border-category-compute-border',
  database: 'bg-category-database-bg text-category-database-text border-category-database-border',
  cache: 'bg-category-cache-bg text-category-cache-text border-category-cache-border',
  queue: 'bg-category-queue-bg text-category-queue-text border-category-queue-border',
  storage: 'bg-category-storage-bg text-category-storage-text border-category-storage-border',
}

export const ARCH_COMPONENTS: ArchComponentConfig[] = [
  {
    type: 'client',
    label: 'Client',
    category: 'client',
    icon: User,
    color: CATEGORY_COLORS.client,
  },
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
