import {
  isResetTokenExpired,
  isUserVerified,
  verifyJwtToken,
} from "../middlewares/index";
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
  router.post("/api/verify-email", verifyEmail, isUserVerified);
  router.post("/api/login", isUserVerified, login, verifyJwtToken);
  router.post("/api/forget-password", forgotPassword);
  router.post("/api/reset-password/:id", resetPassword, isResetTokenExpired);
};
