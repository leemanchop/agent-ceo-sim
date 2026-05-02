/**
 * Server-side admin gate for everything under /admin/*. Non-admin
 * sessions get redirected to the sign-in page with a `reason` flag
 * so the UI can explain why.
 *
 * Admin status is determined by `ADMIN_EMAILS` (see lib/auth/config.ts).
 * The flag is baked into the JWT, so this is just a JWT decode in
 * the edge — no DB hit.
 */
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { AdminIdentityBanner } from "./admin-identity-banner";
import { ApiModeToggle } from "@/components/admin/api-mode-toggle";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    redirect("/auth/signin?callbackUrl=/admin/usage&reason=admin_required");
  }
  const email = session.user.email ?? "unknown";
  return (
    <>
      <AdminIdentityBanner email={email} />
      {children}
      {/* admin-only floating pill — flips API mode without redeploy */}
      <ApiModeToggle />
    </>
  );
}
