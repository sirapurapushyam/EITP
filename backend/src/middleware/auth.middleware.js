import { ApiError } from '../utils/apiError.js';
import { verifyAccessToken } from '../utils/token.js';
import { User } from '../models/user.model.js';
import { ROLES } from '../constants/roles.js';

export async function requireAuth(req, _res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return next(new ApiError(401, 'Authentication required'));
  }

  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.sub).select('-password -refreshTokens -passwordResetToken -passwordResetExpires');
    if (!user) return next(new ApiError(401, 'Invalid token'));
    req.user = user;
    next();
  } catch (_error) {
    next(new ApiError(401, 'Invalid or expired token'));
  }
}

export function authorizeRoles(...roles) {
  return (req, _res, next) => {
    if (!req.user) return next(new ApiError(401, 'Authentication required'));
    if (!roles.includes(req.user.role)) return next(new ApiError(403, 'Forbidden'));
    next();
  };
}

export function requireDean(req, _res, next) {
  if (req.user?.role !== ROLES.DEAN_EITP) return next(new ApiError(403, 'Dean access required'));
  next();
}

export function isCampusScoped(user, campusId) {
  return user.role === ROLES.DEAN_EITP || String(user.campus) === String(campusId);
}
