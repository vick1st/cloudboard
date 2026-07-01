import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDiagramStore } from './diagram'

describe('diagram store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('addNode cria nó com label default e posição', () => {
    const store = useDiagramStore()
    const node = store.addNode('cache', { x: 10, y: 20 })
    expect(store.nodes).toHaveLength(1)
    expect(node.data.label).toBe('Cache')
    expect(node.position).toEqual({ x: 10, y: 20 })
  })

  it('updateNode atualiza o label', () => {
    const store = useDiagramStore()
    const node = store.addNode('service', { x: 0, y: 0 })
    store.updateNode(node.id, 'Gateway Principal')
    expect(store.nodes[0].data.label).toBe('Gateway Principal')
  })

  it('updateNode com label vazio mantém o label anterior', () => {
    const store = useDiagramStore()
    const node = store.addNode('service', { x: 0, y: 0 })
    store.updateNode(node.id, '   ')
    expect(store.nodes[0].data.label).toBe('Service')
  })

  it('addEdge cria edge entre dois nós', () => {
    const store = useDiagramStore()
    const a = store.addNode('service', { x: 0, y: 0 })
    const b = store.addNode('sql-db', { x: 100, y: 0 })
    const edge = store.addEdge({ source: a.id, target: b.id, sourceHandle: null, targetHandle: null })
    expect(store.edges).toHaveLength(1)
    expect(edge.source).toBe(a.id)
    expect(edge.target).toBe(b.id)
  })

  it('removeEdge remove só a edge indicada', () => {
    const store = useDiagramStore()
    const a = store.addNode('service', { x: 0, y: 0 })
    const b = store.addNode('sql-db', { x: 100, y: 0 })
    const edge = store.addEdge({ source: a.id, target: b.id, sourceHandle: null, targetHandle: null })
    store.removeEdge(edge.id)
    expect(store.edges).toHaveLength(0)
    expect(store.nodes).toHaveLength(2)
  })

  it('removeNode remove o nó e as edges conectadas a ele (cascade)', () => {
    const store = useDiagramStore()
    const a = store.addNode('service', { x: 0, y: 0 })
    const b = store.addNode('sql-db', { x: 100, y: 0 })
    const c = store.addNode('cache', { x: 200, y: 0 })
    store.addEdge({ source: a.id, target: b.id, sourceHandle: null, targetHandle: null })
    store.addEdge({ source: b.id, target: c.id, sourceHandle: null, targetHandle: null })

    store.removeNode(b.id)

    expect(store.nodes).toHaveLength(2)
    expect(store.nodes.find((n) => n.id === b.id)).toBeUndefined()
    expect(store.edges).toHaveLength(0)
  })

  it('loadDiagram substitui nodes e edges pelos recebidos', () => {
    const store = useDiagramStore()
    store.addNode('service', { x: 0, y: 0 })

    const incomingNodes = [
      { id: 'n1', type: 'archNode' as const, position: { x: 5, y: 5 }, data: { type: 'cache' as const, label: 'Cache' } },
    ]
    const incomingEdges = [{ id: 'e1', source: 'n1', target: 'n1' }]
    store.loadDiagram(incomingNodes, incomingEdges)

    expect(store.nodes).toEqual(incomingNodes)
    expect(store.edges).toEqual(incomingEdges)
  })

  it('clear esvazia nodes e edges', () => {
    const store = useDiagramStore()
    const a = store.addNode('service', { x: 0, y: 0 })
    const b = store.addNode('sql-db', { x: 100, y: 0 })
    store.addEdge({ source: a.id, target: b.id, sourceHandle: null, targetHandle: null })

    store.clear()

    expect(store.nodes).toHaveLength(0)
    expect(store.edges).toHaveLength(0)
  })
})
