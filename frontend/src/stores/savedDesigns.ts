import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useDiagramStore } from './diagram'
import { readAll, writeAll, isStorageAvailable } from '../services/localStorageDesigns'
import { MAX_SAVED_DESIGNS, type SavedDesign } from '../types/persistence'

export type SaveOutcome =
  | { ok: true }
  | { ok: false; reason: 'limit-reached' | 'cancelled' | 'storage-error' }

/**
 * `structuredClone` não lida bem com Proxy reativo do Vue (lança
 * DataCloneError). `nodes`/`edges` são sempre dados planos serializáveis,
 * então clone via JSON resolve e já descarta qualquer reatividade.
 */
function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

export const useSavedDesignsStore = defineStore('savedDesigns', () => {
  const diagramStore = useDiagramStore()

  const storageAvailable = ref(isStorageAvailable())
  const savedDesigns = ref<SavedDesign[]>(storageAvailable.value ? readAll() : [])
  const currentDesignId = ref<string | null>(null)
  const hasUnsavedChanges = ref(false)

  // flush: 'sync' garante que o watcher roda antes da action que disparou a
  // mutação (loadDiagram/clear) continuar — permite corrigir
  // hasUnsavedChanges pra false logo em seguida, na mesma função síncrona.
  watch(
    () => [diagramStore.nodes, diagramStore.edges],
    () => {
      hasUnsavedChanges.value = true
    },
    { deep: true, flush: 'sync' },
  )

  function saveCurrent(
    name?: string,
    promptFn: (message: string) => string | null = window.prompt,
  ): SaveOutcome {
    const now = new Date().toISOString()
    const previousDesigns = savedDesigns.value
    const previousCurrentId = currentDesignId.value

    if (!currentDesignId.value) {
      if (savedDesigns.value.length >= MAX_SAVED_DESIGNS) {
        return { ok: false, reason: 'limit-reached' }
      }

      const resolvedName = name ?? promptFn('Nome do diagrama:')
      if (!resolvedName) {
        return { ok: false, reason: 'cancelled' }
      }

      const design: SavedDesign = {
        id: crypto.randomUUID(),
        name: resolvedName,
        nodes: structuredClone(diagramStore.nodes),
        edges: structuredClone(diagramStore.edges),
        schemaVersion: 1,
        createdAt: now,
        updatedAt: now,
      }
      savedDesigns.value = [...previousDesigns, design]
      currentDesignId.value = design.id
    } else {
      savedDesigns.value = previousDesigns.map((design) =>
        design.id === currentDesignId.value
          ? {
              ...design,
              nodes: structuredClone(diagramStore.nodes),
              edges: structuredClone(diagramStore.edges),
              updatedAt: now,
            }
          : design,
      )
    }

    if (!writeAll(savedDesigns.value)) {
      savedDesigns.value = previousDesigns
      currentDesignId.value = previousCurrentId
      return { ok: false, reason: 'storage-error' }
    }

    hasUnsavedChanges.value = false
    return { ok: true }
  }

  function load(
    id: string,
    confirmFn: (message: string) => boolean = window.confirm,
  ): boolean {
    if (hasUnsavedChanges.value) {
      const confirmed = confirmFn(
        'Você tem mudanças não salvas. Descartar e carregar outro diagrama?',
      )
      if (!confirmed) return false
    }

    const target = savedDesigns.value.find((design) => design.id === id)
    if (!target) return false

    diagramStore.loadDiagram(structuredClone(target.nodes), structuredClone(target.edges))
    currentDesignId.value = id
    hasUnsavedChanges.value = false
    return true
  }

  function deleteDesign(
    id: string,
    confirmFn: (message: string) => boolean = window.confirm,
  ): boolean {
    const target = savedDesigns.value.find((design) => design.id === id)
    if (!target) return false

    const confirmed = confirmFn(
      `Apagar o diagrama "${target.name}"? Essa ação não pode ser desfeita.`,
    )
    if (!confirmed) return false

    const previousDesigns = savedDesigns.value
    const previousCurrentId = currentDesignId.value

    savedDesigns.value = previousDesigns.filter((design) => design.id !== id)
    if (currentDesignId.value === id) {
      currentDesignId.value = null
    }

    if (!writeAll(savedDesigns.value)) {
      savedDesigns.value = previousDesigns
      currentDesignId.value = previousCurrentId
      return false
    }

    return true
  }

  function newDiagram(confirmFn: (message: string) => boolean = window.confirm): boolean {
    if (hasUnsavedChanges.value) {
      const confirmed = confirmFn(
        'Você tem mudanças não salvas. Descartar e começar um novo diagrama?',
      )
      if (!confirmed) return false
    }

    diagramStore.clear()
    currentDesignId.value = null
    hasUnsavedChanges.value = false
    return true
  }

  return {
    savedDesigns,
    currentDesignId,
    hasUnsavedChanges,
    storageAvailable,
    saveCurrent,
    load,
    deleteDesign,
    newDiagram,
  }
})
