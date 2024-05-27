"use client";
import React, { memo } from "react";
import dynamic from "next/dynamic";
import { useLoggedInStore } from "@store/useLoggedInStore";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getAPIResponse, getRevalidationTime } from "@library/utils";
import { getBaseUrl, getUrlFromName } from "@utils/lib/apiList";
import { ESPatientInterface } from "@api/providers/elasticsearch/patientIndex/interfaces/ESPatientInterface";
import { EncounterListItem } from "@utils/interfaces/Encounter/Encounter";
import EncounterModal from "./EncounterSegment/EncounterModal";
import { signOut } from "next-auth/react";
import { delay } from "lodash";
import { retrieveMinioImageAsBase64 } from "@providers/minio/MinioBase";

/**
 * Dynamic Imports Patient ID Blocks
 */

const BackNavigator = dynamic(() => import("@components/globals/BackNavigator"), {
  ssr: true,
});

const PatientInfoCard = dynamic(() => import("@components/profilePage/PatientInfoCard/PatientInfoCard"), {
  ssr: true,
});


const PatientTabs = dynamic(
  () => import("@components/profilePage/PatientTabs"),
  {
    ssr: true,
  },
);

function usePatientDataSuspenseQuery(props: { access_token: string, patientHid: string }) {
  console.log("User's access_token " + props.access_token);
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
    console.log(query.data)
    console.log("LOGGING OUT due in invalid access_token")
      delay(async()=>await signOut(), 2000);
  }
  return [query.data as EncounterListItem[], query] as const;
}

export default function PatientProfileMain({ session }: any) {

  const { patientId } = useLoggedInStore();
  console.log(patientId);
  console.log("session in detail page");
  console.log(session);
  const [patientInfo, isLoading] = usePatientDataSuspenseQuery({ access_token:  session.accessToken ? session.accessToken:"", patientHid: patientId ?? "" });
  console.log("Patient Id from Store is - ");
  const [patientEncounterList] = usePatientEncounterSuspenseQuery({  access_token:  session.accessToken ? session.accessToken:"", patientHid: patientId ?? "" });
  
  return (
    <>
      <BackNavigator />
      <div className={"grid grid-cols-12 gap-x-16"}>
        <div className={"col-span-12 md:col-span-4 lg:col-span-3 shadow-sm hover:shadow hover:md:shadow-lg"}>
          {patientInfo && <PatientInfoCard patient={patientInfo} facilityName=""/>}
        </div>
        <div className={"col-span-12 md:col-span-8 lg:col-span-9 shadow-sm hover:shadow hover:md:shadow-lg w-full"}>
          {patientInfo && <PatientTabs patientInfo={patientInfo} encounters={patientEncounterList ?? []} />}
        </div>
      </div>
      <EncounterModal />
    </>
  )
}
