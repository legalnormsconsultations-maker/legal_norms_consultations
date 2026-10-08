import { AuthForm } from "@/components/auth/auth-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  if (!token)
    return (
      <AuthForm
        mode="forgot"
        error="The password reset link is missing its token."
      />
    );
  return <AuthForm mode="reset" resetToken={token} />;
}
