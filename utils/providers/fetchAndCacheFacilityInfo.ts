import { errorFacilityData } from "@providers/elasticsearch/patientIndex/ESPatientIndex";
import prisma from "@providers/prisma/prismaClient";
import { FacilityInterface } from "@utils/interfaces/DataModels/FacilityInterfaces";
import { resolveFacilityDetailURLFromNameAndId } from "@utils/lib/apiList";
import { getFacilitySolutionTypeFromName } from "@utils/utilityFunctions";
import { LRUCache } from "lru-cache";


// Initialize the LRU cache with a maximum size and optional TTL (Time-to-Live)
const facilityCache = new LRUCache<number | string, FacilityInterface>({
  max: 1000, // Maximum number of facilities to cache
  ttl: 12000 * 60 * 60, // Optional: 12 hour in milliseconds
});

/**
 * Fetches and caches facility information.
 * @param facilityId The ID of the facility to fetch.
 * @param showDebug Optional: Show debug information.
 * @returns A promise that resolves to the facility data.
 */

export default async function fetchAndCacheFacilityInfo(
  facilityId: number | string,
  showDebug: boolean = false
): Promise<FacilityInterface> {
  if (showDebug) console.log('Number of Items cached:', facilityCache.size);
  if (showDebug) console.log('Facility ID is:', facilityId);

  // Check for invalid facility ID
  if (Number.isNaN(Number(facilityId))) {
    console.log('Facility ID Invalid');
    return errorFacilityData;
  }

  // Attempt to retrieve from cache
  try {
    const cachedFacility = facilityCache.get(facilityId);
    if (cachedFacility !== undefined) {
      if (showDebug) console.log('Facility found in cache:', cachedFacility);
      return cachedFacility;
    }
  } catch (error) {
    if (showDebug) console.error('Error accessing cache:', error);
    // Depending on requirements, you might choose to return an error or continue fetching
  }

  // Resolve URL for the API call
  const getFacilityURL = resolveFacilityDetailURLFromNameAndId("auth-get-facility-by-id", facilityId);
  if (showDebug) console.log('Making Facility API Call to:', getFacilityURL);

  try {
    const response = await fetch(getFacilityURL, {
      method: "GET",
      // cache: 'force-cache',
      next: { revalidate: false },
      headers: {
        "X-Auth-Token": process.env.NEXT_X_FACILITY_AUTH_TOKEN || "",
        "client-id": process.env.NEXT_X_FACILITY_CLIENT_ID || "",
      },
    });

    if (response.status === 200) {
      // API call successful
      const facilityAllData = await response.json();
      const facilityData: FacilityInterface = {
        id: facilityId,
        code: String(facilityId),
        name: facilityAllData.name ?? "",
        address: facilityAllData.address_line ?? "",
        solutionType: getFacilitySolutionTypeFromName(facilityAllData.name) || "openMRS+",
        divisionCode: facilityAllData.properties.locations.division_code ?? "",
        districtCode: facilityAllData.properties.locations.district_code ?? "",
        upazilaCode: facilityAllData.properties.locations.upazila_code ?? "",
        catchment: facilityAllData.properties.catchment.length > 0 ? facilityAllData.properties.catchment[0] : "",
        careLevel: facilityAllData.properties.care_level ?? "",
        ownership: facilityAllData.properties.ownership ?? "",
        orgType: facilityAllData.properties.org_type ?? "",
        hasApiError: false, // Optional: Indicate successful fetch
      };

      if (showDebug) {
        console.log("Prepared Facility Data:");
        console.log(facilityData);
      }

      // Add the newly fetched facility data to the cache
      facilityCache.set(facilityId, facilityData);
      return facilityData;
    } else {
      if (showDebug) console.log('API call failed with status:', response.status);
      const apiErrorResult: FacilityInterface = {
        ...errorFacilityData,
        id: facilityId,
        hasApiError: true,
      };
      facilityCache.set(facilityId, apiErrorResult);
      return apiErrorResult;
    }
  } catch (error) {
    if (showDebug) console.error('Error fetching facility data:', error);
    const apiErrorResult: FacilityInterface = {
      ...errorFacilityData,
      id: facilityId,
      hasApiError: true,
    };
    facilityCache.set(facilityId, apiErrorResult);
    return apiErrorResult;
  }
}

/**
 * Finds or creates a facility in the database.
 * @param facilityCode The code of the facility to find or create.
 * @returns A promise that resolves to the facility data.
 */
export async function findOrCreateFacility(facilityCode: string): Promise<FacilityInterface> {

  const facilityFromDB = await prisma.facility.findFirst({
    where: { code: facilityCode },
  });
  console.log("The Facility from DB is ")
  console.log(facilityFromDB);
  if (facilityFromDB !== null) {
    return facilityFromDB;
  }
  const facilityData: FacilityInterface = await fetchAndCacheFacilityInfo(Number(facilityCode));

  const newFacility: FacilityInterface = await prisma.facility.create({
    data: {
      code: facilityCode,
      name: facilityData.name,
      divisionCode: facilityData.divisionCode,
      districtCode: facilityData.districtCode,
      upazilaCode: facilityData.upazilaCode,
      catchment: facilityData.catchment,
      careLevel: facilityData.careLevel,
      address: facilityData.address,
      solutionType: facilityData.solutionType,
      ownership: facilityData.ownership,
      orgType: facilityData.orgType,
      createdAt: new Date(),
    },
  });

  console.log('New Facility:', newFacility);
  return newFacility;
}