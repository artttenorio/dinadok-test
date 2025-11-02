import { Router } from "express";
import { ClientController } from "../controllers/clientController";
import { ClientService } from "../services/clientService";
import { CacheClient } from "../cache/cacheClient";
import Redis from "ioredis";

const router = Router();
const redis = new Redis(process.env.REDIS_URL ?? "");
const cache = new CacheClient(redis, Number(process.env.CACHE_TTL) || 60);
const service = new ClientService(cache);
const controller = new ClientController(service);

router.get("/", controller.list);
router.post("/", controller.create);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);

export default router;
