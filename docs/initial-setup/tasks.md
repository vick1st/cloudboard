# Tasks 001 — Canvas MVP

## Setup
- [ ] `npm create vite@latest frontend -- --template vue-ts`
- [ ] Instalar Tailwind, configurar `tailwind.config.ts` + `index.css`
- [ ] Instalar `@vue-flow/core`, `@vue-flow/background`, `@vue-flow/controls`
- [ ] Instalar `pinia`, registrar em `main.ts`
- [ ] Instalar `lucide-vue-next`

## Modelo de dados
- [ ] Definir `types/diagram.ts` (ArchNodeData, ArchNodeType union)
- [ ] Definir `constants/components.ts` com os 9 tipos (label, cor, ícone)
- [ ] Criar `stores/diagram.ts` (nodes, edges, addNode, updateNode,
      removeNode, addEdge, removeEdge)

## Canvas
- [ ] `FlowCanvas.vue` renderizando `<VueFlow>` vazio com background e
      controls
- [ ] `ArchNode.vue` como nó customizado, registrado via `node-types`
- [ ] Conectar store ↔ VueFlow (`v-model` de nodes/edges)

## Paleta
- [ ] `ComponentPalette.vue` listando os 9 tipos com ícone
- [ ] Drag start na paleta (`dataTransfer.setData`)
- [ ] Drop no canvas → calcula posição → `store.addNode()`

## Interações
- [ ] Duplo clique no label → input inline → `store.updateNode()`
- [ ] Delete key remove nó/edge selecionado
- [ ] Conectar dois nós via handle → `store.addEdge()`

## Polish
- [ ] Cor de fundo do nó por categoria (banco, cache, rede, etc.)
- [ ] Ícone lucide correspondente por tipo
- [ ] Testar zoom/pan/fit-view

## Definition of done
- [ ] Todos os critérios de aceite do `spec.md` passam manualmente
- [ ] `npm run build` sem erros
- [ ] Commit seguindo padrão do skill de commit (se for usar o subagent
      já existente no OpenCode)
