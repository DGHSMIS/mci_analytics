"use client";
import React, { memo } from "react";
import { useLoggedInStore } from "@store/useLoggedInStore";
import dynamic from "next/dynamic";

const EncounterDetails = dynamic(() => import("@components/profilePage/EncounterSegment/EncounterDetails"), {
  ssr: true,
});

function EncounterModal() {
  const { selectedEncounter, patient } = useLoggedInStore();
  if(!selectedEncounter) return <></>;
  return <EncounterDetails
    encounterId={String(useLoggedInStore.getState().selectedEncounter?.id)}
    hid={String(useLoggedInStore.getState().patient?.health_id)}
  />
}
export default memo(EncounterModal);