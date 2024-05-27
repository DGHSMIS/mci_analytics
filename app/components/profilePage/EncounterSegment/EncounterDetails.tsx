"use client";

import { MCISpinner } from "@components/MCISpinner";
import { getAPIResponse } from "@library/utils";
import { getBaseUrl, getUrlFromName } from "@utils/lib/apiList";
import dynamic from "next/dynamic";
import React, { memo } from "react";
import { PaletteColorOptions, useTheme } from "@mui/material";
import variables from "@variables/variables.module.scss";
import { useLoggedInStore } from "@store/useLoggedInStore";
// import ModalBlank from "@library/ModalBlank";
import { useQuery } from "@tanstack/react-query";
import { EncounterListItem } from "@utils/interfaces/Encounter/Encounter";

interface EncounterDetailsProps {
  encounterId: string;
  hid: string;
}


const ModalBlank = dynamic(() => import("@library/ModalBlank"), {
  ssr: true
});


const FHIRData = dynamic(() => import("@components/fhir/FHIRData"), {
  ssr: true,
  loading: () => (
    <MCISpinner classNames="max-h-[100vh] min-h-[80vh] h-full w-full flex align-center justify-center" />
  ),
});


const Alert = dynamic(() => import("@library/Alert"), {
  ssr: true,
  loading: () => <MCISpinner classNames="max-h-[100vh] min-h-[80vh] h-full w-full flex align-center justify-center" />,
});




const EncounterDetails = ({ encounterId, hid }: EncounterDetailsProps) => {

  const { setSelectedEncounter, setShowEncounterData, selectedEncounter, patient, patientId } = useLoggedInStore();

  if(!selectedEncounter || !patientId) return <></>;
  /* @ts-ignore */
  const { data, status } = useQuery({
    queryKey: ["patientEncounter", patientId, selectedEncounter?.id],
    queryFn: async () => await getAPIResponse(
      getBaseUrl(),
      getUrlFromName("get-patient-encounter-by-hid-and-encounter-id") +
      "?hid=" +
      patientId +
      "&encounterId=" +
      selectedEncounter?.id,
      "",
      "GET",
      null,
      false,
      0,
    ),
    staleTime: Infinity,
    retry: 3,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const fhirBundle = data as EncounterListItem;
  console.log("The fhir bundle is - ");
  console.log(fhirBundle);


  // Create a theme instance.
  const globalTheme = useTheme();
  const primaryColor: PaletteColorOptions = {
    light: variables.primary100,
    main: variables.primary500,
    dark: variables.primary700,
    contrastText: variables.gray200,
  };


  return (
      <div className="h-full bg-white w-full">
        <ModalBlank
          containerClassName={"bg-white"}
          className={"!bg-white space-y-8 h-full w-full md:h-[90vh] md:w-[90vw] fixed overflow-y-hidden"}
          onClickOutToClose={false}
          modalSize={"full"}
          modalAlign={"center"}
          showCrossButton={true}
          onCloseModal={() => {
            setShowEncounterData(false);
            setSelectedEncounter(null);
          }}
        >

          {status === "error" && <Alert
            iconName="alert-triangle"
            className="w-full"
            variant="warning"
            isIconClicked={() => null}
            showBtn={false}
            title="Ops! Error Fetching Encounter Data"
            body="We have encountered an error while fetching the encounter data. Please try again later or contact system administrator."
            isBtnGhost={true}
            hideCross={true}
          />}

          {status ==="pending" && <MCISpinner classNames="max-h-[100vh] min-h-[80vh] h-full w-full flex align-center justify-center" />}

          {status==="success"  &&
            <div className={"w-full h-full min-h-[80vh] overflow-scroll"}>
                <FHIRData
                  key={selectedEncounter.id}
                  json={fhirBundle}
                  encounter={selectedEncounter}
                />
            </div>
          }
        </ModalBlank>
      </div>
  );
};

export default memo(EncounterDetails);
