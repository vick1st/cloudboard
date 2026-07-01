import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSavedDesignsStore } from './savedDesigns'
import { useDiagramStore } from './diagram'
import { MAX_SAVED_DESIGNS } from '../types/persistence'

describe('savedDesigns store', () => {
  beforeEach(() => {
    window.localStorage.clear()
    setActivePinia(createPinia())
  })

  it('saveCurrent sem currentDesignId cria registro novo e seta currentDesignId', () => {
    const diagram = useDiagramStore()
    const saved = useSavedDesignsStore()
    diagram.addNode('service', { x: 0, y: 0 })

    const outcome = saved.saveCurrent('Meu diagrama')

    expect(outcome).toEqual({ ok: true })
    expect(saved.savedDesigns).toHaveLength(1)
    expect(saved.savedDesigns[0]!.name).toBe('Meu diagrama')
    expect(saved.currentDesignId).toBe(saved.savedDesigns[0]!.id)
  })

  it('saveCurrent com currentDesignId sobrescreve o mesmo registro (não duplica)', () => {
    const diagram = useDiagramStore()
    const saved = useSavedDesignsStore()
    diagram.addNode('service', { x: 0, y: 0 })
    saved.saveCurrent('V1')
    const id = saved.currentDesignId

    diagram.addNode('cache', { x: 10, y: 10 })
    const outcome = saved.saveCurrent()

    expect(outcome).toEqual({ ok: true })
    expect(saved.savedDesigns).toHaveLength(1)
    expect(saved.currentDesignId).toBe(id)
    expect(saved.savedDesigns[0]!.nodes).toHaveLength(2)
  })

  it('saveCurrent bloqueia no limite quando é um save novo', () => {
    const diagram = useDiagramStore()
    const saved = useSavedDesignsStore()

    for (let i = 0; i < MAX_SAVED_DESIGNS; i++) {
      saved.saveCurrent(`Design ${i}`)
      saved.newDiagram(() => true)
      diagram.addNode('service', { x: 0, y: 0 })
    }

    const outcome = saved.saveCurrent('Um a mais')

    expect(outcome).toEqual({ ok: false, reason: 'limit-reached' })
    expect(saved.savedDesigns).toHaveLength(MAX_SAVED_DESIGNS)
  })

  it('saveCurrent permite overwrite mesmo com o limite de 10 atingido', () => {
    const diagram = useDiagramStore()
    const saved = useSavedDesignsStore()

    for (let i = 0; i < MAX_SAVED_DESIGNS; i++) {
      saved.saveCurrent(`Design ${i}`)
      saved.newDiagram(() => true)
      diagram.addNode('service', { x: 0, y: 0 })
    }
    saved.load(saved.savedDesigns[0]!.id, () => true)

    diagram.addNode('cache', { x: 1, y: 1 })
    const outcome = saved.saveCurrent()

    expect(outcome).toEqual({ ok: true })
    expect(saved.savedDesigns).toHaveLength(MAX_SAVED_DESIGNS)
  })

  it('saveCurrent cancelado (prompt retorna null) não cria registro', () => {
    const saved = useSavedDesignsStore()

    const outcome = saved.saveCurrent(undefined, () => null)

    expect(outcome).toEqual({ ok: false, reason: 'cancelled' })
    expect(saved.savedDesigns).toHaveLength(0)
  })

  it('load troca nodes/edges do diagramStore pelos do design salvo', () => {
    const diagram = useDiagramStore()
    const saved = useSavedDesignsStore()
    diagram.addNode('service', { x: 0, y: 0 })
    saved.saveCurrent('A')
    saved.newDiagram(() => true)
    diagram.addNode('cache', { x: 1, y: 1 })
    diagram.addNode('queue', { x: 2, y: 2 })
    saved.saveCurrent('B')

    const idA = saved.savedDesigns[0]!.id
    const ok = saved.load(idA, () => true)

    expect(ok).toBe(true)
    expect(diagram.nodes).toHaveLength(1)
    expect(diagram.nodes[0]!.data.type).toBe('service')
  })

  it('load reseta hasUnsavedChanges pra false', () => {
    const diagram = useDiagramStore()
    const saved = useSavedDesignsStore()
    diagram.addNode('service', { x: 0, y: 0 })
    saved.saveCurrent('A')
    saved.newDiagram(() => true)
    diagram.addNode('cache', { x: 1, y: 1 })

    expect(saved.hasUnsavedChanges).toBe(true)
    saved.load(saved.savedDesigns[0]!.id, () => true)
    expect(saved.hasUnsavedChanges).toBe(false)
  })

  it('load pede confirmação quando há mudanças não salvas e aborta se recusado', () => {
    const diagram = useDiagramStore()
    const saved = useSavedDesignsStore()
    diagram.addNode('service', { x: 0, y: 0 })
    saved.saveCurrent('A')
    saved.newDiagram(() => true)
    diagram.addNode('queue', { x: 5, y: 5 })

    const confirmFn = vi.fn().mockReturnValue(false)
    const ok = saved.load(saved.savedDesigns[0]!.id, confirmFn)

    expect(confirmFn).toHaveBeenCalledOnce()
    expect(ok).toBe(false)
    expect(diagram.nodes[0]!.data.type).toBe('queue')
  })

  it('deleteDesign remove o registro e persiste', () => {
    const diagram = useDiagramStore()
    const saved = useSavedDesignsStore()
    diagram.addNode('service', { x: 0, y: 0 })
    saved.saveCurrent('A')
    const id = saved.savedDesigns[0]!.id

    const ok = saved.deleteDesign(id, () => true)

    expect(ok).toBe(true)
    expect(saved.savedDesigns).toHaveLength(0)
  })

  it('deleteDesign do design carregado reseta currentDesignId', () => {
    const diagram = useDiagramStore()
    const saved = useSavedDesignsStore()
    diagram.addNode('service', { x: 0, y: 0 })
    saved.saveCurrent('A')
    const id = saved.currentDesignId!

    saved.deleteDesign(id, () => true)

    expect(saved.currentDesignId).toBeNull()
  })

  it('deleteDesign cancelado não remove nada', () => {
    const diagram = useDiagramStore()
    const saved = useSavedDesignsStore()
    diagram.addNode('service', { x: 0, y: 0 })
    saved.saveCurrent('A')

    const ok = saved.deleteDesign(saved.savedDesigns[0]!.id, () => false)

    expect(ok).toBe(false)
    expect(saved.savedDesigns).toHaveLength(1)
  })

  it('newDiagram limpa o canvas e reseta currentDesignId', () => {
    const diagram = useDiagramStore()
    const saved = useSavedDesignsStore()
    diagram.addNode('service', { x: 0, y: 0 })
    saved.saveCurrent('A')

    const ok = saved.newDiagram(() => true)

    expect(ok).toBe(true)
    expect(diagram.nodes).toHaveLength(0)
    expect(saved.currentDesignId).toBeNull()
  })

  it('hasUnsavedChanges liga ao mutar o diagramStore', () => {
    const diagram = useDiagramStore()
    const saved = useSavedDesignsStore()

    expect(saved.hasUnsavedChanges).toBe(false)
    diagram.addNode('service', { x: 0, y: 0 })
    expect(saved.hasUnsavedChanges).toBe(true)
  })

  it('saveCurrent faz rollback se a escrita no localStorage falhar', () => {
    const diagram = useDiagramStore()
    const saved = useSavedDesignsStore()
    diagram.addNode('service', { x: 0, y: 0 })

    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })

    const outcome = saved.saveCurrent('Vai falhar')

    expect(outcome).toEqual({ ok: false, reason: 'storage-error' })
    expect(saved.savedDesigns).toHaveLength(0)
    expect(saved.currentDesignId).toBeNull()

    setItemSpy.mockRestore()
  })
})
