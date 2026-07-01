import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useDiagramStore } from './diagram'
import { readAll, writeAll, isStorageAvailable } from '../services/localStorageDesigns'
import { MAX_SAVED_DESIGNS, type SavedDesign } from '../types/persistence'
import type { DiagramTemplate } from '../constants/templates'

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

  // Fingerprint só com os campos que representam "conteúdo do usuário" —
  // Vue Flow muta os mesmos objetos de node/edge pra guardar bookkeeping
  // interno (dimensions, selected, dragging, zIndex etc) e re-sincroniza o
  // array inteiro via v-model, reatribuindo `nodes.value`/`edges.value`
  // mesmo sem mudança real de conteúdo. Um watch "dispara em qualquer
  // trigger" pegaria isso como se fosse edição do usuário. Comparar o
  // fingerprint SERIALIZADO contra o último valor conhecido (em vez de só
  // reagir a "algo mudou") filtra esses falsos-positivos da lib.
  function computeFingerprint(): string {
    return JSON.stringify({
      nodes: diagramStore.nodes.map((n) => ({
        id: n.id,
        type: n.data.type,
        label: n.data.label,
        x: n.position.x,
        y: n.position.y,
      })),
      edges: diagramStore.edges.map((e) => ({ id: e.id, source: e.source, target: e.target })),
    })
  }

  const lastSyncedFingerprint = ref(computeFingerprint())

  function markSynced(): void {
    lastSyncedFingerprint.value = computeFingerprint()
    hasUnsavedChanges.value = false
  }

  // flush: 'sync' garante que o watcher roda antes da action que disparou a
  // mutação (loadDiagram/clear) continuar — permite corrigir via
  // `markSynced()` logo em seguida, na mesma função síncrona.
  watch(
    () => [diagramStore.nodes, diagramStore.edges],
    () => {
      hasUnsavedChanges.value = computeFingerprint() !== lastSyncedFingerprint.value
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
        nodes: deepClone(diagramStore.nodes),
        edges: deepClone(diagramStore.edges),
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
              nodes: deepClone(diagramStore.nodes),
              edges: deepClone(diagramStore.edges),
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

    markSynced()
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

    diagramStore.loadDiagram(deepClone(target.nodes), deepClone(target.edges))
    currentDesignId.value = id
    markSynced()
    return true
  }

  function loadTemplate(
    template: DiagramTemplate,
    confirmFn: (message: string) => boolean = window.confirm,
  ): boolean {
    if (hasUnsavedChanges.value) {
      const confirmed = confirmFn(
        'Você tem mudanças não salvas. Descartar e carregar o exemplo?',
      )
      if (!confirmed) return false
    }

    diagramStore.loadDiagram(deepClone(template.nodes), deepClone(template.edges))
    currentDesignId.value = null
    markSynced()
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
    markSynced()
    return true
  }

  return {
    savedDesigns,
    currentDesignId,
    hasUnsavedChanges,
    storageAvailable,
    saveCurrent,
    load,
    loadTemplate,
    deleteDesign,
    newDiagram,
  }
})
