"use client";

import { signIn } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LogInForm = dynamic(() => import("@library/molecules/auth/Login"), {
  ssr: true,
});

export default function LoginForm() {
  const router = useRouter();
  const [authError, setAuthError] = useState(false);

  // On Login Failure, error is appended to the url as a query param
  // Use this to display error message
  useEffect(() => {
    console.log("In Login");
    console.log(router);
    console.log(location.search);
    const hasLoginError = location.search.includes("error=");
    console.log(hasLoginError);
    if (hasLoginError) {
      setAuthError(true);
    } else {
      setAuthError(false);
    }
  }, [router]);

  return (
    <div>
      <LogInForm
        errorLoginText={authError ? "Invalid Login Credentials" : ""}
        submitClicked={async (e: any) => {
          const { text, password } = e;
          console.log("TEST");
          //Remove query params
          const url = window.location.href;
          const urlParts = url.split("?");
          window.history.replaceState({}, document.title, urlParts[0]);
          console.log("signIn");
          //Now call signIn with the credentials from next-auth
          await signIn("credentials", {
            redirect: true,
            callbackUrl: "/admin/patient",
            email: text,
            password: password,
          });
        }}
        showSignUp={false}
        showForgotPass={false}
        forgotPassLink="/forgot-password"
        className=""
      />
    </div>
  );
}
