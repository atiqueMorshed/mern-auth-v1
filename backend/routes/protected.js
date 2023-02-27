import express from "express";
import { protectedContent } from "../controllers/protected.js";
import verifyJWT from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(verifyJWT, protectedContent);

export default router;
