import { CASSANDRA_PAGE_SIZE } from "@api/providers/cassandra/constants";
import { CreateAndUpdatedByEditorInterface, ESPatientInterface } from "@api/providers/elasticsearch/patientIndex/interfaces/ESPatientInterface";
import { cassandraClient } from "@providers/cassandra/cassandra";
import { DebugElasticProvider, ELASTIC_BATCH_SIZE, patientESIndexName } from "@providers/elasticsearch/constants";
import { esBaseClient } from "@providers/elasticsearch/ESBase";
import { isAaloClinic } from "@utils/constants";
import { CDPatientInterface } from "@utils/interfaces/CDPatientInterface";
import { FacilityInterface } from "@utils/interfaces/FacilityInterfaces";
import fetchAndCacheFacilityInfo from "@utils/providers/fetchAndCacheFacilityInfo";
import { timeUUIDToDate } from "@utils/utilityFunctions";
import { stringify } from "uuid";

// Elasticsearch index name
export const patientESIndex = patientESIndexName;
// Set the desired batch size for indexing
const batchSize = ELASTIC_BATCH_SIZE;

export let fetchedFacilityArrayOfObjects: FacilityInterface[] = [];

export const errorFacilityData: FacilityInterface = {
  id: 0,
  name: "",
  address: "",
  solutionType: "",
  divisionCode: "",
  districtCode: "",
  upazilaCode: "",
  catchment: "",
  careLevel: "",
  ownership: "",
  orgType: "",
  // hasApiError: true,
};


let indexCount = 0;
/**
 * This function converts the data from Cassandra
 * to the format required by Elasticsearch
 * @param document
 * @returns
 */
// ! HOT FIX Temporary - Needs to be resolved - Debugger
let listOfErrorPatients: string[] = [];
let errorCount = 0;
let aloRegCount = 0;
//! Inline function to check if "provider":null,admin": { us present in the string 
// check if "provider":null,admin": { us present in the string
// "provider":null,"admin":{ 
export const temporarilyHotFixJSONObject = (jsonString: string, patientId: string, msg: string = ""): string => {
  let resultString = jsonString ?? "";
  // Corrected the includes check and the replace pattern
  if (resultString.includes('"provider":null,admin": {')) {
    // Correct use of replace with reassignment
    resultString = resultString.replace('"provider":null,admin": {', '"provider":null,"admin": {');
    //Increment Error Count
    if (DebugElasticProvider) {
      if (listOfErrorPatients.filter((item) => item.includes(patientId)).length == 0) {
        listOfErrorPatients.push(patientId);
        errorCount++;
      }
      console.log(`ERROR ${msg} Data is not json string - Temporary Hot Fix`);
    }

  } else {
    if (DebugElasticProvider) console.log("No Error Before Created By Parse");
  }
  if (DebugElasticProvider) console.log(resultString);
  return resultString;
}


/**
 * Maps Cassandra Patient data to Elasticsearch Patient data index
 * @param doc 
 * @returns 
 */
