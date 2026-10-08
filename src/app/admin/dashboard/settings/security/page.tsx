import { redirect } from "next/navigation";
import { PhoneSecurityForm } from "@/components/auth/phone-security-form";
import { getCurrentUser } from "@/lib/auth";

export default async function AccountSecurityPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <section className="mx-auto max-w-4xl space-y-8">
      <header className="border-b border-border pb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">
          Account
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">
          Security settings
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage verified contact methods for sign-in and account recovery.
        </p>
      </header>
      <div className="border-b border-border pb-8">
        <h2 className="mb-1 text-base font-semibold text-foreground">
          Email address
        </h2>
        <p className="text-sm text-muted-foreground">
          {user.email} <span className="ml-2 text-emerald-700">Verified</span>
        </p>
      </div>
      <div>
        <h2 className="mb-1 text-base font-semibold text-foreground">
          Phone sign-in
        </h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Verify a number to enable one-time-code sign-in.
        </p>
        <PhoneSecurityForm currentPhone={user.phoneNumber} />
      </div>
    </section>
  );
}
