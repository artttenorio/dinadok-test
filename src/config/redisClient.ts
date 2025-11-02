import Redis from "ioredis";

export const createRedisClient = (redisUrl: string) => {
  const client = new Redis(redisUrl);

  client.on("connect", () => console.log(" Redis conectado!"));
  client.on("error", (err) => console.error(" Erro no Redis:", err));

  return client;
};
