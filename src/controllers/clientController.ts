import { Request, Response } from "express";
import { ClientService } from "../services/clientService";
import { sendNewClientMessage, sendUpdateClientMessage } from "../services/messageService";

export class ClientController {
  constructor(private service: ClientService) {}

  create = async (req: Request, res: Response) => {
    try {
      const client = await this.service.createClient(req.body);

      await sendNewClientMessage(client);

      res.status(201).json({ success: true, data: client });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
  update = async (req: Request, res: Response) => {
    try {
      const client = await this.service.updateClient(req.params.id, req.body);
      if (!client)
        return res.status(404).json({ message: "Cliente não encontrado" });

      await sendUpdateClientMessage(client);

      res.json(client);
    } catch (error) {
      res
        .status(400)
        .json({ error: "Erro ao atualizar cliente", details: error });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const client = await this.service.getClientById(req.params.id);
      if (!client)
        return res.status(404).json({ message: "Cliente não encontrado" });
      res.json(client);
    } catch (error) {
      res.status(400).json({ error: "Erro ao buscar cliente", details: error });
    }
  };

  list = async (_req: Request, res: Response) => {
    const clients = await this.service.listClients();
    res.json(clients);
  };
}
