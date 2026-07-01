# PRD — System Design Playground

## 1. Visão geral

Um playground web onde qualquer pessoa desenha arquiteturas de sistemas
(componentes tipo API Gateway, Load Balancer, Cache, Banco, Queue etc.),
conecta esses componentes visualmente, e opcionalmente exporta/documenta o
resultado. Objetivo duplo:

- **Pessoal:** ferramenta de prática deliberada de system design, sem
  compromisso de prazo — projeto pra intercalar entre ConstruREI e AstroRider.
- **Portfólio:** repositório público no GitHub demonstrando frontend
  avançado (Vue 3 + Vue Flow), modelagem de dados (Postgres via Supabase) e
  raciocínio de produto (specs, não só código).

## 2. Público-alvo

- Eu mesmo, primeiro usuário.
- Outras pessoas estudando pra entrevistas de system design que queiram um
  canvas rápido sem precisar logar em nada.

## 3. Princípios de projeto (não negociáveis)

1. **Fricção de retomada mínima.** Nada de infra que "cai" quando o projeto
   fica parado semanas. Sem Docker em produção, sem serviço pra vigiar.
2. **Frontend-first.** Zero backend próprio no MVP. Supabase resolve
   persistência + auth anônima + RLS.
3. **Anônimo por padrão.** UUID em cookie/localStorage identifica a sessão;
   sem tela de cadastro no MVP.
4. **Código público desde o início.** Toda decisão de segurança assume que
   o repo (incluindo `schema.sql`) é público.

## 4. Escopo do MVP (corte fino — v0)

Isso é deliberadamente menor que a ideia original. Cada item abaixo vira
um spec próprio em `specs/`.

| # | Feature | Está no MVP? |
|---|---------|--------------|
| 1 | Canvas com Vue Flow, componentes fixos (API Gateway, LB, Service, SQL DB, NoSQL DB, Cache, Queue, CDN, Object Storage) | ✅ |
| 2 | Arrastar, conectar, renomear nós | ✅ |
| 3 | Salvar/carregar diagrama (Supabase, vinculado a UUID de sessão) | ✅ |
| 4 | Geração de documentação Markdown a partir do diagrama | ✅ |
| 5 | Export PNG/SVG | ❌ (v1.5) |
| 6 | Auth real (GitHub OAuth) | ❌ (v1.5) |
| 7 | Ícones AWS/Azure/K8s | ❌ (v2) |
| 8 | Validação automática de arquitetura (⚠ regras) | ❌ (v3) |
| 9 | Gerador de arquitetura por prompt (IA) | ❌ (v4) |

## 5. Stack

| Camada | Escolha | Motivo |
|--------|---------|--------|
| Frontend | Vue 3 + Vite + TypeScript | já domina (ConstruREI) |
| UI | Tailwind + shadcn-vue | consistência visual rápida |
| Canvas | Vue Flow | único com suporte real a nós/arestas em Vue |
| Estado | Pinia | padrão do ecossistema Vue |
| Persistência | Supabase (Postgres + RLS) | zero backend próprio, sem infra pra manter viva |
| Deploy | Vercel (frontend) | free tier, zero manutenção |

Sem Spring Boot, sem Docker Compose, sem Cloud Run neste momento. Fica
documentado como "evolução futura" (seção 7), não como dívida.

## 6. Modelo de dados (alto nível)

```sql
-- session_id = UUID gerado no client, sem auth real no MVP
architectures (
  id uuid pk,
  session_id uuid not null,
  name text not null,
  nodes jsonb not null default '[]',
  edges jsonb not null default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
)
```

RLS: `session_id = current_setting('request.jwt.claims')::json->>'session_id'`
(ou equivalente via header custom — detalhado no spec 001).

## 7. Evolução futura (fora do MVP, sem prazo)

- v1.5: Export PNG/SVG, GitHub OAuth opcional
- v2: Ícones de provedores cloud
- v3: Validação automática de arquitetura (regras tipo "cache sem banco")
- v4: Gerar arquitetura a partir de prompt em linguagem natural
- vN: Se algum dia a lógica de validação (v3) ficar pesada demais pro
  client, aí sim considerar backend Spring Boot próprio — reaproveitando
  o schema Postgres do Supabase.

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
