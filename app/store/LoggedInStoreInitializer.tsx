"use client";

import { LoggedInStoreStates, useLoggedInStore } from "@store/useLoggedInStore";
import { useRef } from "react";
import getQueryClient from "@utils/providers/reactQuery/getQueryClient";
import { PatientDetailPageData } from "@utils/providers/patientProvider";

function LoggedInStoreInitializer(
  loggedInStoreStates: LoggedInStoreStates
) {
  const data:PatientDetailPageData  = getQueryClient().getQueryData(["patient", loggedInStoreStates.patientId]) ?? {
    patientInfo: null,
    patientEncounterList: null,
  }
  const initialized = useRef(false);
  console.log("Logged In Store Initializer");
  //We want to initialize it only once.
  if (!initialized.current) {
    useLoggedInStore.setState({
      ...loggedInStoreStates,
      patient: data.patientInfo
    });
    initialized.current = true;
  }
  return null;
}
export default LoggedInStoreInitializer;
