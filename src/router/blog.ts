import express from "express";
import { isOwner, verifyJwtToken } from "../middlewares";
import {
  createBlogPost,
  deleteBlogPost,
  editBlogPost,
  getAllBlogs,
} from "../controllers/blog";
import {
  commentOnPost,
  deleteCommentOnPost,
  getUserBlogPosts,
  likePost,
  unlikePost,
} from "../controllers/blogActions";

export default (router: express.Router) => {
  router.post("/api/blogs", verifyJwtToken, createBlogPost);
  router.put("/api/blogs/:blogId", verifyJwtToken, editBlogPost);
  router.delete("/api/blogs/:blogId", verifyJwtToken, deleteBlogPost);
  router.get("/api/blogs", verifyJwtToken, getAllBlogs);
  router.post("/api/blogs/:blogId/like", verifyJwtToken, isOwner, likePost);
  router.delete("/api/blogs/:blogId/unlike", verifyJwtToken, isOwner, unlikePost);
  router.post("/api/blogs/:blogId/comments", verifyJwtToken, isOwner, commentOnPost);
  router.delete("/api/blogs/:blogId/comments/:commentId", verifyJwtToken, isOwner, deleteCommentOnPost);
  router.get("/api/user/blogs", verifyJwtToken, isOwner, getUserBlogPosts);
};
