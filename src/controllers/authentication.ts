import bcrypt from "bcrypt";
import { createUser, getUserByEmail, getUserById } from "../db/users";
import express from "express";
import {
  authentication,
  generateOtp,
  generateToken,
  generateVerificationCode,
  random,
} from "../helpers";
import { transporter } from "../utils/sendEmail";
import "dotenv/config";

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.sendStatus(400);
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.sendStatus(400);
    }

    const verificationCode = generateVerificationCode();
    const verificationCodeExpIn = new Date();
    verificationCodeExpIn.setHours(verificationCodeExpIn.getHours() + 1);
    verificationCodeExpIn.setMinutes(verificationCodeExpIn.getMinutes() + 15);

    const hashedPassword = await authentication(password);

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: hashedPassword,
        verificationCode,
        verificationCodeExpIn,
      },
    });

    return res
      .status(201)
      .json({
        user,
        message:
          "Use the verification code to verify your email on /api/verify-email",
      })
      .end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const verifyEmail = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email, verificationCode } = req.body;
    const user = await getUserByEmail(email);

    if (!user) {
      return res.sendStatus(400);
    }

    if (verificationCode !== user.authentication.verificationCode) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 1);

    if (currentTime > user.authentication.verificationCodeExpIn) {
      return res.status(400).json({ error: "Verification code has expired" });
    }

    user.authentication.isVerified = true;
    await user.save();

    return res
      .status(200)
      .json({ message: "Your email was verified successfully" });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const login = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      return res.sendStatus(400);
    }

    if (user.authentication.isVerified === false) {
      return res.status(400).json({
        verificationCode: user.authentication.verificationCode,
        message: "Please verify your email, visit /api/verify-email",
      });
    }

    const dbPassword = user.authentication.password;

    const isPasswordValid = await bcrypt.compare(password, dbPassword);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ error: "Wrong email and password combination." });
    }

    const accessToken = generateToken(user._id.toString());

    await user.save();

    res
      .cookie("access-token", accessToken, {
        domain: "localhost",
        maxAge: 120 * 120 * 1000,
        path: "/",
        httpOnly: true,
      })
      .status(200)
      .json({ token: accessToken })
      .end();

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const forgotPassword = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.sendStatus(400);
    }

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return res.sendStatus(404);
    }

    const userID = existingUser.id;
    const resetToken = generateOtp();
    const resetTokenExpIn = new Date();
    resetTokenExpIn.setHours(resetTokenExpIn.getHours() + 1);
    resetTokenExpIn.setMinutes(resetTokenExpIn.getMinutes() + 15);

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Password reset OTP",
      text: "Hello",
      html: `<div> 
      <p>Your OTP to reset your password is: <strong>${resetToken}</strong></p>
      <p>It will expire in 15 minutes.</p>
      <p>Click <a href="/api/reset-password/${userID}">here</a> if you made this request, ignore this message if you did not make this request.</p>
      </div>`,
    };

    await transporter.sendMail(mailOptions);

    existingUser.authentication.resetPassword.resetToken = resetToken;
    existingUser.authentication.resetPassword.expiresIn = resetTokenExpIn;
    await existingUser.save();

    return res.status(200).json({ message: "Your OTP was sent to your email" });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const resetPassword = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { resetToken, newPassword } = req.body;
    const { id } = req.params;

    const existingUser = await getUserById(id);

    if (!resetToken || !newPassword) {
      return res.sendStatus(400);
    }

    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 1);
    const dbtoken = existingUser.authentication.resetPassword.resetToken;
    const dbtokenExpIn = existingUser.authentication.resetPassword.expiresIn;

    if (!dbtoken) {
      return res.status(400).json({ error: "Invalid reset token" });
    }

    if (currentTime > dbtokenExpIn) {
      return res.status(400).json({ error: "Token has expired" });
    }

    existingUser.authentication.password = await authentication(newPassword);
    existingUser.save();
    return res
      .status(200)
      .json({ message: "Your password was successfully changed" });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
