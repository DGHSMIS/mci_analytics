"use client";
import { getAPIResponse, getRevalidationTime } from "@library/utils";
import { ESPatientInterface } from "@providers/elasticsearch/patientIndex/interfaces/ESPatientInterface";
import { useLoggedInStore } from "@store/useLoggedInStore";
import { useSuspenseQuery } from "@tanstack/react-query";
import { EncounterListItem } from "@utils/interfaces/DataModels/Encounter";
import { getBaseUrl, getUrlFromName, resolveFacilityDetailURLFromNameAndId } from "@utils/lib/apiList";
import { delay } from "lodash";
import { signOut } from "next-auth/react";
import dynamic from "next/dynamic";
import { memo, useEffect } from "react";
// import EncounterModal from "./EncounterSegment/EncounterModal";

/**
 * Dynamic Imports Patient ID Blocks
 */

const BackNavigator = dynamic(() => import("@components/globals/BackNavigator"), {
  ssr: true,
});

const PatientInfoCard = dynamic(() => import("@components/profilePage/PatientInfoCard/PatientInfoCard"), {
  ssr: true,
});

const EncounterModal = dynamic(() => import("./EncounterSegment/EncounterModal"), {
  ssr: true,
});


const PatientTabs = dynamic(
  () => import("@components/profilePage/PatientTabs"),
  {
    ssr: true,
  },
);

function usePatientDataSuspenseQuery(props: { access_token: string, patientHid: string }) {
  // console.log("User's access_token " + props.access_token);
  /* @ts-ignore */
  const query = useSuspenseQuery({
    queryKey: ["patient", props.patientHid, props.access_token],
    queryFn: async () => await getAPIResponse(
      getBaseUrl(),
      getUrlFromName("get-patient") + "?hid=" + props.patientHid,
      props.access_token,
      "GET",
      null,
      false,
      getRevalidationTime()
    ),
    retry: 3,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
  if(query.data.message){
    console.log(query.data)
    console.log("LOGGING OUT due in invalid access_token")
      delay(async()=>await signOut(), 2000);
  }
  console.log("Patient Data from API is -");
  console.log(query.data);
  return [query.data as ESPatientInterface, query] as const;
}

function usePatientEncounterSuspenseQuery(props: { access_token: string, patientHid: string }) {
  const query = useSuspenseQuery({
    queryKey: ["patientEncounters", props.patientHid, props.access_token],
    queryFn: async () => await getAPIResponse(
      getBaseUrl(),
      getUrlFromName("get-patient-encounters-by-hid") +
      "?hid=" +
      props.patientHid,
      props.access_token,
      "GET",
      null,
      false,
      getRevalidationTime()
    ),
    retry: 3,
    refetchOnWindowFocus: true,
    refetchOnMount: true,

  });
  if(query.data.message){
    // console.log(query.data)
    // console.log("LOGGING OUT due in invalid access_token")
      delay(async()=>await signOut(), 2000);
  }
  return [query.data as EncounterListItem[], query] as const;
}

const fetchFacilityDetails = async (facilityDetails: string): Promise<any> => {
  const response = await fetch(facilityDetails, {
    method: "GET",
    headers: {
      "X-Auth-Token": "2049dcf7aa3db5bc1c56776ec6686ecac401f068ab3e082fdd8a4d1749b2ef21",
      "client-id": "187707"
      // "FROM": String(process.env.FREESHR_API_USERNAME)
    }
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

function useFacilitySuspenseQuery(props: { access_token: string, facilityID: string }) {
  const facilityDetails = resolveFacilityDetailURLFromNameAndId(
    "auth-get-facility-by-id",
    Number(props.facilityID)
  );

  const query = useSuspenseQuery({
    queryKey: ["facilityById", props.facilityID, props.access_token, facilityDetails],
    queryFn: () => fetchFacilityDetails(facilityDetails),
    retry: 3,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const { data, error, isLoading } = query;

  console.log("The facility Info is - ", data);
  console.log(facilityDetails);
  return [data, query] as const;
}


export default memo(function PatientProfileMain({ session }: any) {

  const { patientId } = useLoggedInStore();
  // console.log(patientId);
  // console.log("session in detail page");
  // console.log(session);
  const [patientInfo, isLoading] = usePatientDataSuspenseQuery({ access_token:  session.accessToken ? session.accessToken:"", patientHid: patientId ?? "" });
  // console.log("Patient Id from Store is - ");
  const [patientEncounterList] = usePatientEncounterSuspenseQuery({  access_token:  session.accessToken ? session.accessToken:"", patientHid: patientId ?? "" });
  
  const [facilityInfo] = useFacilitySuspenseQuery({ access_token: session.accessToken ? session.accessToken:"", facilityID: patientInfo.created_facility_id?.toString() ??  "10000002"});

    useEffect(() => {
    const handleAuth = async () => {
      if (!session) {
        await signOut().then(() => {
          console.log("Signed Out");
        });
      }
    };
    handleAuth();
  }, []);
  return (
    <>
    <div className="grid grid-cols-2 gap-40 lg:grid-cols-4">
      <BackNavigator /> 
      <div className="grid-item">
          <div className="flex gap-x-12">
            <div className="info space-y-4">
              <h6><span className="font-normal">Health ID: </span>{patientInfo.health_id}</h6>
            </div>
          </div>
        </div>
      </div>
      <div className={"grid grid-cols-12 gap-x-16"}>
        <div className={"col-span-12 md:col-span-4 lg:col-span-3 shadow-sm hover:shadow hover:md:shadow-lg"}>
          {patientInfo && <PatientInfoCard patient={patientInfo} facilityName="" session={session}/>}
        </div>
        <div className={"col-span-12 md:col-span-8 lg:col-span-9 shadow-sm hover:shadow hover:md:shadow-lg w-full"}>
          {patientInfo && <PatientTabs patientInfo={patientInfo} encounters={patientEncounterList ?? []} />}
        </div>
      </div>
      <EncounterModal />
    </>
  )
})
