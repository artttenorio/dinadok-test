import amqp from "amqplib";

let channel: amqp.Channel | null = null;

const RETRY_INTERVAL = 5000; // 5 seconds
const MAX_RETRIES = 10;

export const connectRabbitMQ = async () => {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      console.log(
        ` Tentando conectar ao RabbitMQ... (tentativa ${
          retries + 1
        }/${MAX_RETRIES})`
      );
      const connection = await amqp.connect("amqp://rabbitmq:5672");
      channel = await connection.createChannel();
      await channel.assertQueue("clientes_novos", { durable: true });
      console.log("✅ Conectado ao RabbitMQ com sucesso!");
      return;
    } catch (error) {
      retries++;
      console.error(
        ` Erro ao conectar ao RabbitMQ (tentativa ${retries}):`,
        error
      );
      if (retries < MAX_RETRIES) {
        console.log(`⏳ Retentando em ${RETRY_INTERVAL / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
      }
    }
  }

  throw new Error(" Falha ao conectar ao RabbitMQ após múltiplas tentativas!");
};

export const getChannel = () => channel;
