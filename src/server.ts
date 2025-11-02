import express from "express";
import cors from "cors";
import { connectDatabase } from "./config/database";
import { createRedisClient } from "./config/redisClient";
import { connectRabbitMQ } from "./config/rabbitmq";
import { startClientConsumer } from "./consumers/clientConsumer";
import clientRoutes from "./routes/clientRoutes";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/clients", clientRoutes);

const startServer = async () => {
  try {
    // Conectar ao MongoDB
    await connectDatabase(process.env.MONGO_URI!);

    // Criar cliente Redis
    createRedisClient(process.env.REDIS_URL!);

    // Conectar RabbitMQ
    await connectRabbitMQ();

    // Iniciar consumidor RabbitMQ
    startClientConsumer();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("Erro ao iniciar servidor:", error);
    process.exit(1);
  }
};

startServer();
