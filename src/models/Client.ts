import mongoose, { Document, Schema } from "mongoose";

export interface IClient extends Document {
  nome: string;
  email: string;
  telefone: string;
}

const ClientSchema = new Schema<IClient>(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefone: { type: String, required: true },
  },
  { timestamps: true }
);

export const ClientModel = mongoose.model<IClient>("Client", ClientSchema);
