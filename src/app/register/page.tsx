import { AuthForm } from "@/components/auth/auth-form";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ oauth?: string }>;
}) {
  const query = await searchParams;
  return <AuthForm mode="register" oauthProvider={query.oauth} />;
}
