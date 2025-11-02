import { ClientModel, IClient } from "../models/Client";
import { CacheClient } from "../cache/cacheClient";

export class ClientService {
  private cache: CacheClient;

  constructor(cache: CacheClient) {
    this.cache = cache;
  }

  async createClient(data: IClient) {
    const client = await ClientModel.create(data);
    return client;
  }

  async updateClient(id: string, data: Partial<IClient>) {
    const client = await ClientModel.findByIdAndUpdate(id, data, { new: true });
    if (client) await this.cache.set(`client:${id}`, client);
    return client;
  }

  async getClientById(id: string) {
    const cached = await this.cache.get<IClient>(`client:${id}`);
    if (cached) return cached;

    const client = await ClientModel.findById(id);
    if (client) await this.cache.set(`client:${id}`, client);
    return client;
  }

  async listClients() {
    return ClientModel.find();
  }
}
