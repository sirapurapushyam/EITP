import { hashToken } from '../utils/token.js';

export async function storeRefreshToken(user, refreshToken, meta = {}) {
  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  user.refreshTokens.push({
    tokenHash,
    userAgent: meta.userAgent || '',
    ipAddress: meta.ipAddress || '',
    expiresAt
  });
  return user.save();
}

export async function revokeRefreshToken(user, refreshToken) {
  const tokenHash = hashToken(refreshToken);
  user.refreshTokens = user.refreshTokens.filter((token) => token.tokenHash !== tokenHash);
  return user.save();
}

export async function revokeAllRefreshTokens(user) {
  user.refreshTokens = [];
  return user.save();
}
