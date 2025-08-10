// app/.../page.tsx (Server Component)
import { getServerSession } from "next-auth";
import { authOptions } from "utils/lib/auth";
import { redirect } from "next/navigation";
import VerificationAnalytics from "@components/verificationAnalytics/VerificationAnalytics"; // no need for dynamic()

export const metadata = {
  title: "Verification Analytics | MCI",
  description: "Analytics Platform by MIS, DGHS",
};

// If you want to be explicit that this should never be prerendered:
export const dynamic = "force-dynamic"; // or: export const revalidate = 0;

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/admin/verification-analytics");
  }

  return (
    <article className="h-fit">
      <VerificationAnalytics />
    </article>
  );
}
