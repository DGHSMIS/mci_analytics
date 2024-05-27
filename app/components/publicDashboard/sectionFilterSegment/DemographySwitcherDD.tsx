"use client";

import DropDownSingle from "@library/form/DropDownSingle";
import { useStore } from "@store/store";
import { dropDownItems } from "@utils/constants";
import React from "react";

// interface DemographySwitcherDDProps {
//   //   switchedIndex: (index: number) => void;
// }

export default function DemographySwitcherDD() {
  const {
    dashboardDemographicViewState,
    setDashboardDemographicViewState,
    setApiCallInProgress,
    setErrorInAPI,
  } = useStore();

  return (
    <DropDownSingle
      size="sm"
      label=""
      placeholder={"Switch Dataset"}
      leftIcon={dropDownItems[dashboardDemographicViewState ?? 0].icon}
      items={dropDownItems ?? []}
      index={dashboardDemographicViewState}
      // className="md:border-radius-r-none md:border-radius-b-none md:rounded-none md:border-slate-200 md:border-r-transparent md:border-t-transparent"
      isDisabled={false}
      isRequired={true}
      isFilterable={false}
      //tab
      onChange={(e: any) => {
        let index: number | undefined = undefined;
        dropDownItems.forEach(function (item, i) {
          if (item.id == e.data.id) {
            if (index == undefined) {
              index = i;
              return true;
            }
          }
        });
        if (index == undefined) index = 0;
        setDashboardDemographicViewState(index);
        setApiCallInProgress(false);
        setErrorInAPI(false);
      }}
      onBlur={(e: any) => {
        console.log("On Blur!");
        console.log(e);
      }}
    />
  );
}
