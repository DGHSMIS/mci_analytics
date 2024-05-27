import { getAPIResponse, getRevalidationTime } from "@library/utils";
import { getBaseUrl, getUrlFromName } from "@utils/lib/apiList";
import { ESPatientInterface } from "@providers/elasticsearch/patientIndex/interfaces/ESPatientInterface";
import { EncounterListItem } from "@utils/interfaces/Encounter/Encounter";

export async function getPatientById(accessToken: string, hid: string) {
  return await getAPIResponse(
    getBaseUrl(),
    getUrlFromName("get-patient") + "?hid=" + hid,
    accessToken ? accessToken:"",
    // "",
    "GET",
    null,
    false,
    getRevalidationTime(),
  );
}

export interface PatientDetailPageData  {
  patientInfo: ESPatientInterface | null
  patientEncounterList: EncounterListItem[] | null;
}

