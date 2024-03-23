import express from "express";
import { verifyJwtToken } from "../middlewares";
import { createBlogPost, editBlogPost } from "../controllers/blog";

export default (router: express.Router) => {
  router.post("/api/blogs", verifyJwtToken, createBlogPost);
  router.put("/api/blogs/:blogId", verifyJwtToken, editBlogPost);
};
