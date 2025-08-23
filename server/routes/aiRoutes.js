import { Router } from "express";
import userAuth from "../middleware/userAuth.js";
import { generate } from "../controllers/aiController.js";

const aiRouter = Router();

aiRouter.post("/generate",userAuth,generate)

export default aiRouter;