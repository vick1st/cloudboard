import type { Node, Edge } from '@vue-flow/core'

export type ArchNodeType =
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

export type ArchNode = Node<ArchNodeData>
export type ArchEdge = Edge
