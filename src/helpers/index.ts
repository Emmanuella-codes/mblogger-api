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
  crypto.randomBytes(6).toString("hex");
