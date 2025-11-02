# 🧩 Sistema de Gerenciamento de Clientes

Aplicação **full-stack** para cadastro e consulta de clientes, com **Node.js/Express + MongoDB + Redis + RabbitMQ** no backend e **React + TypeScript** no frontend.

## 🚀 Tecnologias

- **Backend:** Node.js, Express, TypeScript, Mongoose, Redis, RabbitMQ
- **Frontend:** React, TypeScript, Vite
- **Banco:** MongoDB
- **Infra:** Docker e Docker Compose

## 🏗️ Arquitetura

```
React (http://localhost:5173)
   ↓ REST API
Express (http://localhost:3000)
   ├── MongoDB (Banco de Dados)
   ├── Redis (Cache)
   └── RabbitMQ (Fila de Mensagens)
```

## 📂 Estrutura

```
client-dinadok/
├── src/ (Backend)
│   ├── config/ (MongoDB, Redis, RabbitMQ)
│   ├── models/ (Schemas)
│   ├── services/ (Regras de negócio)
│   ├── controllers/ (Handlers)
│   ├── routes/ (Rotas)
│   ├── consumers/ (RabbitMQ)
│   ├── app.ts / server.ts
│
├── frontend/
│   ├── src/components/ (ClientForm, ClientList)
│   ├── src/services/clientService.ts
│   └── vite.config.ts
│
├── docker-compose.yml
├── Dockerfile
└── package.json
```

## ⚙️ Configuração

### 1️⃣ Instalar dependências

```bash
npm install
cd frontend && npm install && cd ..
```

### 2️⃣ Criar `.env`

```env
MONGO_URI=mongodb://mongo:27017/clientdb
REDIS_URL=redis://redis:6379
PORT=3000
```

### 3️⃣ Iniciar via Docker

```bash
docker-compose up --build
```

Serviços:

- Frontend → http://localhost:5173
- Backend → http://localhost:3000
- MongoDB → mongodb://mongo:27017
- Redis → redis://redis:6379
- RabbitMQ UI → http://localhost:15672 (guest/guest)

## 📡 Endpoints

### GET /clients

Retorna todos os clientes.

### POST /clients

Cria um novo cliente.

```json
{
  "nome": "John Doe",
  "email": "john@example.com",
  "telefone": "123456789"
}
```

## 💡 Fluxo de Criação

1. Usuário envia formulário → POST /clients
2. Backend salva no MongoDB
3. Publica mensagem `CLIENTE_CRIADO` no RabbitMQ
4. Consumer processa a mensagem
5. Frontend atualiza a lista em tempo real

## 🧠 Funcionalidades

### Backend

- CRUD completo com MongoDB
- Cache com Redis
- Fila RabbitMQ com retry automático
- TypeScript e CORS configurados

### Frontend

- Formulário com validação
- Listagem dinâmica de clientes
- UI responsiva com notificações

## 🧰 Comandos

### Backend

```bash
npm run dev      # Dev server
npm run build    # Compila TypeScript
npm start        # Executa build
```

### Frontend

```bash
npm run dev      # Inicia Vite
npm run build    # Build de produção
npm run preview  # Visualiza build
```

## 🩺 Depuração

- RabbitMQ UI: [http://localhost:15672](http://localhost:15672)
- Logs Backend: `docker logs client-dinadok`
- Console Frontend: F12 → aba “Console”

## ⚡ Desempenho

- Cache Redis
- Processamento assíncrono com RabbitMQ
- Retry automático e backoff exponencial
- Índice único (email) no MongoDB

## 🔒 Segurança

- CORS restrito a localhost
- .env fora do versionamento
- Use variáveis de ambiente em produção

## 🧩 Solução de Problemas

**❌ Canal RabbitMQ não conectado:** aguarde, o sistema faz 10 tentativas automáticas.  
**ECONNREFUSED:** use nomes dos serviços (mongo, redis, rabbitmq) no Docker.  
**Frontend sem resposta:** verifique se backend está ativo (`curl http://localhost:3000/clients`).
