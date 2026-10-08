import "server-only";

export {
  loginWithPassword,
  registerWithPassword,
  requestPasswordReset,
  requestPhoneOtp,
  resendEmailVerification,
  resetPassword,
  verifyEmail,
  verifyPhoneOtp,
} from "@/lib/auth/service";
export { getCurrentUser, revokeCurrentSession } from "@/lib/auth/session";

export type AuthCredentials = {
  email: string;
  password: string;
};
