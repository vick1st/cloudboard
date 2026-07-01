<script setup lang="ts">
import { Save, FilePlus, Trash2, Inbox, TriangleAlert } from '@lucide/vue'
import { useSavedDesignsStore } from '../../stores/savedDesigns'
import type { SavedDesign } from '../../types/persistence'

const store = useSavedDesignsStore()

function formatRelativeTime(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime()
  const diffMin = Math.round(diffMs / 60_000)

  if (diffMin < 1) return 'agora'
  if (diffMin < 60) return `há ${diffMin} min`

  const diffHours = Math.round(diffMin / 60)
  if (diffHours < 24) return `há ${diffHours}h`

  const diffDays = Math.round(diffHours / 24)
  return `há ${diffDays}d`
}

function onSave(): void {
  const outcome = store.saveCurrent()
  if (outcome.ok) return

  if (outcome.reason === 'limit-reached') {
    window.alert('Limite de 10 diagramas salvos atingido. Apague um antes de salvar outro.')
  } else if (outcome.reason === 'storage-error') {
    window.alert('Não foi possível salvar — o armazenamento local falhou.')
  }
}

function onLoad(design: SavedDesign): void {
  store.load(design.id)
}

function onDelete(design: SavedDesign, event: Event): void {
  event.stopPropagation()
  store.deleteDesign(design.id)
}

function onNewDiagram(): void {
  store.newDiagram()
}
</script>

<template>
  <aside class="flex w-56 flex-col gap-2 border-l border-border-default bg-surface-default p-4">
    <h2 class="mb-1 text-xs font-semibold uppercase tracking-wide text-text-secondary">
      Meus diagramas
    </h2>

    <div v-if="!store.storageAvailable" class="flex items-start gap-2 rounded-md border border-category-cache-border bg-category-cache-bg p-2 text-xs text-category-cache-text">
      <TriangleAlert class="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>Salvar indisponível neste navegador (armazenamento local bloqueado).</span>
    </div>

    <template v-else>
      <div class="flex gap-2">
        <button
          type="button"
          class="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border-default bg-surface-default px-2 py-1.5 text-sm font-medium text-text-primary shadow-sm transition hover:bg-surface-subtle"
          @click="onSave"
        >
          <Save class="h-4 w-4" aria-hidden="true" />
          Salvar
        </button>
        <button
          type="button"
          class="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border-default bg-surface-default px-2 py-1.5 text-sm font-medium text-text-primary shadow-sm transition hover:bg-surface-subtle"
          @click="onNewDiagram"
        >
          <FilePlus class="h-4 w-4" aria-hidden="true" />
          Novo
        </button>
      </div>

      <div
        v-if="store.savedDesigns.length === 0"
        class="flex flex-col items-center gap-2 rounded-md border border-dashed border-border-default p-4 text-center text-xs text-text-secondary"
      >
        <Inbox class="h-5 w-5" aria-hidden="true" />
        <span>Nenhum diagrama salvo ainda.</span>
      </div>

      <ul v-else class="flex flex-col gap-2">
        <li
          v-for="design in store.savedDesigns"
          :key="design.id"
          class="group flex cursor-pointer items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm shadow-sm transition hover:shadow-md"
          :class="
            design.id === store.currentDesignId
              ? 'border-action-primary bg-action-primary-subtle'
              : 'border-border-default bg-surface-default'
          "
          @click="onLoad(design)"
        >
          <div class="min-w-0">
            <p class="truncate font-medium text-text-primary">{{ design.name }}</p>
            <p class="text-xs text-text-secondary">{{ formatRelativeTime(design.updatedAt) }}</p>
          </div>
          <button
            type="button"
            class="shrink-0 rounded p-1 text-text-secondary opacity-0 transition hover:bg-feedback-error-subtle hover:text-feedback-error group-hover:opacity-100"
            aria-label="Apagar diagrama"
            @click="onDelete(design, $event)"
          >
            <Trash2 class="h-4 w-4" aria-hidden="true" />
          </button>
        </li>
      </ul>
    </template>
  </aside>
</template>
