import { getChannel } from "../config/rabbitmq";

const QUEUE_NAME = "clientes_novos";
const QUEUE_UPDATES = "clientes_atualizados";

export const sendNewClientMessage = async (cliente: any) => {
  const channel = getChannel();
  if (!channel) {
    console.error("❌ Canal RabbitMQ não está conectado!");
    return;
  }

  await channel.assertQueue(QUEUE_NAME, { durable: true });
  const message = JSON.stringify({
    action: "CLIENTE_CRIADO",
    data: cliente,
    timestamp: new Date().toISOString(),
  });

  channel.sendToQueue(QUEUE_NAME, Buffer.from(message));
  console.log("📨 Mensagem enviada à fila:", message);
};

export const sendUpdateClientMessage = async (cliente: any) => {
  const channel = getChannel();
  if (!channel) {
    console.error(" Canal RabbitMQ não está conectado!");
    return;
  }

  await channel.assertQueue(QUEUE_UPDATES, { durable: true });
  const message = JSON.stringify({
    action: "CLIENTE_ATUALIZADO",
    data: cliente,
    timestamp: new Date().toISOString(),
  });

  channel.sendToQueue(QUEUE_UPDATES, Buffer.from(message));
  console.log("📨 Mensagem de atualização enviada à fila:", message);
};
