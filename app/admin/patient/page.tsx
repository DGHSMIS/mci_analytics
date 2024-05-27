/**
 * Developed by Fahim Hossain
 * Designation: Software Specialist, MIS, DGHS
 * Email: fahim@aritsltd.com
 * website: https://aritsltd.com
 */
import { getServerSession } from "next-auth/next";
import { signOut } from "next-auth/react";
import { Metadata } from "next/types";
import { authOptions } from "utils/lib/auth";
import dynamic from "next/dynamic";

/**
 * * Metadata for current page
 */

const pageTitle = "Patient Listing | MCI";
const desc = "Analytics Platform by MIS, DGHS";

const PatientList = dynamic(() => import("@components/globals/PatientList"), {
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
      <PatientList session={session} />
    </article>
  );
}
