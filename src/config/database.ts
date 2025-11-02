import mongoose from "mongoose";

export const connectDatabase = async (mongoUri: string) => {
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB conectado com sucesso!");
  } catch (error) {
    console.error(" Erro ao conectar no MongoDB:", error);
    process.exit(1);
  }
};
