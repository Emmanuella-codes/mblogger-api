import { createUser, getUserByEmail } from "../db/users";
import express from "express";
import { authentication, generateVerificationCode, random } from "../helpers";

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;
    const verificationCode = generateVerificationCode();

    if (!email || !password || !username) {
      return res.sendStatus(400);
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.sendStatus(400);
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        verificationCode,
        salt,
        password: authentication(salt, password),
        isVerified: false,
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const verifyUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email, verificationCode } = req.body;
    const user = await getUserByEmail(email).select(
      "+authentication.verificationCode"
    );

    if (!user) {
      return res.sendStatus(400);
    }

    if (user.authentication.verificationCode != verificationCode) {
      return res.sendStatus(403);
    }

    user.authentication.isVerified = true;
    await user.save();

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
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

    //authenticate user without knowing their password
    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password != expectedHash) {
      return res.sendStatus(403);
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();

    res.cookie("MBLOGGER-AUTH", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    return res
      .status(200)
      .json({ token: user.authentication.sessionToken })
      .end();
  } catch (error) {
    return res.sendStatus(400);
  }
};
