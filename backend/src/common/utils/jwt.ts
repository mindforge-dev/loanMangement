import jwt from "jsonwebtoken";
import * as crypto from "crypto";
import { env } from "../../config/env";
import type { UserWithPermissions } from "../../modules/rbac/rbac.types";

export interface AccessTokenPayload {
  sub: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
}

export interface RefreshTokenPayload {
  sub: string;
  jti: string;
}

export const signAccessToken = (user: UserWithPermissions): string => {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles,
      permissions: user.permissions,
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN as any },
  );
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
};

export const signRefreshToken = (userId: string): string => {
  // `jti` guarantees uniqueness even when two tokens for the same user are
  // issued within the same second (avoids refresh-token hash collisions).
  return jwt.sign(
    { sub: userId, jti: crypto.randomUUID() } satisfies RefreshTokenPayload,
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN as any },
  );
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
};
