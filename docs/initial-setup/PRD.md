# PRD — System Design Playground

## 1. Visão geral

Um playground web onde qualquer pessoa desenha arquiteturas de sistemas
(componentes tipo API Gateway, Load Balancer, Cache, Banco, Queue etc.),
conecta esses componentes visualmente, e opcionalmente exporta/documenta o
resultado. Objetivo duplo:

- **Pessoal:** ferramenta de prática deliberada de system design, sem
  compromisso de prazo.
- **Portfólio:** repositório público no GitHub demonstrando frontend
  avançado (Vue 3 + Vue Flow) e raciocínio de produto (specs, não só
  código).

## 2. Público-alvo

- Eu mesmo, primeiro usuário.
- Outras pessoas estudando pra entrevistas de system design que queiram um
  canvas rápido sem precisar logar em nada.

## 3. Princípios de projeto (não negociáveis)

1. **Fricção de retomada mínima.** Nada de infra que "cai" quando o projeto
   fica parado semanas. Sem Docker em produção, sem serviço pra vigiar,
   sem backend próprio.
2. **Frontend-first, 100% client-side por agora.** Sem Supabase, sem
   backend, sem conta de usuário no MVP. Persistência via `localStorage`.
3. **Anônimo por padrão.** Nenhum cadastro. Dado do usuário vive só no
   navegador dele.
4. **Código público desde o início.** Toda decisão assume que o repo é
   público.

## 4. Escopo do MVP (corte fino — v0)

Isso é deliberadamente menor que a ideia original. Cada item abaixo vira
um spec próprio em `specs/`.

| # | Feature | Está no MVP? |
|---|---------|--------------|
| 1 | Canvas com Vue Flow, componentes fixos (API Gateway, LB, Service, SQL DB, NoSQL DB, Cache, Queue, CDN, Object Storage) | ✅ |
| 2 | Arrastar, conectar, renomear nós | ✅ |
| 3 | Salvar/carregar diagrama em `localStorage` (limite de 10 designs) | ✅ |
| 4 | Export do diagrama em PNG, JPG e PDF | ✅ |
| 5 | Geração de documentação Markdown a partir do diagrama | ❌ (v1.5) |
| 6 | Persistência remota (Supabase) + acesso multi-dispositivo | ❌ (v1.5) |
| 7 | Auth real (GitHub OAuth) | ❌ (v1.5) |
| 8 | Ícones AWS/Azure/K8s | ❌ (v2) |
| 9 | Validação automática de arquitetura (⚠ regras) | ❌ (v3) |
| 10 | Gerador de arquitetura por prompt (IA) | ❌ (v4) |

## 5. Stack

| Camada | Escolha | Motivo |
|--------|---------|--------|
| Frontend | Vue 3 + Vite + TypeScript | já domina (ConstruREI) |
| UI | Tailwind + shadcn-vue | consistência visual rápida |
| Canvas | Vue Flow | único com suporte real a nós/arestas em Vue |
| Estado | Pinia | padrão do ecossistema Vue |
| Persistência | `localStorage` do navegador | zero infra, zero backend, zero conta |
| Export | `html-to-image` (PNG/JPG) + `jsPDF` (PDF) | screenshot do canvas embutido no formato de saída |
| Deploy | Vercel (frontend) | free tier, zero manutenção |

Sem Spring Boot, sem Docker Compose, sem Cloud Run, sem Supabase neste
momento. Fica documentado como "evolução futura" (seção 7), não como
dívida.

## 6. Modelo de dados (alto nível)

Sem backend/banco no MVP. Cada design salvo é um registro em
`localStorage`, chave própria do app, valor um array de até 10 itens:

```ts
type SavedDesign = {
  id: string          // uuid gerado no client
  name: string
  nodes: Node[]        // formato nativo do Vue Flow
  edges: Edge[]         // formato nativo do Vue Flow
  schemaVersion: number // pra migrar formato sem quebrar saves antigos
  createdAt: string     // ISO
  updatedAt: string      // ISO
}
```

Limite de 10 designs salvos por navegador. Ao atingir o limite, usuário
precisa apagar um existente antes de salvar novo (sem eviction automática
— evita perda de dado surpresa).

## 7. Evolução futura (fora do MVP, sem prazo)

- v1.5: Geração de documentação Markdown, persistência remota via
  Supabase (multi-dispositivo), GitHub OAuth opcional
- v2: Ícones de provedores cloud
- v3: Validação automática de arquitetura (regras tipo "cache sem banco")
- v4: Gerar arquitetura a partir de prompt em linguagem natural
- vN: Se algum dia a lógica de validação (v3) ficar pesada demais pro
  client, aí sim considerar backend próprio.

## 8. Critérios de sucesso do MVP

- Deploy público funcionando na Vercel, acessível sem login.
- Consigo desenhar um diagrama simples (ex: clone simplificado de
  arquitetura de e-commerce) do zero em menos de 3 minutos.
- README do GitHub permite que outra pessoa rode local em < 5 minutos.
- Reabrir o projeto depois de 1 mês parado exige zero reconfiguração de
  infra (só `npm install` e rodar).

## 9. Fora de escopo (explicitamente)

- Multiplayer em tempo real (edição colaborativa simultânea).
- Times/workspaces compartilhados.
- Qualquer coisa que exija servidor sempre ligado.
