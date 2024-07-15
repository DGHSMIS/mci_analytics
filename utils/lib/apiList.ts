import process from "process";

interface ApiUrlInterface {
  name: string;
  urlPath: string; // urlPath can be a string or a function
}

//create a list of all the api endpoints
const apiList: ApiUrlInterface[] = [
  {
    name: "get-facilitywise-count-stats",
    urlPath: "/api/es/analytics/patient/get-facility-type-registration-stats",
  },
  {
    name: "get-areawise-count-stats",
    urlPath: "/api/es/analytics/patient/get-areawise-registration-stats",
  },
  {
    name: "get-genderwise-count-stats",
    urlPath: "/api/es/analytics/patient/get-genderwise-stats",
  },
  {
    name: "get-top-registarar-facilities",
    urlPath: "/api/es/analytics/patient/get-top-registrar-facilities",
  },
  {
    name: "get-agewise-count-stats",
    urlPath: "/api/es/analytics/patient/get-agewise-stats",
  },
  {
    name: "get-patient-listing",
    urlPath: "/api/es/patient/get-latest-data",
  },
  {
    name: "get-patient",
    urlPath: "/api/es/patient/get-patient",
  },
  {
    name: "get-facility-service-overview",
    urlPath: "/api/es/analytics/patient/get-top-registrar-facilities",
  },
  {
    name: "auth-url",
    urlPath: "/api/1.0/sso/signin",
  },
  {
    name: "auth-verify-url",
    urlPath: "/api/1.0/sso/token/",
  },
  {
    name: "auth-get-facility-by-id",
    urlPath: "/api/1.0/facilities/",
  },
  {
    name: "/get-patient-encounter/:id",
    urlPath: "/patients/:id/encounters",
  },
  {
    name: "get-patient-encounters-by-hid",
    urlPath: "/api/es/patient/get-patient-encounters",
  },
  {
    name: "get-patient-encounter-by-hid-and-encounter-id",
    urlPath: "/api/es/patient/get-patient-encounter-by-id",
  },
  {
    name: "get-identity-info",
    urlPath: "/api/ids/get-identity",
  },
  {
    name: "get-mci-patient",
    urlPath: "/api/ids/get-mci-patient",
  },
  {
    name: "get-patient-photo",
    urlPath: "/api/ids/get-patient-nid-photo",
  },
  {
    name: "get-patient-health-card",
    urlPath: "/api/ids/get-patient-health-card",
  }
];
/**
 * Returns the URL for the given API name.
 * @param {string} routePath
 * @param {string} patientId
 * @returns {string}
 */
export const getFHIRServerEncounterURL = (
  routePath: string,
  patientId: string
): string => {
  const freeSHRBaseUrl = process.env.FREESHR_API_BASEURL ?? "";
  let constructFHIRUrl = getUrlFromName(routePath) ?? "";
  console.log("The Encounter URL Object is");
  console.log(constructFHIRUrl);
  if (constructFHIRUrl.length == 0) {
    return "";
  }
  //replace :id with patientId
  constructFHIRUrl = constructFHIRUrl.replace(":id", patientId);
  console.log("Constructed Encounter URL is");
  console.log(freeSHRBaseUrl + constructFHIRUrl);
  return freeSHRBaseUrl + constructFHIRUrl;
};

/**
 * Returns the URL for the given API name.
 * @param {string} name
 * @returns {string}
 */
export function getUrlFromName(name: string) {
  const findUrl = apiList.find((api) => api.name === name);
  if (!findUrl) {
    return "";
  }
  return findUrl?.urlPath;
}

/**
 * Returns the base URL for authentication.
 * If the NEXT_PUBLIC_AUTH_BASE_URL environment variable is set, it is returned.
 * Otherwise, the default value of "127.0.0.1" is returned.
 *
 * @returns The base URL for authentication
 */
export function getAuthBaseUrl(): string {
  // Use the ?? operator to provide a default value if NEXT_PUBLIC_AUTH_BASE_URL is not set
  return String(process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? "127.0.0.1");
}

/**
 * get the base url from the env variable
 * @returns {string}
 */
export function getBaseUrl(): string {
  return String(process.env.NEXT_PUBLIC_API_URL ?? "127.0.0.1");
}


/**
 * Returns the URL for the given API name.
 * @param {string} name
 * @param {number | string} facilityId
 * @returns {string}
 */
export function resolveFacilityDetailURLFromNameAndId(
  name: string,
  facilityId: number | string
): string {
  const findUrl: ApiUrlInterface | undefined = apiList.find(
    (api) => api.name === name
  );
  if (!findUrl) {
    return "";
  }
  // console.log("The url is");
  // console.log(
  //   getAuthBaseUrl() + findUrl.urlPath + String(facilityId) + ".json"
  // );
  return getAuthBaseUrl() + findUrl.urlPath + String(facilityId) + ".json";
}
