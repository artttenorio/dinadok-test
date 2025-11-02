import express from "express";
import { connectDatabase } from "./config/database";
import { createRedisClient } from "./config/redisClient";
import { connectRabbitMQ } from "./config/rabbitmq";
import { startClientConsumer } from "./consumers/clientConsumer";
import clientRoutes from "./routes/clientRoutes";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

app.use("/clients", clientRoutes);

const startServer = async () => {
  // Conectar ao MongoDB
  await connectDatabase(process.env.MONGO_URI!);

  // Criar cliente Redis
  const redisClient = createRedisClient(process.env.REDIS_URL!);

  // Conectar RabbitMQ
  await connectRabbitMQ();

  // Iniciar consumidor RabbitMQ
  startClientConsumer();

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(` Servidor rodando em http://localhost:${PORT}`)
  );
};

startServer();
