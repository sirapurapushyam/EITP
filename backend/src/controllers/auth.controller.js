import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { login, registerStudent, refresh, logout, forgotPassword, resetPassword, changePassword, updateProfile } from '../services/auth.service.js';

function setAuthCookies(res, payload) {
  const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' };
  res.cookie('accessToken', payload.accessToken, cookieOptions);
  res.cookie('refreshToken', payload.refreshToken, cookieOptions);
}

export const register = asyncHandler(async (req, res) => {
  const user = await registerStudent(req.body);
  res.status(201).json({ success: true, data: user });
});

export const signIn = asyncHandler(async (req, res) => {
  const result = await login(req.body, { userAgent: req.headers['user-agent'], ipAddress: req.ip });
  setAuthCookies(res, result);
  res.json({ success: true, ...result });
});

export const signOut = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
  if (req.user) {
    await logout(req.user.id, refreshToken);
  }
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out' });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  if (!token) throw new ApiError(401, 'Refresh token required');
  const result = await refresh(token);
  setAuthCookies(res, result);
  res.json({ success: true, ...result });
});

export const forgot = asyncHandler(async (req, res) => {
  await forgotPassword(req.body.email);
  res.json({ success: true, message: 'If the email exists, a reset link has been sent.' });
});

export const reset = asyncHandler(async (req, res) => {

    await resetPassword(
        req.params.token,
        req.body.password
    );

    res.json({
        success: true,
        message: "Password reset successfully"
    });

});

export const change = asyncHandler(async (req, res) => {
  await changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
  res.json({ success: true, message: 'Password changed successfully' });
});

export const profile = asyncHandler(async (req, res) => {
  const user = await updateProfile(req.user.id, req.body);
  res.json({ success: true, data: user });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});
