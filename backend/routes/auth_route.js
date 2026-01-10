import express from "express";
import { login, logout, refresh, signup } from "../controllers/auth_controller.js";

const route = express.Router();

route.post("/login", login);
route.post("/signup", signup);
route.post("/logout", logout);
route.post("/refresh", refresh);

export default route;
