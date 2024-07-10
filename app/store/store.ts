import { xMonthsAgo } from "@utils/utilityFunctions";

import { create } from "zustand";

//section 1:
export interface StoreStates {
  errorInAPI: boolean;
  apiCallInProgress: boolean;
  requireAuth: boolean;
  selectedDivision: string[];
  dashboardDemographicViewState: number;
  demographyMinDate: Date;
  demographyMaxDate: Date;
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
  serviceOverviewMinDate: xMonthsAgo(2),
  serviceOverviewMaxDate: xMonthsAgo(0),
  serviceOverviewApiCallInProgress: false,
  renderType: "RSC"
};

export interface StoreActions {
  setDemoGraphyMinDate: (date: Date) => void;
  setDemoGraphyMaxDate: (date: Date) => void;
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
