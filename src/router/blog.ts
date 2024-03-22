import express from "express";
import { verifyJwtToken } from "../middlewares";
import { createBlogPost } from "../controllers/blog";

export default (router: express.Router) => {
  router.post("/api/blogs", verifyJwtToken, createBlogPost);
};
