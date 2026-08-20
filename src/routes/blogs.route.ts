import { Router } from "express";
import {
  createBlog,
  updateBlog,
  deleteBlog,
  GetBlogs,
  GetBlog,
  GetBlogBySlug,
} from "../controllers/blogs.controller";

const router = Router();

router.get("/", GetBlogs);

router.get("/:id", GetBlog);

router.get("/slug/:slug", GetBlogBySlug);

router.post("/", createBlog);

router.put("/:id", updateBlog);

router.delete("/:id", deleteBlog);

export default router;