async function convertDataToPatientESFormat(doc: CDPatientInterface) {
  if (!doc.health_id) {
    if (DebugElasticProvider) {
      console.log("ERROR HEALTH ID NOT FOUND");
      errorCount++;
    }
    return await Promise.resolve([]);
  }
  let hasCreatedByFacilityAdminInfo = false;
  let hasUpdatedByFacilityAdminInfo = false;
  try {
    const esDoc: ESPatientInterface = convertCassandraPatientToESPatientIndexObject(doc);
    if (!doc.created_by) {
      if (DebugElasticProvider) {
        console.log("FACILITY NOT FOUND!");
        console.log(doc.created_by);
        errorCount++;
      }
      return await Promise.resolve([]);
    }
    if (DebugElasticProvider) {
      console.log("Before Created By Parse");
      console.log(doc.health_id);
      console.log(doc.created_by);
    }

    //! HOT FIX Temporary - Needs to be resolved
    doc.created_by = temporarilyHotFixJSONObject(doc.created_by, doc.health_id, "created_by");
    esDoc.created_by = JSON.parse(doc.created_by ?? {});
    const created_facility_id = esDoc.created_by.facility ? Number(esDoc.created_by.facility.id) : null;

    if (esDoc.created_by.admin) {
      if (DebugElasticProvider) {
        console.log("<<Created By Admin is present>>");
        console.log(esDoc.created_by.admin.name);
      }
      hasCreatedByFacilityAdminInfo = true;
      esDoc.created_client_id = esDoc.created_by.admin ? Number(esDoc.created_by.admin.id) : null;
    }

    if (esDoc.updated_by.admin) {
      if (DebugElasticProvider) {
        console.log("<<Updated By Admin is present>>");
        console.log(esDoc.updated_by.admin.name);
      }
      hasUpdatedByFacilityAdminInfo = true;
    }

    if (DebugElasticProvider) {
      console.log("created_facility_id is");
      console.log(created_facility_id);
      console.log(typeof created_facility_id);
    }
    if (!created_facility_id) {
      errorCount++;
      return await Promise.resolve([]);
    }

    if (isAaloClinic(String(created_facility_id ?? ""))) {
      aloRegCount++;
    }
    //! HOT FIX Temporary - Needs to be resolved
    doc.updated_by = temporarilyHotFixJSONObject(doc.updated_by, doc.health_id, "updated_by");
    esDoc.updated_by = JSON.parse(doc.updated_by ?? {});
    const updated_facility_id = esDoc.updated_by.facility ? Number(esDoc.updated_by.facility.id) : null;

    if (!updated_facility_id) {
      errorCount++;
      return await Promise.resolve([]);
    }
    // Fetch created and updated facility info concurrently
    const [createdFacilityInfo, updatedFacilityInfo] = await Promise.all([
      created_facility_id ? await fetchAndCacheFacilityInfo(created_facility_id) : null,
      updated_facility_id ? await fetchAndCacheFacilityInfo(updated_facility_id) : null,
    ])

    esDoc.created_facility_id = created_facility_id;
    esDoc.updated_facility_id = updated_facility_id;
    esDoc.user_photo = "";
    // console.log('Created Facilitty Info is');
    // console.log(createdFacilityInfo);
    if (createdFacilityInfo) {
      if (esDoc.created_by.facility) {
        esDoc.created_by.facility.name = createdFacilityInfo ? createdFacilityInfo?.name : "";
        esDoc.created_by.facility.solutionType = createdFacilityInfo ?
          (createdFacilityInfo.name ? createdFacilityInfo.name : "") : "openMRS+"
        esDoc.created_by.facility.divisionCode = createdFacilityInfo ? createdFacilityInfo.divisionCode : "";
        esDoc.created_by.facility.districtCode = createdFacilityInfo ? createdFacilityInfo.districtCode : "";
        esDoc.created_by.facility.upazilaCode = createdFacilityInfo ? createdFacilityInfo.upazilaCode : "";
        esDoc.created_by.facility.catchment = createdFacilityInfo ? createdFacilityInfo.catchment : "";
        esDoc.created_by.facility.careLevel = createdFacilityInfo ? createdFacilityInfo.careLevel : "";
        esDoc.created_by.facility.ownership = createdFacilityInfo ? createdFacilityInfo.ownership : "";
        esDoc.created_by.facility.orgType = createdFacilityInfo ? createdFacilityInfo.orgType : "";
      }
      if (!hasCreatedByFacilityAdminInfo) {
        esDoc.created_by.admin = null;
      }
      esDoc.created_by.provider = null;
    }

    //Map the facility info to the document
    if (updatedFacilityInfo) {
      if (esDoc.updated_by.facility) {
        esDoc.updated_by.facility.name = updatedFacilityInfo ? updatedFacilityInfo.name : "";
        esDoc.updated_by.facility.solutionType =
          updatedFacilityInfo ? updatedFacilityInfo.solutionType : "openMRS+";
        esDoc.updated_by.facility.divisionCode =
          updatedFacilityInfo ? updatedFacilityInfo.divisionCode : "";
        esDoc.updated_by.facility.districtCode =
          updatedFacilityInfo ? updatedFacilityInfo.districtCode : "";
        esDoc.updated_by.facility.upazilaCode =
          updatedFacilityInfo ? updatedFacilityInfo.upazilaCode : "";
        esDoc.updated_by.facility.catchment = updatedFacilityInfo ? updatedFacilityInfo.catchment : "";
        esDoc.updated_by.facility.careLevel = updatedFacilityInfo ? updatedFacilityInfo.careLevel : "";
        esDoc.updated_by.facility.ownership = updatedFacilityInfo ? updatedFacilityInfo.ownership : "";
        esDoc.updated_by.facility.orgType = updatedFacilityInfo ? updatedFacilityInfo.orgType : "";
      }
      if (!hasUpdatedByFacilityAdminInfo) {
        esDoc.updated_by.admin = null;
      }
      esDoc.updated_by.provider = null;
    }

    if (hasCreatedByFacilityAdminInfo) {
      if (DebugElasticProvider) {
        console.log("ES Document Generated - ");
        console.log(esDoc);
      }
    }
    return Promise.resolve([{ index: { _index: patientESIndex, _id: esDoc.health_id } }, esDoc]);
  }
  catch (error) {
    if (DebugElasticProvider) {
      console.log('Error Found');
      console.log(error);
      // console.log(esDoc.created_by);
      // console.log(esDoc.updated_by);
      // console.log(doc);
      errorCount++;
    }
    return Promise.reject([]);
  }
}


