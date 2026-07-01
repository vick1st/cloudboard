# Spec 001 — Canvas MVP (walking skeleton)

## Status
`draft` — ainda não implementado

## Objetivo

Ter um canvas funcional onde dá pra arrastar componentes de arquitetura,
conectá-los, e ver o resultado — **sem persistência ainda**. Esse spec
existe pra validar a experiência de uso antes de gastar tempo com
Supabase/schema/RLS. Se o canvas não for gostoso de usar, o resto não
importa.

## Fora de escopo deste spec

- Persistência local (localStorage entra no spec 002)
- Export PNG/JPG/PDF (v1.5, gated por login — fora do MVP)
- Documentação Markdown automática (v1.5, fora do MVP)

## User stories

1. Como usuário, eu abro a página e vejo um canvas vazio com uma paleta
   lateral de componentes disponíveis.
2. Como usuário, eu arrasto um componente da paleta pro canvas e ele
   aparece como um nó.
3. Como usuário, eu conecto dois nós arrastando de um handle a outro,
   formando uma aresta com seta indicando direção do fluxo.
4. Como usuário, eu clico duplo num nó e edito o label (ex: "API Gateway"
   → "Gateway Principal").
5. Como usuário, eu seleciono um nó ou aresta e aperto Delete pra remover.
6. Como usuário, eu vejo visualmente distinção de cor/ícone entre os tipos
   de componente (banco ≠ cache ≠ fila).

## Componentes disponíveis (v0, fixos)

- API Gateway
- Load Balancer
- Service (genérico)
- SQL Database
- NoSQL Database
- Cache
- Queue
- CDN
- Object Storage

Cada um com: label default, cor/categoria, ícone simples (lucide-vue-next
é suficiente, sem SVG customizado por enquanto).

## Critérios de aceite

- [ ] Paleta lateral lista os 9 componentes, cada um arrastável.
- [ ] Drop no canvas cria um nó Vue Flow na posição do cursor.
- [ ] Dois nós conectam por drag entre handles, criando edge com arrowhead.
- [ ] Duplo clique no label do nó habilita edição inline.
- [ ] Delete remove nó/edge selecionado (e edges conectadas ao nó removido).
- [ ] Estado do diagrama vive inteiramente em Pinia (nenhuma chamada de
      rede neste spec).
- [ ] Zoom/pan do canvas funciona (nativo do Vue Flow, só precisa não
      quebrar).

## Não-objetivos explícitos

- Não precisa funcionar em mobile neste spec (desktop-first, ajusta depois
  se fizer sentido).
- Não precisa ter undo/redo ainda.
- Não precisa validar se a conexão "faz sentido" (isso é o spec de v3,
  validação automática).
