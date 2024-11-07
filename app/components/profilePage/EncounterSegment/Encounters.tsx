/**
 * Developed by Fahim Hossain
 * Designation: Software Specialist, MIS, DGHS
 * Email: fahim@aritsltd.com
 * website: https://aritsltd.com
 */
"use client";
import { EncounterListProps } from "@utils/interfaces/DataModels/Encounter";
import dynamic from "next/dynamic";
import { memo } from "react";

const Alert = dynamic(() => import("@library/Alert"), {
  ssr: true,
});
const EncounterList = dynamic(() => import("@components/profilePage/EncounterSegment/EncounterList"), {
  ssr: true,
});
export default memo(function Encounters(encounters : EncounterListProps) {

  return (
    <div className="card h-full border border-slate-200 hover:shadow-sm md:gap-y-12 w-full !p-16">
      {encounters.encounters.length > 0 ?
        <EncounterList {...encounters} /> :
        <Alert
          iconName="alert-triangle"
          className="w-full h-fit flex flex-col justify-center items-center"
          variant="secondary"
          showBtn={false}
          isIconClicked={false}
          title="No Results"
          body="We couldn't find any encounters for this patient."
          isBtnGhost={true}
          hideCross={true}
        />
      }
    </div>
  );
});
