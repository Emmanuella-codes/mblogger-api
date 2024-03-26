import express from "express";
import { verifyJwtToken } from "../middlewares";
import {
  createBlogPost,
  deleteBlogPost,
  editBlogPost,
  getAllBlogs,
} from "../controllers/blog";

export default (router: express.Router) => {
  router.post("/api/blogs", verifyJwtToken, createBlogPost);
  router.put("/api/blogs/:blogId", verifyJwtToken, editBlogPost);
  router.delete("/api/blogs/:blogId", verifyJwtToken, deleteBlogPost);
  router.get("/api/blogs", verifyJwtToken, getAllBlogs);
};
