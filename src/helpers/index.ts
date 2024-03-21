import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";
import 'dotenv/config'

export const random = () => crypto.randomBytes(128).toString("base64");

export const generateOtp = () => `${Math.floor(1000 + Math.random() * 9000)}`;

export const authentication = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const generateVerificationCode = () =>
  `${Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0")}`;

export const generateToken = (userID: string) => {
  return jwt.sign({ userID }, process.env.SECRET_KEY, { expiresIn: "1h" });
};
