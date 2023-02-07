import { Router } from "express";
import { makeLoginController } from "../factories/controllers/login-controller-factory";
import { adaptRoute } from "../adapters/express-route-adapter";

const router = Router();

router.post("/", adaptRoute(makeLoginController()));

export default router;
