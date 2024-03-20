import express from "express";
import { get, merge } from "lodash";
import jwt from "jsonwebtoken";

export const verifyToken = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.header("Authorization");
  const SECRET_KEY = process.env.SECRET_KEY;
  
  if (!token) {
    return res.sendStatus(401);
  }

  try {
   const decoded = jwt.verify(token, SECRET_KEY);
   

    next();
  } catch (error) {
    return res.sendStatus(400).json({ error: "Invalid access token" });
  }
};

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string;

    if (!currentUserId) {
      return res.sendStatus(403);
    }

    if (currentUserId.toString() != id) {
      return res.sendStatus(403);
    }
    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  // try {
  //   const sessionToken = req.cookies["MBLOGGER-AUTH"];

  //   if (!sessionToken) {
  //     return res.sendStatus(403);
  //   }

  //   const existingUser = await getUserBySessionToken(sessionToken);

  //   if (!existingUser) {
  //     return res.sendStatus(403);
  //   }

  //   merge(req, { identity: existingUser });

  //   return next();
  // } catch (error) {
  //   console.log(error);
  //   return res.sendStatus(400);
  // }
};
