"use client";

import { ESPatientInterface } from "@api/providers/elasticsearch/patientIndex/interfaces/ESPatientInterface";
import { MCISpinner } from "@components/MCISpinner";
import SkeletonAddressBlock from "@components/profilePage/AddressBlock/SkeletonAddressBlock";
import { SkeletonPersonalInfo } from "@components/profilePage/PersonalInfo";
import { SkeletonTab, TabItemProps } from "@library/Tabs";
import { EncounterListItem } from "@utils/interfaces/Encounter/Encounter";
import { getUserAddressesFromInstance } from "@utils/utilityFunctions";
import dynamic from "next/dynamic";
import React, { memo, useState } from "react";

const Tabs = dynamic(() => import("@library/Tabs"), {
  ssr: true,
  loading: () => (
    <SkeletonTab tabItemCount={3} tabItemCustomClassName="w-[8rem] h-[44px]" />
  ),
});

const AddressBlock = dynamic(() => import("@components/profilePage/AddressBlock/AddressBlock"), {
  ssr: true,
  loading: () => <SkeletonAddressBlock />,
});

const PersonalInfo = dynamic(
  () => import("@components/profilePage/PersonalInfo"),
  {
    ssr: true,
    loading: () => <SkeletonPersonalInfo />,
  },
);
const Encounters = dynamic(() => import("@components/profilePage/EncounterSegment/Encounters"), {
  ssr: true,
  loading: () => (
    <MCISpinner classNames="max-h-[100vh] min-h-[80vh] h-full w-full flex align-center justify-center" />
  ),
});

interface PatientDetailsProps {
  patientInfo: ESPatientInterface;
  encounters: EncounterListItem[];
}

const PatientTabs: React.FC<PatientDetailsProps> = ({
                                                      patientInfo,
                                                      encounters,
                                                    }: PatientDetailsProps) => {
  const [tabItemToShow, setTabItemToShow] = useState(0);
  const tabItemsNew: TabItemProps[] = [
    {
      name: "User Info",
      count: "",
      current: true,
      icon: "info-circle",
      isDisabled: false,
    },
    {
      name: "Address",
      count: "",
      current: false,
      icon: "map-01",
      isDisabled: false,
    },
    {
      name: "Clinical Data",
      count: "",
      current: false,
      icon: "medical-circle",
      isDisabled: false,
    }
  ];


  function changeSelectedTab(id: number) {
    console.log(id);
    setTabItemToShow(id);
  }


  const addressItems = getUserAddressesFromInstance(patientInfo);

  // console.log("<<<patientInfo>>>");
  // console.log(patientInfo);

  // const resource = JSON.parse(fhirResource);
  return (
    <div className="w-full m-h-[300px] h-full py-16 md:py-0 userProfileTabs">
      <Tabs align="left" tabItems={tabItemsNew} itemChanged={(e) => changeSelectedTab(e)} />
      {/* Create padding when on mobile screen using tailwind */}
      <div className="py-8 md:py-0"></div>
      <span className=" shadow-sm hover:shadow hover:md:shadow-lg">
        {tabItemToShow==0 && (
          <PersonalInfo
            eduLevel={patientInfo.edu_level ?? "Unavailable"}
            pob={"Unavailable"}
            dod={patientInfo.date_of_death!=null ? String(patientInfo.date_of_death) : undefined}
            nationality={patientInfo.nationality ?? "Unknown"}
            religion={patientInfo.religion ?? "Unavailable"}
            bloodGroup={patientInfo.blood_group ?? "Unavailable"}
            disability={patientInfo.disability ?? ""}
            maritalStatus={patientInfo.marital_status ?? "Unavailable"}
            occupation={patientInfo.occupation ?? "Unavailable"}
            confidential={patientInfo.confidential ? "Yes":"No"}
            phone={patientInfo.phone_no ?? "Unavailable"}
          />
        )}
        {tabItemToShow==1 && <AddressBlock items={addressItems} />}
        {tabItemToShow==2 && <Encounters encounters={encounters} />}
      </span>

    </div>
  );
};

export default memo(PatientTabs);
