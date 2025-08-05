# Design da Arquitetura - Bot Financeiro

Este documento apresenta o design detalhado da arquitetura do **Bot Financeiro**, um sistema integrado que combina WhatsApp (via Evolution API), processamento de IA local (Ollama) e persistência de dados (Supabase).

## 🏗️ Visão Geral da Arquitetura

O sistema segue uma arquitetura em camadas com separação clara de responsabilidades, utilizando padrões como MVC e Repository Pattern para garantir manutenibilidade e escalabilidade.

## 📐 Diagrama de Componentes

```mermaid
graph TB
    %% External Systems
    WA[WhatsApp User]
    EVA[Evolution API]
    
    %% Main Application
    subgraph "Bot Financeiro Application"
        subgraph "HTTP Layer"
            MW[Middlewares]
            RT[Routes]
            CTRL[Controllers]
        end
        
        subgraph "Business Layer"
            SVC[Services]
            subgraph "Service Types"
                SVC_MSG[Message Service]
                SVC_TXN[Transaction Service] 
                SVC_USER[User Service]
                SVC_AI[AI Service]
            end
        end
        
        subgraph "Data Layer"
            MODELS[Models/DTOs]
            PRISMA[Prisma ORM]
        end
        
        subgraph "Integration Layer"
            INT_EVA[Evolution Integration]
            INT_OLLAMA[Ollama Integration]
            INT_DB[Database Integration]
        end
        
        subgraph "Utils & Config"
            UTILS[Utilities]
            CONFIG[Configuration]
        end
    end
    
    %% External Services
    OLLAMA[Ollama Local<br/>LLaMA 3 8B]
    SUPABASE[Supabase<br/>PostgreSQL]
    
    %% Connections
    WA --> EVA
    EVA --> MW
    MW --> RT
    RT --> CTRL
    CTRL --> SVC_MSG
    CTRL --> SVC_TXN
    CTRL --> SVC_USER
    
    SVC_MSG --> SVC_AI
    SVC_AI --> INT_OLLAMA
    INT_OLLAMA --> OLLAMA
    
    SVC --> MODELS
    MODELS --> PRISMA
    PRISMA --> INT_DB
    INT_DB --> SUPABASE
    
    SVC_MSG --> INT_EVA
    INT_EVA --> EVA
    
    SVC --> UTILS
    SVC --> CONFIG
```

## 🔄 Fluxo de Dados

```mermaid
sequenceDiagram
    participant U as User (WhatsApp)
    participant E as Evolution API
    participant C as Controller
    participant S as Service
    participant AI as Ollama
    participant DB as Supabase
    
    U->>E: Mensagem WhatsApp
    E->>C: Webhook HTTP POST
    
    note over C: Validação & Parsing
    C->>S: Processar mensagem
    
    note over S: Buscar contexto do usuário
    S->>DB: Query usuário/sessão
    DB-->>S: Dados do usuário
    
    alt Necessita IA
        S->>AI: Prompt para Ollama
        AI-->>S: Resposta da IA
    end
    
    note over S: Processar regras de negócio
    S->>DB: Salvar transação/log
    
    S-->>C: Resposta processada
    C->>E: Enviar resposta
    E->>U: Mensagem WhatsApp
```

## 🗄️ Modelo de Dados

```mermaid
erDiagram
    USUARIOS_BOT {
        uuid id PK
        string telefone UK
        string nome
        string status
        timestamp created_at
        timestamp updated_at
    }
    
    CATEGORIAS {
        uuid id PK
        string nome
        string tipo
        string cor
        boolean padrao
        uuid usuario_id FK
    }
    
    CONFIGURACOES_USUARIO {
        uuid id PK
        uuid usuario_id FK
        decimal meta_mensal
        boolean alertas_ativos
        string moeda
        string timezone
    }
    
    TRANSACOES {
        uuid id PK
        uuid usuario_id FK
        uuid categoria_id FK
        decimal valor
        string descricao
        string tipo
        date data_transacao
        timestamp created_at
    }
    
    ALERTAS {
        uuid id PK
        uuid usuario_id FK
        string tipo
        string mensagem
        boolean enviado
        timestamp data_envio
    }
    
    SESSOES_CONVERSA {
        uuid id PK
        uuid usuario_id FK
        json contexto
        string estado_atual
        timestamp ultima_interacao
    }
    
    LOGS_INTERACAO {
        uuid id PK
        uuid usuario_id FK
        uuid sessao_id FK
        text mensagem_entrada
        text mensagem_saida
        string tipo_interacao
        json metadata
        timestamp created_at
    }
    
    USUARIOS_BOT ||--o{ CATEGORIAS : "possui"
    USUARIOS_BOT ||--|| CONFIGURACOES_USUARIO : "tem"
    USUARIOS_BOT ||--o{ TRANSACOES : "registra"
    USUARIOS_BOT ||--o{ ALERTAS : "recebe"
    USUARIOS_BOT ||--|| SESSOES_CONVERSA : "mantém"
    USUARIOS_BOT ||--o{ LOGS_INTERACAO : "gera"
    CATEGORIAS ||--o{ TRANSACOES : "categoriza"
    SESSOES_CONVERSA ||--o{ LOGS_INTERACAO : "contém"
```

