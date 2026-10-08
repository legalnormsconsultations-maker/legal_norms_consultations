import { VerifyEmailForm } from "@/components/auth/verify-email-form";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  if (!token)
    return (
      <p className="m-auto p-8 text-sm text-red-700">
        The verification link is missing its token.
      </p>
    );
  return <VerifyEmailForm token={token} />;
}
