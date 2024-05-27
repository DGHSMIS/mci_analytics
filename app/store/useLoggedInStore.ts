import { create } from "zustand";
import { ESPatientInterface } from "@api/providers/elasticsearch/patientIndex/interfaces/ESPatientInterface";
import { EncounterListItem } from "@utils/interfaces/Encounter/Encounter";

export interface LoggedInStoreStates {
  patientId: string | null;
  showEncounterData: boolean;
  selectedEncounter: EncounterListItem | null;
  patient: ESPatientInterface | null;
}

export const initialLoggedInStoreStates: LoggedInStoreStates = {
  patientId: null,
  showEncounterData: false,
  selectedEncounter: null,
  patient: null,
};

export interface LoggedInStoreActions {
  setShowEncounterData: (showModal: boolean) => void;
  setSelectedEncounter: (encounter: EncounterListItem|null) => void;
  setPatient: (patient: ESPatientInterface|null) => void;
  setPatientId: (patientId: string|null) => void;
}
// Primary store without selectors
export const useLoggedInStore = create<
  LoggedInStoreStates & LoggedInStoreActions
>(
  // devtools(
  (set) => ({
    ...initialLoggedInStoreStates,
    setShowEncounterData: (showEncounterData: boolean) =>
      set({ showEncounterData: showEncounterData }),
    setSelectedEncounter: (selectedEncounter: EncounterListItem|null) =>
      set({ selectedEncounter: selectedEncounter }),
    setPatient: (patient: ESPatientInterface|null) => set({ patient: patient }),
    setPatientId: (patientId: string | null) => set({ patientId: patientId }),
  })
);
