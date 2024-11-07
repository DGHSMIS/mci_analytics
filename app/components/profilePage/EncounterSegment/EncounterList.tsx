"use client";
import { EncounterListItem, EncounterListProps } from "@utils/interfaces/DataModels/Encounter";
import { filterArray } from "@utils/utilityFunctions";
import dynamic from "next/dynamic";
import { memo, useEffect, useState } from "react";

const EncounterListingTable = dynamic(() => import("@components/profilePage/EncounterSegment/EncounterListingTable"), {
  ssr: true,
});


const  TextField = dynamic(() => import("@library/form/TextField"), {
  ssr: true,
} );
function EncounterList({ encounters } : EncounterListProps) {
  console.log("Encounters are - ");
  console.log(encounters);
  if(!encounters) return null;
  const totalItems = encounters.length;
  if (totalItems == 0  ) return null;

  const [encounterList, setEncounterList] = useState<EncounterListItem[]>(encounters);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    if (searchText.length > 0) {
     const filtered = filterArray(encounters, searchText);
     console.log("The encounter list is -");
     console.log(filtered);
      setEncounterList(filtered);
    } else {
      setEncounterList(encounters);
    }

  }, [searchText]);

  return (
    <div className="w-full flex flex-col space-y-12">
      <div className="flex justify-between space-x-12 items-center">
        <TextField
          placeholder="Filter your clinical data"
          value={searchText}
          fieldHeight="sm"
          onChange={(e) => {
            console.log(e.data);
            setSearchText(String(e.data))
            // setSearchText(e.target.value);
            // setHid(e.target.value)
          }}
        />
      </div>
      <div className="overflow-scroll md:overflow-auto">
        <EncounterListingTable encounters={encounterList} />
      </div>
    </div>
  );
}

export default memo(EncounterList);