/**
 * This function takes in one patient data and
 * indexes it to a new patient in Elasticsearch
 * ! Not used and hence commented (to be removed)
 * @param patient
 */
export async function insertOrUpdateSinglePatientToESIndex(healthId: String) {
  try {
    const results: CDPatientInterface[] = [];
    const queryString = `SELECT * from mci.patient WHERE health_id='${healthId}' LIMIT 1;`;
    console.log("Query String");
    console.log(queryString);
    
    const patientSearch: any = await cassandraClient.execute(queryString);

    const rows: CDPatientInterface[] = patientSearch.rows;
    console.log("Rows");
    console.log(rows);
    if(rows.length == 0){
      console.log("No data found for the healthId");
      return Promise.resolve(false);
    }
    
    results.push(...rows);
    console.log("Results");
    console.log(results);
    
    const batch = results.slice(0, 1);
    const formattedDocsPromises = batch.map(patient => convertDataToPatientESFormat(patient));
    let formattedDocs = await Promise.all(formattedDocsPromises);
    // Filter out empty array responses from formattedDocs
    formattedDocs = formattedDocs.filter(doc => doc.length > 0);
    // Step 2: Flatten the array
    const flattenedDocs = formattedDocs.reduce((acc, val) => acc.concat(val), []);
    console.log("Flattened Docs");
    console.log(flattenedDocs);
    
    //Add Single Row to the existing Index
    if (flattenedDocs.length > 0) {
      await esBaseClient.bulk({ index: patientESIndex, body: flattenedDocs });
      if (DebugElasticProvider) console.log(`Indexed ${flattenedDocs.length} documents in current batch`);
    } else {
      if (DebugElasticProvider) {
        console.log("No data to index");
      }
    }

    if (DebugElasticProvider) {
      console.log("New Item added to the Index");
    }
    // await esBaseClient.close();
    return Promise.resolve(true);
  } catch (error) {
    console.error("Error in add patient data to the index", error);
    // await esBaseClient.close();
    return Promise.resolve(false);
  }
}



/**
 * Fetch ALL data from Cassandra database and Index it in Elasticsearch
 */
