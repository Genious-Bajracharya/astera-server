import { Router } from "express";
import {
  CreateOffplan,
  GetOffplans,
  GetOffplan,
  UpdateOffplan,
  DeleteOffplan,
  GetFeaturedOffplan,
  GetOffplanBySlug,
} from "../controllers/offplan.controller";

const router = Router();
router.get("/featured", GetFeaturedOffplan);

router.post("/", CreateOffplan);

router.get("/", GetOffplans);

router.get("/:id", GetOffplan);

router.get("/slug/:slug", GetOffplanBySlug);

router.put("/:id", UpdateOffplan);

router.delete("/:id", DeleteOffplan);

export default router;
