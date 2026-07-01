# System Design Playground

> Canvas web pra desenhar arquiteturas de sistemas — componentes, conexões
> e documentação automática. Projeto de prática deliberada de system
> design, desenvolvido com spec-driven development.

## Como este repo é organizado

- `PRD.md` — visão de produto, escopo, stack, critérios de sucesso.
- `specs/NNN-nome-da-feature/` — cada feature planejada tem:
  - `spec.md` — o quê e por quê (user stories, critérios de aceite)
  - `plan.md` — como (decisões técnicas, estrutura de pastas)
  - `tasks.md` — checklist executável

Fluxo de trabalho: PRD define o norte → cada spec é uma fatia pequena e
testável → `plan.md` só é escrito depois do `spec.md` estar estável → o
Claude Code trabalha em cima do `tasks.md` de cada spec.

## Specs

| # | Nome | Status |
|---|------|--------|
| 001 | Canvas MVP (walking skeleton, sem persistência) | draft |

## Stack

Vue 3 + Vite + TypeScript + Tailwind + Vue Flow + Pinia + Supabase.
Detalhes e justificativas em `PRD.md`.

## Rodando localmente

```bash
cd frontend
npm install
npm run dev
```

(instruções completas de env vars entram quando o spec 002 — Supabase —
for implementado)
