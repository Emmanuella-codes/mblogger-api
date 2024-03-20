import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, getUserByEmail, getUserById } from "../db/users";
import express from "express";
import {
  authentication,
  generateToken,
  generateVerificationCode,
  random,
} from "../helpers";

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

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(password),
        verificationCode: verificationCode,
        isVerified: false,
      },
    });

    return res
      .status(200)
      .json({
        user,
        verificationCode: verificationCode,
        message: "Please visit this url to verify your account /verify-user",
      })
      .end();
  } catch (error) {
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
      return res.sendStatus(400).json({ error: "Invalid verification code" });
    }

    user.authentication.isVerified = true;
    await user.save();

    return res.status(200).json(user).end();
  } catch (error) {
    return res.sendStatus(400).json({ error: error });
  }
};

export const login = async (req: express.Request, res: express.Response) => {
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

    const dbPassword = user.authentication.password;

    const isPasswordValid = bcrypt.compare(dbPassword, password);
    if (!isPasswordValid) {
      return res
        .sendStatus(400)
        .json({ error: "Wrong email and password combination." });
    }

    const accessToken = generateToken(user.id);

    await user.save();

    res.cookie("access-token", accessToken, {
      domain: "localhost",
      maxAge: 60 * 60 * 1000,
      path: "/",
      httpOnly: true,
    });

    return res.status(200).json().end();
  } catch (error) {
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
      return res.sendStatus(404); //return not found
    }

    //generate token & set timer to 15 minutes
    // const resetToken = token();
    // if (!resetToken) {
    //   return res.sendStatus(500);
    // }

    // const expiresIn = new Date();
    // expiresIn.setMinutes(expiresIn.getMinutes() + 15);

    // const resetPasswordRequest = new ResetPasswordModel({
    //   user: existingUser._id,
    //   resetToken,
    //   expiresIn,
    // });

    // await resetPasswordRequest.save();

    return (
      res
        .status(200)
        /* .json({
        token: resetPasswordRequest.resetToken,
        message: "use token to reset password in /api/reset-password",
      }) */
        .end()
    );
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const resetPassword = async (
  req: express.Request,
  res: express.Response
) => {
  // try {
  //   const { resetToken, newPassword } = req.body;
  //   if (!resetToken || !newPassword) {
  //     return res.sendStatus(400);
  //   }
  //   const resetPassword = await ResetPasswordModel.findOne({
  //     resetToken,
  //     expiresIn: { $gt: new Date() },
  //   });
  //   if (!resetPassword) {
  //     return res.sendStatus(401);
  //   }
  //   const user = await getUserById(resetPassword.user);
  //   user.authentication.password = authentication(
  //     newPassword
  //   );
  //   await user.save();
  //   await ResetPasswordModel.deleteOne({ _id: resetPassword._id });
  //   return res
  //     .status(200)
  //     .json({ message: "your password change was successfull" })
  //     .end();
  // } catch (error) {
  //   console.log(error);
  //   return res.sendStatus(400);
  // }
};
