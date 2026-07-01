import { ARCH_NODE_VIEW_TYPE, type ArchEdge, type ArchNode, type ArchNodeType } from '../types/diagram'

export interface DiagramTemplate {
  id: string
  name: string
  nodes: ArchNode[]
  edges: ArchEdge[]
}

function node(id: string, type: ArchNodeType, label: string, x: number, y: number): ArchNode {
  return { id, type: ARCH_NODE_VIEW_TYPE, position: { x, y }, data: { type, label } }
}

function edge(id: string, source: string, target: string): ArchEdge {
  return { id, source, target, animated: true }
}

/**
 * Arquitetura de microserviços estilo Netflix, em 6 camadas (cliente →
 * entrada → gateway → microserviços → mensageria/cache → dados). Serve
 * de ponto de partida pra quem tá estudando system design.
 */
export const NETFLIX_TEMPLATE: DiagramTemplate = {
  id: 'netflix-microservices',
  name: 'Microserviços estilo Netflix',
  nodes: [
    // Camada 1 — Cliente
    node('client', 'client', 'Client', 640, 0),
    node('cdn', 'cdn', 'CDN (Open Connect)', 960, 0),

    // Camada 2 — Entrada
    node('lb', 'load-balancer', 'Load Balancer', 640, 140),

    // Camada 3 — Gateway
    node('gateway', 'api-gateway', 'API Gateway', 640, 280),

    // Camada 4 — Microserviços
    node('auth', 'service', 'Auth Service', 0, 440),
    node('user', 'service', 'User Service', 260, 440),
    node('content', 'service', 'Content Service', 520, 440),
    node('streaming', 'service', 'Streaming Service', 780, 440),
    node('recommendation', 'service', 'Recommendation Service', 1040, 440),
    node('notification', 'service', 'Notification Service', 1300, 440),

    // Camada 5 — Mensageria e cache
    node('cache', 'cache', 'Cache (Redis)', 200, 620),
    node('queue', 'queue', 'Queue (Kafka)', 700, 620),
    node('storage', 'object-storage', 'Object Storage (S3)', 1180, 620),

    // Camada 6 — Dados
    node('sql', 'sql-db', 'SQL Database', 350, 780),
    node('nosql', 'nosql-db', 'NoSQL Database', 900, 780),
  ],
  edges: [
    edge('e-client-cdn', 'client', 'cdn'),
    edge('e-client-lb', 'client', 'lb'),
    edge('e-lb-gateway', 'lb', 'gateway'),

    edge('e-gateway-auth', 'gateway', 'auth'),
    edge('e-gateway-user', 'gateway', 'user'),
    edge('e-gateway-content', 'gateway', 'content'),
    edge('e-gateway-streaming', 'gateway', 'streaming'),
    edge('e-gateway-recommendation', 'gateway', 'recommendation'),
    edge('e-gateway-notification', 'gateway', 'notification'),

    edge('e-auth-sql', 'auth', 'sql'),
    edge('e-user-sql', 'user', 'sql'),
    edge('e-user-cache', 'user', 'cache'),
    edge('e-content-nosql', 'content', 'nosql'),
    edge('e-content-cache', 'content', 'cache'),
    edge('e-streaming-storage', 'streaming', 'storage'),
    edge('e-streaming-queue', 'streaming', 'queue'),
    edge('e-cdn-storage', 'cdn', 'storage'),

    // "usuário assistiu X" -> fila -> notifica recomendação e notificação
    edge('e-queue-recommendation', 'queue', 'recommendation'),
    edge('e-queue-notification', 'queue', 'notification'),
    edge('e-recommendation-nosql', 'recommendation', 'nosql'),
  ],
}

export const DIAGRAM_TEMPLATES: DiagramTemplate[] = [NETFLIX_TEMPLATE]