export async function indexAllPatientESData() {
  try {
    indexCount = 0;
    aloRegCount = 0;
    errorCount = 0;
    listOfErrorPatients = [];
    const results: CDPatientInterface[] = [];
    let i: number = 0;

    // Define a function to process each page of results
    const getAllPatientData = async (pageState: any, query: string = "SELECT * FROM patient") => {
      if (DebugElasticProvider) console.log("Retrieving page with pageIndex", i);
      const queryOptions = { prepare: true, fetchSize: CASSANDRA_PAGE_SIZE, pageState };
      const result: any = await cassandraClient.execute(
        `${query}`,
        [],
        queryOptions,
      );

      const rows: CDPatientInterface[] = result.rows;
      // Process each row here...
      if (DebugElasticProvider) console.log("Pushing page to allRows");
      // console.log("rows");
      // console.log(rows);
      results.push(...rows);
      i++;

      // Check if there are more pages
      if (result.pageState) {
        if (DebugElasticProvider) console.log("More pages to come" + result.pageState);
        await getAllPatientData(result.pageState);
      }
    };

    // Call the getAllPaginatedData function to start retrieving pages
    await getAllPatientData(null);

    // Index the data in batches
    for (let i = 0; i < results.length; i += batchSize) {
      const batch = results.slice(i, i + batchSize);
      // Step 1: Format the data
      const formattedDocsPromises = batch.map(patient => convertDataToPatientESFormat(patient));
      let formattedDocs = await Promise.all(formattedDocsPromises);
      // Filter out empty array responses from formattedDocs
      formattedDocs = formattedDocs.filter(doc => doc.length > 0);

      // Step 2: Flatten the array
      const flattenedDocs = formattedDocs.reduce((acc, val) => acc.concat(val), []);

      // Step 3: Send the data to ES Index, ensuring there's something to index
      if (flattenedDocs.length > 0) {
        if (DebugElasticProvider) { indexCount += flattenedDocs.length; }
        await esBaseClient.bulk({ index: patientESIndex, body: flattenedDocs });
        if (DebugElasticProvider) console.log(`Indexed ${flattenedDocs.length} documents in current batch`);
      }
    }
    if (DebugElasticProvider) {
      console.log("List of Patients with Invalid JSON Object");
      console.log(JSON.stringify(listOfErrorPatients));
      console.log("Count of Invalid JSON Object");
      console.log(listOfErrorPatients.length);
      console.log("Total Indexed Documents");
      console.log(indexCount);
      console.log("Total Alo Registration Count");
      console.log(aloRegCount);
    }
    // await esBaseClient.close();
    return true;
  } catch (error) {
    console.error("Error in indexing all patient data", error);
    // await esBaseClient.close();
    return false;
  }

}

/**
 * Construct the Elasticsearch Patient object(ESPatientInterface) from the Cassandra Patient object(CDPatientInterface)
 * @param doc 
 * @returns 
 */
