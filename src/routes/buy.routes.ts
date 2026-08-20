import { Router } from "express";
import {
  CreateBuy,
  GetBuys,
  GetBuy,
  UpdateBuy,
  DeleteBuy,
  getFeaturedBuy,
  GetBuyBySlug,
} from "../controllers/buy.controller";

const router = Router();

router.post("/", CreateBuy);
router.get("/featured", getFeaturedBuy);

router.get("/", GetBuys);

router.get("/:id", GetBuy);

router.get("/slug/:slug", GetBuyBySlug);

router.put("/:id", UpdateBuy);

router.delete("/:id", DeleteBuy);

export default router;
