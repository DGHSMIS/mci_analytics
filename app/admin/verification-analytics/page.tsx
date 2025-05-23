/**
 * Developed by Fahim Hossain
 * Designation: Software Specialist, MIS, DGHS
 * Email: fahim@aritsltd.com
 * website: https://aritsltd.com
 */
import { getServerSession } from "next-auth/next";
import { signOut } from "next-auth/react";
import dynamic from "next/dynamic";
import { Metadata } from "next/types";
import { authOptions } from "utils/lib/auth";

/**
 * * Metadata for current page
 */

const pageTitle = "Verification Analytics | MCI";
const desc = "Analytics Platform by MIS, DGHS";

const VerificationAnalytics = dynamic(() => import("@components/verificationAnalytics/VerificationAnalytics"), {
  ssr: true,
});

export const metadata: Metadata = {
  title: pageTitle + " ",
  description: desc,
};

export default async function page() {
  //Accessing token from Server Side
  const session: any = await getServerSession(authOptions);
  console.log("Session in Dashboard!!");
  console.log(session);
  if (session) {
    console.log(session.accessToken);
  } else {
    await signOut();
  }
  return (
    <article className="h-fit">
      <VerificationAnalytics />
    </article>
  );
}
