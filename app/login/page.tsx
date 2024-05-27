import LoginForm from "@components/LoginForm";
import { getServerSession } from "next-auth";
import { Metadata } from "next/types";
import React from "react";
import { authOptions } from "utils/lib/auth";

const pageTitle = "Login | MCI";
const desc = "Master Client Index | MIS, DGHS";
export const metadata: Metadata = {
  title: pageTitle + " ",
  description: desc,
};

export default async function page() {
  const session: any = await getServerSession(authOptions);
  if (session) {
    console.log("session.accessToken");
    console.log(session.accessToken);
  }
  return (
    <>
      <div className="container grid h-full w-full items-center justify-center">
        <LoginForm />
        {/*<div className="bg-white ">*/}
        {/*  <h1>Server Session</h1>*/}
        {/*  <pre>{JSON.stringify(session)}</pre>*/}
        {/*</div>*/}
        {/* <User /> */}
      </div>
    </>
  );
}
