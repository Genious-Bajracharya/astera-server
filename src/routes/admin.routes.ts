import express from "express";
import { changePassword, login, Register } from "../controllers/admin.controller";

const router = express.Router();

router.post("/register", Register);
router.post("/login", login);
router.post("/changepassword", changePassword);

export default router;
