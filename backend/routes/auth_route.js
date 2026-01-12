import express from "express";
import {
  login,
  logout,
  refresh,
  signup,
  user,
} from "../controllers/auth_controller.js";
import { protectRoute } from "../middleware/auth_middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/user", protectRoute, user);

export default router;
