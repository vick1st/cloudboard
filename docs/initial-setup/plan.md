# Plan 001 — Canvas MVP

## Abordagem técnica

Vue 3 + `<script setup>` + TypeScript. Vue Flow como motor de canvas,
Pinia guardando `nodes[]` e `edges[]` no formato que o próprio Vue Flow
espera (evita camada de tradução desnecessária — o "modelo de dados" da
store é literalmente o que a lib consome).

## Estrutura de pastas

```text
frontend/
├── src/
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── FlowCanvas.vue        # wrapper do <VueFlow>
│   │   │   ├── ComponentPalette.vue  # lista lateral arrastável
│   │   │   └── nodes/
│   │   │       └── ArchNode.vue      # nó customizado (ícone + label editável)
│   ├── stores/
│   │   └── diagram.ts                # Pinia: nodes, edges, actions
│   ├── constants/
│   │   └── components.ts             # os 9 tipos fixos (label, cor, ícone)
│   ├── types/
│   │   └── diagram.ts                # tipos TS (ArchNodeData, etc.)
│   ├── App.vue
│   └── main.ts
├── index.html
├── vite.config.ts
├── tailwind.config.ts
└── package.json
```

## Decisões técnicas

- **Nó customizado único** (`ArchNode.vue`) parametrizado por `type` em vez
  de um componente Vue por tipo de componente arquitetural. Reduz
  duplicação — a diferença entre "Cache" e "Queue" é só ícone/cor, vindos
  de `constants/components.ts`.
- **Drag da paleta pro canvas**: usar o padrão oficial do Vue Flow
  (`onDragStart` na paleta com `dataTransfer`, `onDrop` no canvas
  calculando posição via `project()`/`screenToFlowCoordinate`).
- **Sem backend nesta etapa** — a store Pinia é a única fonte de verdade.
  Isso é proposital: o spec 002 troca só a camada de persistência, sem
  tocar no canvas.

## Dependências novas

```json
{
  "@vue-flow/core": "^1.x",
  "@vue-flow/background": "^1.x",
  "@vue-flow/controls": "^1.x",
  "pinia": "^2.x",
  "lucide-vue-next": "^0.x"
}
```

## Milestones

1. Setup do projeto (Vite + Tailwind + Vue Flow rodando, canvas vazio).
2. Paleta lateral + drag-and-drop pro canvas.
3. Conexão entre nós + edição de label + delete.
4. Polish visual (cores por categoria, ícones).

## Riscos conhecidos

- Vue Flow com muitos nós customizados pode ter overhead de reatividade —
  não é preocupação nesse volume (dezenas de nós, não milhares).
- `screenToFlowCoordinate` muda de API entre versões do Vue Flow — checar
  a versão instalada antes de copiar exemplo da doc.
