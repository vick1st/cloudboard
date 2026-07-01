<script setup lang="ts">
import { markRaw, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { VueFlow, useVueFlow, type Connection, type NodeTypesObject } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'
import { useDiagramStore } from '../../stores/diagram'
import { ARCH_NODE_VIEW_TYPE, type ArchNodeType } from '../../types/diagram'
import ArchNode from './nodes/ArchNode.vue'

const store = useDiagramStore()
const { nodes, edges } = storeToRefs(store)

// Nessa versão (1.48.2) a conversão de coordenadas de tela pra flow é feita
// via `project()`, não `screenToFlowCoordinate` (API de versões mais novas).
const { project, getSelectedNodes, getSelectedEdges } = useVueFlow()

const nodeTypes: NodeTypesObject = { [ARCH_NODE_VIEW_TYPE]: markRaw(ArchNode) }

function onDragOver(event: DragEvent): void {
  event.preventDefault()
}

function onDrop(event: DragEvent): void {
  const type = event.dataTransfer?.getData('application/archnode-type') as ArchNodeType | ''
  if (!type) return

  const target = event.currentTarget as HTMLElement
  const bounds = target.getBoundingClientRect()
  const position = project({
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top,
  })

  store.addNode(type, position)
}

function onConnect(connection: Connection): void {
  store.addEdge(connection)
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
}

function onKeyDown(event: KeyboardEvent): void {
  if (event.key !== 'Delete' && event.key !== 'Backspace') return
  if (isEditableTarget(event.target)) return

  for (const node of getSelectedNodes.value) {
    store.removeNode(node.id)
  }
  for (const edge of getSelectedEdges.value) {
    store.removeEdge(edge.id)
  }
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
</script>

<template>
  <div class="h-full w-full" @dragover="onDragOver" @drop="onDrop">
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      :node-types="nodeTypes"
      :delete-key-code="null"
      @connect="onConnect"
    >
      <Background />
      <Controls />
    </VueFlow>
  </div>
</template>
