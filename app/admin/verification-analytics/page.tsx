// app/.../page.tsx (Server Component)
import { getServerSession } from "next-auth";
import { authOptions } from "utils/lib/auth";
import VerificationAnalytics from "@components/verificationAnalytics/VerificationAnalytics"; // no need for dynamic()
import { redirect } from "next/navigation";

export const metadata = {
  title: "Verification Analytics | MCI",
  description: "Analytics Platform by MIS, DGHS",
};

// If you want to be explicit that this should never be prerendered:
export const dynamic = "force-dynamic"; // or: export const revalidate = 0;

export default async function Page() {
  //Accessing token from Server Side
  const session: any = await getServerSession(authOptions);
  console.log("Session in Dashboard!!");
  console.log(session);
  if (session) {
    console.log("We got the access token : " +session.accessToken);
  } else {
    redirect("/login");
  }

  return (
    <article className="h-fit">
      <VerificationAnalytics session={session}/>
    </article>
  );
}
