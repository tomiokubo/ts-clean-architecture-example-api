import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeSignUpController } from "../factories/controllers/signup-controller-factory";

const router = Router();

router.post("/", adaptRoute(makeSignUpController()));

export default router;