export const convertCassandraPatientToESPatientIndexObject = (doc: CDPatientInterface): ESPatientInterface => {
  const blankCreatorAndUpdater: CreateAndUpdatedByEditorInterface = {
    facility: null,
    provider: null,
    admin: null,
  }
  return {
    health_id: doc.health_id,
    active: doc.active,
    address_line: doc.address_line,
    area_mouja: doc.area_mouja,
    assigned_by: doc.assigned_by,
    bin_brn: String(doc.bin_brn ?? ""),
    blood_group: doc.blood_group,
    city_corporation_id: doc.city_corporation_id ? String(doc.city_corporation_id) : null,
    confidential: doc.confidential,
    country_code: doc.country_code,
    created_facility_id: null,
    created_client_id: null,
    created_at: Object.keys(doc.created_at.buffer).length > 0
      ? timeUUIDToDate(stringify(doc.created_at.buffer)).toISOString()
      : null,
    created_by: blankCreatorAndUpdater,
    date_of_birth: doc.date_of_birth ? new Date(doc.date_of_birth) : null,
    date_of_death: doc.date_of_death ? new Date(doc.date_of_death) : null,
    disability: doc.disability,
    district_id: doc.district_id ? parseInt(doc.district_id) : null,
    division_id: doc.division_id ? parseInt(doc.division_id) : null,
    dob_type: doc.dob_type,
    edu_level: doc.edu_level,
    ethnicity: doc.ethnicity,
    fathers_brn: doc.fathers_brn ? String(doc.fathers_brn) : null,
    fathers_given_name: doc.fathers_given_name,
    fathers_name_bangla: doc.fathers_name_bangla,
    fathers_nid: doc.fathers_nid ? String(doc.fathers_nid) : null,
    fathers_sur_name: doc.fathers_sur_name,
    fathers_uid: doc.fathers_uid,
    full_name_bangla: doc.full_name_bangla,
    gender: doc.gender,
    given_name: doc.given_name,
    hid_card_status: doc.hid_card_status,
    holding_number: doc.holding_number,
    household_code: doc.household_code,
    marital_relations: doc.marital_relations,
    marital_status: doc.marital_status,
    marriage_id: doc.marriage_id,
    merged_with: doc.merged_with,
    mothers_brn: doc.mothers_brn,
    mothers_given_name: doc.mothers_given_name,
    mothers_name_bangla: doc.mothers_name_bangla,
    mothers_nid: doc.mothers_nid ? String(doc.mothers_nid) : null,
    mothers_sur_name: doc.mothers_sur_name,
    mothers_uid: doc.mothers_uid,
    national_id: doc.national_id ? String(doc.national_id) : null,
    nationality: doc.nationality,
    occupation: doc.occupation,
    pending_approvals: doc.pending_approvals,
    permanent_address_line: doc.permanent_address_line,
    permanent_area_mouja: doc.permanent_area_mouja,
    permanent_city_corporation_id: doc.permanent_city_corporation_id ? String(doc.permanent_city_corporation_id) : null,
    permanent_country_code: doc.permanent_country_code,
    permanent_district_id: parseInt(doc.permanent_district_id ?? "") ? parseInt(doc.permanent_district_id ?? "") : null,
    permanent_division_id: parseInt(doc.permanent_division_id ?? "") ? parseInt(doc.permanent_division_id ?? "") : null,
    permanent_holding_number: doc.permanent_holding_number,
    permanent_post_code: doc.permanent_post_code,
    permanent_post_office: doc.permanent_post_office,
    permanent_rural_ward_id: parseInt(doc.permanent_rural_ward_id ?? "") ? parseInt(doc.permanent_rural_ward_id ?? "") : null,
    permanent_street: doc.permanent_street,
    permanent_union_or_urban_ward_id: parseInt(doc.permanent_union_or_urban_ward_id ?? "") ? parseInt(doc.permanent_union_or_urban_ward_id ?? "") : null,
    permanent_upazila_id: parseInt(doc.permanent_upazila_id ?? "") ? parseInt(doc.permanent_upazila_id ?? "") : null,
    permanent_village: doc.permanent_village,
    phone_no: doc.phone_no,
    phone_number_area_code: doc.phone_number_area_code,
    phone_number_country_code: doc.phone_number_country_code,
    phone_number_extension: doc.phone_number_extension,
    place_of_birth: doc.place_of_birth,
    post_code: doc.post_code,
    post_office: doc.post_office,
    primary_contact: doc.primary_contact,
    primary_contact_no: doc.primary_contact_no,
    primary_contact_number_area_code: doc.primary_contact_number_area_code,
    primary_contact_number_country_code: doc.primary_contact_number_country_code,
    primary_contact_number_extension: doc.primary_contact_number_extension,
    relations: doc.relations,
    religion: doc.religion,
    rural_ward_id: parseInt(doc.rural_ward_id) ? parseInt(doc.rural_ward_id) : null,
    status: doc.status,
    street: doc.street,
    sur_name: doc.sur_name,
    uid: doc.uid,
    union_or_urban_ward_id: parseInt(doc.union_or_urban_ward_id) ? parseInt(doc.union_or_urban_ward_id) : null,
    updated_facility_id: null,
    updated_by: blankCreatorAndUpdater,
    updated_at: Object.keys(doc.updated_at.buffer).length > 0
      ? timeUUIDToDate(stringify(doc.updated_at.buffer)).toISOString()
      : null,
    upazila_id: parseInt(doc.upazila_id) ? parseInt(doc.upazila_id) : null,
    village: doc.village,
  }
}