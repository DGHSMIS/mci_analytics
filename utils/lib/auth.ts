import { loginAuthenticationHeaders } from "@utils/constants";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextResponse } from "next/server";
import { getAuthBaseUrl, getUrlFromName } from "./apiList";
import process from "process";
import AuthResponseInterface from "@utils/interfaces/Authentication/AuthResponseInterface";
// Ref - https://next-auth.js.org/configuration/options
export const authOptions: any = {
  session: {
    strategy: "jwt",
  },
  //Set the login/error and post login url via newUser param
  pages: {
    signIn: "/login", // Login URL
    error: "/login", // On Error Redirect to login page or error page
    newUser: "/admin/dashboard", // If user successfully logs in then redirect to this page
  },
  providers: [
    // - Google Login
    // Ref: https://next-auth.js.org/providers/google
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET
    // })
    // - Facebook Login
    // Ref: https://next-auth.js.org/providers/facebook
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_CLIENT_ID,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    // }),
    // - Github Login
    // Ref: https://next-auth.js.org/providers/github
    // GitHubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET
    // })
    // !! CUSTOM Backend API Authentication !!
    // Ref: https://next-auth.js.org/providers/credentials
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: { label: "Password", type: "password" },
      },
      // The following Function is fired when user tries to login
      // handle external API Calls here
      async authorize(credentials) {
        console.log("Sign In Fired");
        console.log(credentials);
        if (credentials) {
          const formData = new FormData();
          formData.append("email", credentials.email);
          formData.append("password", credentials.password);

          const apiHeader = {
            method: "POST",
            headers: loginAuthenticationHeaders,
            body: formData,
          };

          // In our case, via login form, we got the access_token
          // Then we make a 2nd API call to get the user info
          // Then we return the user info to NextAuth
          // If auth fails, return null
          const verifyCreds = await fetch(
            getAuthBaseUrl() + getUrlFromName("auth-url"),
            apiHeader
          );

          if (verifyCreds.status == 200) {
            const data:AuthResponseInterface = await verifyCreds.json();
            console.log("verifyCreds data");
            console.log(data);
            if(data.access_token != null){
              console.log("data.access_token == null");
              return await verifyToken(data.access_token);
            }
            return null;
          } else {
            return null;
          }
        }
        return null;
      },
    }),
  ],
  //Callback functions are fired on specific events
  callbacks: {
    //On successful login
    async signIn({ user, account, profile }: any) {
      console.log("Sign In Callback");
      if (user) {
        return true;
      }
      return false;
    },
    //On successful login, we set the token to the userInfo object
    async jwt({ token, account, user }: any) {
      //   console.error("JWT Callback");
      //   console.log(user);
      //   console.log(token);
      //   console.log(account);
      const userInfo = await user;
      // console.log(userInfo);
      //unset token.sub from token
      delete token.sub;
      delete token.iat;
      delete token.jti;
      if (userInfo) {
        token.accessToken = userInfo.access_token;
      }
      return token;
    },
    // Session Callback is fired after jwt callback,
    // we set the accessToken to session from the userInfo object
    async session({ session, token, user }: any) {
      //   console.error("Session Callback");
      //   console.log(session);
      //   console.log(token);
      const sessionRes = await session;
      if (token) {
        sessionRes.accessToken = token.accessToken;
      }
      // console.log(sessionRes);
      return sessionRes;
    },
  },
};

/**
 * Function used to send access token to External API to verify the token &
 * get the user's details
 * @param token
 * @returns
 */
/**
 * Function used to send access token to External API to verify the token &
 * get the user's details
 * @param token
 * @returns
 */
export async function verifyToken(token: string) {
  const verifyTokenHeaders = {
    method: "GET",
    headers: loginAuthenticationHeaders,
  };
  const headers: Record<string, string> = {
      "X-Auth-Token": `${process.env.NEXT_X_LOGIN_AUTH_TOKEN ?? ""}`,
      "client-id": `${process.env.NEXT_LOGIN_AUTH_CLIENT_ID ?? ""}`,
  };

  const apiHeader = {
    method: `GET`,
    headers: headers,
    body: null,
    next: { revalidate: 0 },
  };

  const userInfo = await fetch(`${process.env.NEXT_PUBLIC_AUTH_BASE_URL + getUrlFromName("auth-verify-url") + token}`, apiHeader);
  console.log(userInfo);
  if (userInfo.status == 200) {
    const userData: any = await userInfo.json();
    return userData;
  }
    if (userInfo.status == 200) {
    const userData: AuthResponseInterface = await userInfo.json();
      //Determine the type of response
      if (userData.access_token != null) {
        return userData;
      }
    return null;
  }
  return null;
}
export async function checkRequestHeaders(
  req: Request
): Promise<NextResponse | null> {
  //Get Authorization Headers
  const authorization = req.headers.get("authorization");
  console.log("Checking Authorization headers");
  console.log(authorization);
  if (!authorization) {
    console.log("Auth Token is null");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  //Verifying the validity of the token
  const isUserVerfied:AuthResponseInterface|null = await verifyToken(authorization);
  //If token is not valid, return 401
  if(isUserVerfied == null){
    console.log("Auth Token is null");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  } else{
    console.log("Does user have groups?");
    console.log(isUserVerfied);
    
  
    if(isUserVerfied.group_names_formatted != null){
      let isMCIAdmin = false;
      let isMCIUser = false;
      isUserVerfied.group_names_formatted.forEach((group) => {
        console.log("The group item is");
        console.log(group);
        if(group == "mci-admin"){
          isMCIAdmin = true
        }
        if(group == "mci-user"){
          isMCIUser = true
        }
      });
      if(isMCIAdmin && isMCIUser){ 
        console.log("Returning Null");
        
        return null;
      }
      else{
        console.log("Returning Unauthorized 2");
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
    }
  }
  console.log("Returning Unauthorized 3");
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}