## 🏛️ Arquitetura em Camadas

### 1. **Presentation Layer** (HTTP)
- **Middlewares**: Autenticação, validação, logging
- **Routes**: Definição de endpoints REST
- **Controllers**: Orchestration e validação de entrada

### 2. **Business Layer** 
- **Services**: Regras de negócio e orquestração
  - `MessageService`: Processamento de mensagens
  - `TransactionService`: Gerenciamento de transações
  - `UserService`: Operações de usuário
  - `AIService`: Integração com IA

### 3. **Data Access Layer**
- **Models/DTOs**: Estruturas de dados tipadas
- **Prisma ORM**: Mapeamento objeto-relacional
- **Repository Pattern**: Abstração de acesso a dados

### 4. **Integration Layer**
- **Evolution Integration**: Cliente para API do WhatsApp
- **Ollama Integration**: Cliente para IA local
- **Database Integration**: Conexões e transações

## 🔧 Tecnologias e Padrões

### Stack 
- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL (Supabase)
- **AI**: Ollama (LLaMA 3 8B)
- **Messaging**: Evolution API (WhatsApp)
- **Containerization**: Docker
- **Testing**: Jest

### Padrões Arquiteturais
- **MVC** (Model-View-Controller)
- **Repository Pattern** para acesso a dados
- **Service Layer** para regras de negócio
- **Dependency Injection** para desacoplamento
- **Event-Driven** para operações assíncronas

## 📁 Estrutura de Diretórios

```
src/
├── config/                 # Configurações de ambiente
│   ├── database.ts
│   ├── ollama.ts
│   └── evolution.ts
├── controllers/            # Controllers HTTP
│   ├── webhook.controller.ts
│   └── health.controller.ts
├── services/              # Lógica de negócio
│   ├── message.service.ts
│   ├── transaction.service.ts
│   ├── user.service.ts
│   └── ai.service.ts
├── repositories/          # Acesso a dados
│   ├── user.repository.ts
│   ├── transaction.repository.ts
│   └── session.repository.ts
├── integrations/          # Integrações externas
│   ├── evolution/
│   │   ├── client.ts
│   │   └── types.ts
│   ├── ollama/
│   │   ├── client.ts
│   │   └── prompts.ts
│   └── database/
│       └── connection.ts
├── models/               # DTOs e Types
│   ├── user.model.ts
│   ├── transaction.model.ts
│   └── message.model.ts
├── middlewares/          # Middlewares Express
│   ├── auth.middleware.ts
│   ├── validation.middleware.ts
│   └── error.middleware.ts
├── routes/               # Definição de rotas
│   ├── webhook.routes.ts
│   └── health.routes.ts
├── utils/                # Utilitários
│   ├── logger.ts
│   ├── validator.ts
│   └── formatter.ts
└── tests/               # Testes
    ├── unit/
    ├── integration/
    └── e2e/
```

## 🔐 Considerações de Segurança

1. **Autenticação**: Webhook tokens para validar origem
2. **Validação**: Sanitização de entrada de dados
3. **Rate Limiting**: Controle de frequência de requisições
4. **Logging**: Auditoria completa de operações
5. **Isolamento**: Containers separados para cada serviço

## 📊 Métricas e Monitoramento

- **Health Checks**: Endpoints de saúde para cada serviço
- **Logging Estruturado**: Winston com níveis de log
- **Métricas de Performance**: Tempo de resposta, throughput
- **Alertas**: Notificações automáticas para falhas

## 🚀 Escalabilidade

- **Horizontal**: Load balancer para múltiplas instâncias
- **Vertical**: Otimização de recursos por container
- **Cache**: Redis para sessões e dados frequentes
- **Queue**: Sistema de filas para processamento assíncrono

---

Este design fornece uma base sólida para desenvolvimento, manutenção e evolução do Bot Financeiro, seguindo as melhores práticas de arquitetura de software.