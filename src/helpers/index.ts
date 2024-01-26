import crypto from "crypto";

const SECRET = "MBLOGGER-API";

export const random = () => crypto.randomBytes(128).toString("base64");
export const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET)
    .digest("hex");
};

export const generateVerificationCode = () =>
  `${Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0")}`;

export const token = () => crypto.randomBytes(32).toString("hex");
