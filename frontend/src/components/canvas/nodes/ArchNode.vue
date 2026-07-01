<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { Handle, Position, type NodeProps } from '@vue-flow/core'
import type { ArchNodeData } from '../../../types/diagram'
import { getComponentConfig } from '../../../constants/components'
import { useDiagramStore } from '../../../stores/diagram'

const props = defineProps<NodeProps<ArchNodeData>>()

const store = useDiagramStore()

const config = computed(() => getComponentConfig(props.data.type))

const isEditing = ref(false)
const editValue = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

async function startEditing(): Promise<void> {
  editValue.value = props.data.label
  isEditing.value = true
  await nextTick()
  inputRef.value?.focus()
  inputRef.value?.select()
}

function confirmEditing(): void {
  store.updateNode(props.id, editValue.value)
  isEditing.value = false
}

function cancelEditing(): void {
  isEditing.value = false
}
</script>

<template>
  <div
    class="flex min-w-[140px] items-center gap-2 rounded-lg border-2 px-3 py-2 shadow-sm"
    :class="[config.color, selected ? 'ring-2 ring-action-primary ring-offset-1' : '']"
  >
    <Handle type="target" :position="Position.Left" />

    <component :is="config.icon" class="h-4 w-4 shrink-0" aria-hidden="true" />

    <span v-if="!isEditing" class="truncate text-sm font-medium" @dblclick="startEditing">
      {{ data.label }}
    </span>
    <input
      v-else
      ref="inputRef"
      v-model="editValue"
      type="text"
      aria-label="Editar nome do componente"
      class="min-w-0 flex-1 rounded border border-current bg-white/70 px-1 text-sm font-medium text-inherit outline-none"
      @blur="confirmEditing"
      @keyup.enter="confirmEditing"
      @keyup.esc="cancelEditing"
    />

    <Handle type="source" :position="Position.Right" />
  </div>
</template>
