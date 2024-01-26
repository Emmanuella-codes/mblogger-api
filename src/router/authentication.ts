import {
  forgotPassword,
  login,
  register,
  resetPassword,
  verifyEmail,
} from "../controllers/authentication";
import express from "express";

export default (router: express.Router) => {
  router.post("/api/register", register);
  router.post("/api/login", login);
  router.post("/api/verify-email", verifyEmail);
  router.post("/api/forget-password", forgotPassword);
  router.post("/api/reset-password", resetPassword);
};
