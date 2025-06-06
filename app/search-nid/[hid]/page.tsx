import LoggedInStoreInitializer from "@store/LoggedInStoreInitializer";
import { initialLoggedInStoreStates } from "@store/useLoggedInStore";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { authOptions } from "utils/lib/auth";

const pageTitle = "Patient Info | MCI";
const desc = "Master Client Index by MIS, DGHS";

export const metadata: Metadata = {
  title: pageTitle + " ",
  description: desc,
};

const PatientProfileMain = dynamic(() => import("@components/profilePage/PatientProfileMain"), {
  ssr: false,
});

interface PatientDetailsProps {
  params: {
    hid: any;
  };
}


async function page(params: PatientDetailsProps) {
  const session: any = await getServerSession(authOptions);
  //
  // //get query params
  // if (session) {
  //   console.log(session.accessToken);
  // } else {
  //   await signOut();
  // }
  console.log("The patient Data is -");
  console.log(params.params.hid);

  const initalizedStoreStates = {
    ...initialLoggedInStoreStates,
    patientId: params.params.hid,
  };

  return (

    <>
      <LoggedInStoreInitializer {...initalizedStoreStates} />
      <article className="h-[100%] w-full">
        <div className="mt-40 h-full h-min-[500px] flex w-full flex-col justify-center px-24 2xl:container pb-24 space-y-24">
          <PatientProfileMain session={session}/>
        </div>
      </article>
    </>
  );
}

export default page;