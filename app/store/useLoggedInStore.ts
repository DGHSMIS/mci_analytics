import { ESPatientInterface } from "@providers/elasticsearch/patientIndex/interfaces/ESPatientInterface";
import { EncounterListItem } from "@utils/interfaces/DataModels/Encounter";
import { Fhir } from "fhir";
import { create } from "zustand";

export interface LoggedInStoreStates {
  patientId: string | null;
  clientId: string | null;
  showEncounterData: boolean;
  selectedEncounter: EncounterListItem | null;
  patient: ESPatientInterface | null;
  fhirData: Fhir | null;
}

export const initialLoggedInStoreStates: LoggedInStoreStates = {
  patientId: null,
  clientId: null,
  showEncounterData: false,
  selectedEncounter: null,
  patient: null,
  fhirData: null
};

export interface LoggedInStoreActions {
  setShowEncounterData: (showModal: boolean) => void;
  setSelectedEncounter: (encounter: EncounterListItem|null) => void;
  setPatient: (patient: ESPatientInterface|null) => void;
  setPatientId: (patientId: string|null) => void;
  setClientId: (patientId: string|null) => void;
  setFhirData: (data: Fhir) => void;
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
    setClientId: (clientId: string | null) => set({ clientId: clientId }),
    setFhirData: (data) => set({ fhirData: data }),
  })
);
