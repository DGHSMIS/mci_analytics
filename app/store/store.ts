import { DropDownSingleItemProps } from "@library/form/DropDownSingle";
import { addXDaysToDate, xMonthsAgo } from "@utils/utilityFunctions";

import { create } from "zustand";

//Public Unaugmented Store
export interface StoreStates {
  errorInAPI: boolean;
  apiCallInProgress: boolean;
  requireAuth: boolean;
  selectedDivision: string[];
  dashboardDemographicViewState: number;
  demographyMinDate: Date;
  demographyMaxDate: Date;
  ncdDataMinDate: Date;
  ncdDataMaxDate: Date;
  ncdAggregatedFacilityDDItems: DropDownSingleItemProps[]
  ncdAggregatedSelectedFacility: string;
  ncdDiseaseDDItems: DropDownSingleItemProps[];
  ncdDiseaseSelected: string;
  serviceOverviewMinDate: Date;
  serviceOverviewMaxDate: Date;
  serviceOverviewApiCallInProgress: boolean;
  renderType: "RSC" | "SSR" | "Client" | undefined
}

export const initialStoreStates: StoreStates = {
  errorInAPI: false,
  apiCallInProgress: false,
  requireAuth: false,
  selectedDivision: [],
  dashboardDemographicViewState: 0,
  demographyMinDate: xMonthsAgo(2),
  demographyMaxDate: xMonthsAgo(0),
  ncdDataMinDate: xMonthsAgo(7),
  ncdDataMaxDate: addXDaysToDate(0),
  ncdAggregatedFacilityDDItems: [],
  ncdAggregatedSelectedFacility: "",
  ncdDiseaseDDItems: [],
  ncdDiseaseSelected: "",
  serviceOverviewMinDate: xMonthsAgo(2),
  serviceOverviewMaxDate: xMonthsAgo(0),
  serviceOverviewApiCallInProgress: false,
  renderType: "RSC"
};

export interface StoreActions {
  setDemoGraphyMinDate: (date: Date) => void;
  setDemoGraphyMaxDate: (date: Date) => void;
  setNCDDataMinDate: (date: Date) => void;
  setNCDDataMaxDate: (date: Date) => void;
  setNcdAggregatedFacilityDDItems: (facilityList: DropDownSingleItemProps[]) => void;
  setNcdAggregatedSelectedFacility: (facility: string) => void;
  setNcdDiseaseDDItems: (dieseaseList: DropDownSingleItemProps[]) => void;
  setNcdDiseaseSelected: (disease: string) => void;
  setRequireAuth: (requireAuth: boolean) => void;
  setErrorInAPI: (hasError: boolean) => void;
  setApiCallInProgress: (inProgress: boolean) => void;
  setServiceApiCallInProgress: (inProgress: boolean) => void;
  setDashboardDemographicViewState: (view: number) => void;
  setSelectedDivision: (division: string[]) => void;
  resetSelectedDivision: () => void;
  setRenderType: (type: "RSC" | "SSR" | "Client") => void;
  setServiceOverviewMinDate: (date: Date) => void;
  setServiceOverviewMaxDate: (date: Date) => void;

}
// Primary store without selectors
export const useStore = create<StoreStates & StoreActions>(
  // devtools(
  (set) => ({
    ...initialStoreStates,
    setServiceOverviewMinDate: (date: Date) =>
      set({ serviceOverviewMinDate: date }),
    setServiceOverviewMaxDate: (date: Date) =>
      set({ serviceOverviewMaxDate: date }),
    setDemoGraphyMinDate: (date: Date) => set({ demographyMinDate: date }),
    setDemoGraphyMaxDate: (date: Date) => set({ demographyMaxDate: date }),
    setNcdAggregatedFacilityDDItems: (facilityList: DropDownSingleItemProps[]) => set({ncdAggregatedFacilityDDItems: facilityList}),
    setNcdAggregatedSelectedFacility: (facility: string) => set({ ncdAggregatedSelectedFacility: facility }),
    setNcdDiseaseDDItems: (dieseaseList: DropDownSingleItemProps[]) => set({ ncdDiseaseDDItems: dieseaseList }),
    setNcdDiseaseSelected: (disease: string)=> set({ ncdDiseaseSelected: disease }),
    setNCDDataMinDate: (date: Date) => set({ ncdDataMinDate: date }),
    setNCDDataMaxDate: (date: Date) => set({ ncdDataMaxDate: date }),
    setRequireAuth: (requireAuth: boolean) => set({ requireAuth: requireAuth }),
    setErrorInAPI: (errorInAPI: boolean) => set({ errorInAPI: errorInAPI }),
    setApiCallInProgress: (inProgress: boolean) =>
      set({ apiCallInProgress: inProgress }),
    setServiceApiCallInProgress: (inProgress: boolean) =>
      set({ serviceOverviewApiCallInProgress: inProgress }),
    setDashboardDemographicViewState: (viewIndex: number) =>
      set({ dashboardDemographicViewState: viewIndex }),
    setSelectedDivision: (division: string[]) =>
      set({ selectedDivision: division }),
    resetSelectedDivision: () => set({ selectedDivision: [] }),
    setRenderType: (type) => set({ renderType: type })
  })
);
