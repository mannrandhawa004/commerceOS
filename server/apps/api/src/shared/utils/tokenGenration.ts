import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../../config/env.js";

const tokenOptions = { issuer: "commerce-os-api", audience: "commerce-os-client" } as const;

export const generateAccessToken = (userId: string, sessionId: string): string =>
  jwt.sign({ sub: userId, sid: sessionId }, env.JWT_ACCESS_SECRET, {
    ...tokenOptions, expiresIn: "15m", algorithm: "HS256",
  });

export const verifyAccessToken = (token: string): JwtPayload => {
  const payload = jwt.verify(token, env.JWT_ACCESS_SECRET, { ...tokenOptions, algorithms: ["HS256"] });
  if (typeof payload === "string" || typeof payload.sub !== "string" || typeof payload.sid !== "string") {
    throw new Error("Invalid token payload");
  }
  return payload;
};
