import type { ArchEdge, ArchNode } from './diagram'

export interface SavedDesign {
  id: string
  name: string
  nodes: ArchNode[]
  edges: ArchEdge[]
  schemaVersion: number
  createdAt: string
  updatedAt: string
}

export const STORAGE_KEY = 'cloudboard:saved-designs:v1'
export const MAX_SAVED_DESIGNS = 10
