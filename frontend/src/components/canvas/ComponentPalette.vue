<script setup lang="ts">
import { ARCH_COMPONENTS } from '../../constants/components'
import type { ArchNodeType } from '../../types/diagram'

function onDragStart(event: DragEvent, type: ArchNodeType): void {
  if (!event.dataTransfer) return
  event.dataTransfer.setData('application/archnode-type', type)
  event.dataTransfer.effectAllowed = 'move'
}
</script>

<template>
  <aside class="flex w-56 flex-col gap-2 border-r border-slate-200 bg-white p-4">
    <h2 class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
      Componentes
    </h2>

    <div
      v-for="item in ARCH_COMPONENTS"
      :key="item.type"
      class="flex cursor-grab items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium shadow-sm transition hover:shadow-md active:cursor-grabbing"
      :class="item.color"
      draggable="true"
      @dragstart="onDragStart($event, item.type)"
    >
      <component :is="item.icon" class="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{{ item.label }}</span>
    </div>
  </aside>
</template>
