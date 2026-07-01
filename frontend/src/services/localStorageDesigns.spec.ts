import { describe, it, expect, beforeEach } from 'vitest'
import { readAll, writeAll, isStorageAvailable } from './localStorageDesigns'
import { STORAGE_KEY, type SavedDesign } from '../types/persistence'

function makeDesign(overrides: Partial<SavedDesign> = {}): SavedDesign {
  return {
    id: 'd1',
    name: 'Design 1',
    nodes: [],
    edges: [],
    schemaVersion: 1,
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
    ...overrides,
  }
}

describe('localStorageDesigns', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('readAll retorna array vazio quando não há nada salvo', () => {
    expect(readAll()).toEqual([])
  })

  it('readAll retorna os designs salvos previamente', () => {
    const design = makeDesign()
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([design]))

    expect(readAll()).toEqual([design])
  })

  it('readAll descarta entradas corrompidas sem derrubar a lista inteira', () => {
    const valid = makeDesign({ id: 'valid' })
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([valid, { id: 'sem-nome-e-sem-nodes' }, { random: 'garbage' }]),
    )

    expect(readAll()).toEqual([valid])
  })

  it('readAll retorna array vazio se o JSON estiver totalmente inválido', () => {
    window.localStorage.setItem(STORAGE_KEY, '{not-json')

    expect(readAll()).toEqual([])
  })

  it('writeAll persiste os designs e readAll consegue ler de volta', () => {
    const design = makeDesign({ id: 'persisted' })

    const ok = writeAll([design])

    expect(ok).toBe(true)
    expect(readAll()).toEqual([design])
  })

  it('isStorageAvailable retorna true em ambiente com localStorage funcional', () => {
    expect(isStorageAvailable()).toBe(true)
  })
})
