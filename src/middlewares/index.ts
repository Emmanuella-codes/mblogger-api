import express from "express";
import jwt from "jsonwebtoken";
import { getUserByEmail, getUserById } from "../db/users";
import { generateVerificationCode } from "../helpers";

export const isUserVerified = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { email } = req.body;
    const user = await getUserByEmail(email);

    if (user.authentication.isVerified) {
      return next();
    }

    const userVerificationCode = user.authentication.verificationCode;
    const userVerificationCodeExpIn = user.authentication.verificationCodeExpIn;

    if (
      userVerificationCode &&
      userVerificationCodeExpIn &&
      userVerificationCodeExpIn < new Date()
    ) {
      return next();
    }

    const newVerificationCode = generateVerificationCode();
    const newVerificationCodeExpIn = new Date();
    newVerificationCodeExpIn.setHours(newVerificationCodeExpIn.getHours() + 1);
    newVerificationCodeExpIn.setMinutes(
      newVerificationCodeExpIn.getMinutes() + 15
    );

    user.authentication.verificationCode = newVerificationCode;
    user.authentication.verificationCodeExpIn = newVerificationCodeExpIn;
    await user.save();

    return res.json({
      verificationCode: newVerificationCode,
      message:
        "Use the verification code to verify your email on /api/verify-email",
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const verifyJwtToken = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const token = req.cookies["access-token"];
    const SECRET_KEY = process.env.SECRET_KEY;

    if (!token) {
      return res.sendStatus(401);
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    if (!decoded) {
      res.sendStatus(401);
    }

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.sendStatus(400).json({ error: "Invalid access token" });
    } else if (error instanceof jwt.TokenExpiredError) {
      return res.sendStatus(400).json({ error: "Token expired" });
    }
    return res.sendStatus(400).json({ error: error });
  }
};

export const isResetTokenExpired = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const { resetToken } = req.body;

    const existingUser = await getUserById(id);
    const dbToken = existingUser.authentication.resetPassword.resetToken;
    const dbTokenExpIn = existingUser.authentication.resetPassword.expiresIn;

    if (resetToken && dbToken === resetToken) {
      return next();
    }

    if (dbTokenExpIn && dbTokenExpIn < new Date()) {
      return next();
    }

    return res.json({
      message: "Please visit /api/forgot-password to reset your password",
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
