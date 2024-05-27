import { encounterAuthenticationHeaders } from "@utils/constants";
import { getBaseUrl, getFHIRServerEncounterURL, getUrlFromName } from "@utils/lib/apiList";
import { EncounterListItem } from "@utils/interfaces/Encounter/Encounter";
import { getAPIResponse, getRevalidationTime } from "@library/utils";

/**
 * Retrieves the encounters for a specific patient in XML format (FHIR).
 *
 * @param {string} patientId - The ID of the patient.
 * @return {Promise<string>} - A promise that resolves to the encounter data for the patient, or null if the request fails.
 */
export async function getPatientEncounters(
  patientId: string
): Promise<Array<any>> {
  const patientEncounterURL = getFHIRServerEncounterURL(
    "/get-patient-encounters/:id",
    patientId
  );
  console.log("Got Encounter URL in provider");
  console.log(patientEncounterURL);
  console.log(patientEncounterURL.length == 0 ? "Empty URL" : "Not Empty URL");
  if (patientEncounterURL.length == 0) {
    return [];
  }
  console.log("The request URL Is");
  console.log(patientEncounterURL);
  console.log("The request headers are");
  console.log(encounterAuthenticationHeaders);

  const getPatientEncounterResponse = await fetch(patientEncounterURL, {
    method: "GET",
    next: { revalidate: process.env.NODE_ENV === "production" ? 3600 : 0 },
    headers: encounterAuthenticationHeaders,
  });

  console.log("Got response for Encounter API");
  console.log(getPatientEncounterResponse);
  console.log("The response headers are - ");
  console.log(getPatientEncounterResponse.headers);
  console.log(getPatientEncounterResponse.status);

  if (getPatientEncounterResponse.status === 200) {
    return await getPatientEncounterResponse.json();
  } else {
    return [];
  }
}

export async function getPatientEncountersByPatientHid(hid: string, accessToken = ""):Promise<{ patientEncounters: EncounterListItem[] }> {
  return await getAPIResponse(
    getBaseUrl(),
    getUrlFromName("get-patient-encounters-by-hid") +
    "?hid=" +
    hid,
    accessToken || "",
    // "",
    "GET",
    null,
    false,
    getRevalidationTime(),
  ).then((res) => {
    return {
      patientEncounters: res
    }
  });
}
