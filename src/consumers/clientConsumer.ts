import { getChannel } from "../config/rabbitmq";

const QUEUE_NAME = "clientes_novos";

export const startClientConsumer = async () => {
  const channel = getChannel();
  if (!channel) {
    console.error(" Canal RabbitMQ não está conectado!");
    return;
  }

  await channel.assertQueue(QUEUE_NAME, { durable: true });

  console.log(` Aguardando mensagens na fila "${QUEUE_NAME}"...`);

  channel.consume(
    QUEUE_NAME,
    (msg) => {
      if (msg) {
        const content = msg.content.toString();
        console.log("Mensagem recebida:", content);

        // aqui você pode fazer algo mais — ex: salvar log no banco, enviar email, etc
        channel.ack(msg);
      }
    },
    { noAck: false }
  );
};
