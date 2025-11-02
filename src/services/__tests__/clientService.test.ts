import { ClientService } from "../clientService";
import * as ClientModule from "../../models/Client";
import { CacheClient } from "../../cache/cacheClient";

// Mocks
jest.mock("../../models/Client");

describe("ClientService", () => {
  let service: ClientService;
  let mockCache: CacheClient;

  beforeEach(() => {
    // Mock simples do CacheClient
    mockCache = {
      get: jest.fn(),
      set: jest.fn(),
    } as unknown as CacheClient;

    service = new ClientService(mockCache);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it("deve criar um cliente", async () => {
    const clientData = {
      nome: "Arthur",
      email: "arthur@example.com",
      telefone: "11999999999",
    };
    const createdClient = { _id: "1", ...clientData } as any;

    // Mock do ClientModel.create
    jest.spyOn(ClientModule.ClientModel, "create").mockResolvedValue(createdClient);

    const result = await service.createClient(clientData as any);

    expect(ClientModule.ClientModel.create).toHaveBeenCalledWith(clientData);
    expect(result).toEqual(createdClient);
  });

  it("deve atualizar um cliente e atualizar cache", async () => {
    const id = "1";
    const updateData = { nome: "Arthur Updated" };
    const updatedClient = {
      _id: id,
      ...updateData,
      email: "arthur@example.com",
      telefone: "11999999999",
    } as any;

    jest.spyOn(ClientModule.ClientModel, "findByIdAndUpdate").mockResolvedValue(updatedClient);

    const result = await service.updateClient(id, updateData);

    expect(ClientModule.ClientModel.findByIdAndUpdate).toHaveBeenCalledWith(id, updateData, {
      new: true,
    });
    expect(mockCache.set).toHaveBeenCalledWith(`client:${id}`, updatedClient);
    expect(result).toEqual(updatedClient);
  });

  it("deve buscar cliente do cache se existir", async () => {
    const id = "1";
    const cachedClient = {
      _id: id,
      nome: "Arthur",
      email: "arthur@example.com",
      telefone: "11999999999",
    } as any;

    (mockCache.get as jest.Mock).mockResolvedValue(cachedClient);

    const result = await service.getClientById(id);

    expect(mockCache.get).toHaveBeenCalledWith(`client:${id}`);
    expect(result).toEqual(cachedClient);
  });

  it("deve buscar cliente do DB se não existir no cache", async () => {
    const id = "1";
    const dbClient = {
      _id: id,
      nome: "Arthur",
      email: "arthur@example.com",
      telefone: "11999999999",
    } as any;

    (mockCache.get as jest.Mock).mockResolvedValue(null);
    jest.spyOn(ClientModule.ClientModel, "findById").mockResolvedValue(dbClient);

    const result = await service.getClientById(id);

    expect(mockCache.get).toHaveBeenCalledWith(`client:${id}`);
    expect(ClientModule.ClientModel.findById).toHaveBeenCalledWith(id);
    expect(mockCache.set).toHaveBeenCalledWith(`client:${id}`, dbClient);
    expect(result).toEqual(dbClient);
  });

  it("deve listar todos os clientes", async () => {
    const clients = [
      { _id: "1", nome: "Arthur" },
      { _id: "2", nome: "Maria" },
    ] as any;

    jest.spyOn(ClientModule.ClientModel, "find").mockResolvedValue(clients);

    const result = await service.listClients();

    expect(ClientModule.ClientModel.find).toHaveBeenCalled();
    expect(result).toEqual(clients);
  });
});
