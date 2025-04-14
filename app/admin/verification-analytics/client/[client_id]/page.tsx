import PatientProfileMain from "@components/profilePage/PatientProfileMain";
import ClientDetailPage from "@components/verificationAnalytics/ClientDetailPage";
import LoggedInStoreInitializer from "@store/LoggedInStoreInitializer";
import { initialLoggedInStoreStates, LoggedInStoreStates } from "@store/useLoggedInStore";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { signOut } from "next-auth/react";
import { authOptions } from "utils/lib/auth";

const pageTitle = "Client Specific Info | MCI";
const desc = "Analytics Platform by MIS, DGHS";

export const metadata: Metadata = {
  title: pageTitle + " ",
  description: desc,
};

interface ClientDetailProps {
  params: {
    client_id: any;
  };
}


async function page(params: ClientDetailProps) {
  //Accessing token from Server Side
  const session: any = await getServerSession(authOptions);
  console.log("Session in Detail Page!!");
  console.log(session);
  console.log("Params in Detail Page!!");
  console.log(params);
  console.log(params.params.client_id);
  //get query params
  if (session) {
    // console.log(session.accessToken);
  } else {
    await signOut();
  }

  const initalizedStoreStates:LoggedInStoreStates = {
    ...initialLoggedInStoreStates,
    clientId: params.params.client_id,
  };

  return (
    <>
      <LoggedInStoreInitializer {...initalizedStoreStates} />
      <article className="h-[100%] w-full">
          <ClientDetailPage />
      </article>
    </>
  );
}

export default page;