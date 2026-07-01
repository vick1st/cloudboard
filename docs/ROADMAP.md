# Roadmap — CloudBoard

## Visão geral

Canvas web onde qualquer pessoa desenha arquiteturas de sistemas
(componentes tipo API Gateway, Load Balancer, Cache, Banco, Queue etc.),
conecta esses componentes visualmente, e salva local no navegador.
Objetivo duplo:

- **Pessoal:** ferramenta de prática deliberada de system design, sem
  compromisso de prazo.
- **Portfólio:** repositório público no GitHub demonstrando frontend
  avançado (Vue 3 + Vue Flow) e raciocínio de produto.

## Público-alvo

- Eu mesmo, primeiro usuário.
- Outras pessoas estudando pra entrevistas de system design que queiram um
  canvas rápido sem precisar logar em nada.

## Princípios de projeto (não negociáveis)

1. **Fricção de retomada mínima.** Nada de infra que "cai" quando o projeto
   fica parado semanas. Sem Docker em produção, sem serviço pra vigiar,
   sem backend próprio.
2. **Frontend-first, 100% client-side por agora.** Sem Supabase, sem
   backend, sem conta de usuário no MVP. Persistência via `localStorage`.
3. **Anônimo por padrão.** Nenhum cadastro. Dado do usuário vive só no
   navegador dele.
4. **Código público desde o início.** Toda decisão assume que o repo é
   público.

## Status atual (MVP)

| Feature | Status |
|---|---|
| Canvas com Vue Flow — 10 componentes fixos (Client, API Gateway, LB, Service, SQL/NoSQL DB, Cache, Queue, CDN, Object Storage) | ✅ Feito |
| Arrastar, conectar, renomear, deletar nós | ✅ Feito |
| Conexões animadas | ✅ Feito |
| Design tokens semânticos (3 camadas + dark mode na infra) | ✅ Feito |
| Salvar/carregar diagrama em `localStorage` (limite de 10 designs) | ✅ Feito |
| Templates prontos (ex: microserviços estilo Netflix) | ✅ Feito |
| Toggle de dark mode na UI | ⏳ Infra pronta, falta o botão |
| Export PNG/JPG/PDF | ❌ v1.5 (gated — exige login) |
| Geração de documentação Markdown a partir do diagrama | ❌ v1.5 |

## Stack

| Camada | Escolha | Motivo |
|--------|---------|--------|
| Frontend | Vue 3 + Vite + TypeScript | ecossistema maduro, produtivo |
| UI | Tailwind v4 + design tokens semânticos próprios | consistência visual, sem lib de componentes externa |
| Canvas | Vue Flow | único com suporte real a nós/arestas em Vue |
| Estado | Pinia | padrão do ecossistema Vue |
| Persistência | `localStorage` do navegador | zero infra, zero backend, zero conta |
| Testes | Vitest + `@vue/test-utils` | unit da lógica de store/service |

Sem Spring Boot, sem Docker Compose, sem Cloud Run, sem Supabase neste
momento. Fica documentado como "evolução futura" abaixo, não como dívida.

## Modelo de dados (localStorage)

Sem backend/banco no MVP. Cada design salvo é um registro no
`localStorage`, chave própria do app, valor um array de até 10 itens:

```ts
type SavedDesign = {
  id: string          // uuid gerado no client
  name: string
  nodes: ArchNode[]     // formato nativo do Vue Flow
  edges: ArchEdge[]      // formato nativo do Vue Flow
  schemaVersion: number // pra migrar formato sem quebrar saves antigos
  createdAt: string     // ISO
  updatedAt: string      // ISO
}
```

Limite de 10 designs salvos por navegador. Ao atingir o limite, usuário
precisa apagar um existente antes de salvar novo (sem eviction automática
— evita perda de dado surpresa).

## Evolução futura (fora do MVP, sem prazo)

- **v1.5:** Login (GitHub OAuth via Supabase), export PNG/JPG/PDF (gated
  por login), geração de documentação Markdown, persistência remota
  multi-dispositivo, toggle de dark mode
- **v2:** Ícones de provedores cloud (AWS/Azure/K8s)
- **v3:** Validação automática de arquitetura (regras tipo "cache sem banco")
- **v4:** Gerar arquitetura a partir de prompt em linguagem natural
- **vN:** Se algum dia a lógica de validação (v3) ficar pesada demais pro
  client, aí sim considerar backend próprio.

## Critérios de sucesso do MVP

- [x] Consigo desenhar um diagrama simples do zero rápido (validado
      manualmente com diagrama real de e-commerce simplificado).
- [x] README permite que outra pessoa rode local em poucos minutos.
- [ ] Deploy público funcionando (Vercel), acessível sem login.
- [x] Reabrir o projeto depois de tempo parado exige zero reconfiguração
      de infra (só `npm install` e rodar).

## Fora de escopo (explicitamente)

- Multiplayer em tempo real (edição colaborativa simultânea).
- Times/workspaces compartilhados.
- Qualquer coisa que exija servidor sempre ligado.
