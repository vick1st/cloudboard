import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Connection, XYPosition } from '@vue-flow/core'
import { ARCH_NODE_VIEW_TYPE, type ArchEdge, type ArchNode, type ArchNodeType } from '../types/diagram'
import { getComponentConfig } from '../constants/components'

export const useDiagramStore = defineStore('diagram', () => {
  const nodes = ref<ArchNode[]>([])
  const edges = ref<ArchEdge[]>([])

  function addNode(type: ArchNodeType, position: XYPosition) {
    const config = getComponentConfig(type)
    const node: ArchNode = {
      id: crypto.randomUUID(),
      type: ARCH_NODE_VIEW_TYPE,
      position,
      data: { type, label: config.label },
    }
    nodes.value.push(node)
    return node
  }

  function updateNode(id: string, label: string) {
    const node = nodes.value.find((n) => n.id === id)
    if (!node) return
    const trimmed = label.trim()
    if (!trimmed) return
    node.data.label = trimmed
  }

  function removeNode(id: string) {
    nodes.value = nodes.value.filter((n) => n.id !== id)
    edges.value = edges.value.filter((e) => e.source !== id && e.target !== id)
  }

  function addEdge(connection: Connection) {
    const edge: ArchEdge = {
      id: crypto.randomUUID(),
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
    }
    edges.value.push(edge)
    return edge
  }

  function removeEdge(id: string) {
    edges.value = edges.value.filter((e) => e.id !== id)
  }

  function loadDiagram(newNodes: ArchNode[], newEdges: ArchEdge[]) {
    nodes.value = newNodes
    edges.value = newEdges
  }

  function clear() {
    nodes.value = []
    edges.value = []
  }

  return {
    nodes,
    edges,
    addNode,
    updateNode,
    removeNode,
    addEdge,
    removeEdge,
    loadDiagram,
    clear,
  }
})
