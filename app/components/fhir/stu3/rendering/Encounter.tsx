import React, { memo } from "react";
import { Encounter } from "fhir/r3";

interface EncounterProps {
  data: Encounter;
}
export default memo(function Encounter({ data }: EncounterProps) {

  //Loop through the attributes of the Encounter (stu3) and display them in a grid
  //Use the EncounterSegment component as a reference
  
  return <></>;
});