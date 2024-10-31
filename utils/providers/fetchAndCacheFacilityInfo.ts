import { errorFacilityData, fetchedFacilityArrayOfObjects } from "@providers/elasticsearch/patientIndex/ESPatientIndex";
import { getFacilitySolutionTypeFromName } from "@utils/constants";
import { FacilityInterface } from "@utils/interfaces/FacilityInterfaces";
import { resolveFacilityDetailURLFromNameAndId } from "@utils/lib/apiList";

/**
 * Fetches and caches facility information.
 * @param facilityId The ID of the facility to fetch.
 * @returns A promise that resolves to the facility data.
 */
export default async function fetchAndCacheFacilityInfo(facilityId: number, showDebug:boolean = false): Promise<FacilityInterface> {
  if(showDebug) console.log('No of Items cached:', fetchedFacilityArrayOfObjects.length);

  if(showDebug) console.log('Facility ID is:', facilityId);
  // Check for invalid facility ID
  if (Number.isNaN(facilityId)) {
    console.log('Facility ID Invalid');
    return errorFacilityData;
  }
  try {
    // Check cache for existing facility information
    const foundItem = fetchedFacilityArrayOfObjects.find((item:FacilityInterface) => item.id === facilityId);
    if (foundItem) {
      // console.log("<<<< Facility Already Fetched >>>>");
      // console.log(foundItem);
      return await Promise.resolve(foundItem);
    }
  } catch (error) {
    if(showDebug) console.error('Error fetching facility data:', error);
  }

  // Resolve URL for the API call
  const getFacilityURL = resolveFacilityDetailURLFromNameAndId("auth-get-facility-by-id", facilityId);
  if(showDebug) console.log('Making Facility API Call to:', getFacilityURL);

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
      // console.log('API call successful');
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
      };
      
      if(showDebug){
        console.log("Prepared Facility Data:");
        console.log(facilityData);
      }

      // Add the newly fetched facility data to the cache
      fetchedFacilityArrayOfObjects.push(facilityData);
       return await Promise.resolve(facilityData);
    } else {
      if(showDebug) console.log('API call failed with status:', response.status);
      const apiErrorResult = { ...errorFacilityData, id: facilityId };
      fetchedFacilityArrayOfObjects.push(apiErrorResult);
       return await Promise.resolve(apiErrorResult);
    }
  } catch (error) {
    if(showDebug) console.error('Error fetching facility data:', error);
    const apiErrorResult = { ...errorFacilityData, id: facilityId };
    fetchedFacilityArrayOfObjects.push(apiErrorResult);
     return await Promise.resolve(apiErrorResult);
  }
}
