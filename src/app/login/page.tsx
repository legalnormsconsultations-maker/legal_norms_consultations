import { AuthForm } from "@/components/auth/auth-form";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string; error?: string }>;
}) {
  const query = await searchParams;
  const user = await getCurrentUser();
  if (user) {
    redirect("/admin/dashboard");
  }
  const notices: Record<string, string> = {
    "verify-email":
      "Your email must be verified before sign-in. Check your inbox.",
    "password-reset":
      "Your password was updated. Sign in with the new password.",
  };
  const errors: Record<string, string> = {
    oauth:
      "Sign-in could not be completed. Try again or use email and password.",
    "oauth-config": "This sign-in provider is not configured yet.",
    verification:
      "That verification link is invalid, expired, or already used.",
  };
  return (
    <AuthForm
      mode="login"
      notice={query.notice ? notices[query.notice] : undefined}
      error={query.error ? errors[query.error] : undefined}
    />
  );
}
