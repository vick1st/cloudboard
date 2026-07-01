import type { XYPosition } from '@vue-flow/core'

export type ArchNodeType =
  | 'client'
  | 'api-gateway'
  | 'load-balancer'
  | 'service'
  | 'sql-db'
  | 'nosql-db'
  | 'cache'
  | 'queue'
  | 'cdn'
  | 'object-storage'

export interface ArchNodeData {
  label: string
  type: ArchNodeType
}

/** Node.type usado no Vue Flow pra resolver o componente customizado (ArchNode.vue) */
export const ARCH_NODE_VIEW_TYPE = 'archNode'

/**
 * Estrutura mínima consumida pelo Vue Flow (`Node<ArchNodeData>`), reescrita
 * como interface própria pra evitar instanciação de tipo genérico excessiva
 * do TS e manter `data` obrigatório (na lib original é opcional).
 */
export interface ArchNode {
  id: string
  type: typeof ARCH_NODE_VIEW_TYPE
  position: XYPosition
  data: ArchNodeData
}

export interface ArchEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string | null
  targetHandle?: string | null
}
