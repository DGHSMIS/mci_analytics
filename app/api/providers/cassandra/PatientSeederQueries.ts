import process from "process";
import * as fakerjs from "@faker-js/faker";
import { facilityList } from "@utils/constants";
import bloodGroupCodes from "@utils/constants/BloodGroupCodes.json";
import districtList from "@utils/constants/DistrictCodes.json";
import educationLevelCodes from "@utils/constants/EducationLevels.json";
import occupationCodes from "@utils/constants/OccupationCodes.json";
import religionCodes from "@utils/constants/ReligionCodes.json";
import upazilaCodes from "@utils/constants/UpazilaCodes.json";
import { resolveFacilityDetailURLFromNameAndId } from "@utils/lib/apiList";
import { dateToUUID, xDaysAgo } from "utils/utilityFunctions";

export const patientSeederInsertQuery = `INSERT INTO patient (health_id,active,address_line,area_mouja,assigned_by,bin_brn,blood_group,city_corporation_id,confidential,country_code,created_at,created_by,date_of_birth,date_of_death,disability,district_id,division_id,dob_type,edu_level,ethnicity,fathers_brn,fathers_given_name,fathers_name_bangla,fathers_nid,fathers_sur_name,fathers_uid,full_name_bangla,gender,given_name,hid_card_status,holding_number,household_code,marital_relations,marital_status,marriage_id,merged_with,mothers_brn,mothers_given_name,mothers_name_bangla,mothers_nid,mothers_sur_name,mothers_uid,national_id,nationality,occupation,pending_approvals,permanent_address_line,permanent_area_mouja,permanent_city_corporation_id,permanent_country_code,permanent_district_id,permanent_division_id,permanent_holding_number,permanent_post_code,permanent_post_office,permanent_rural_ward_id,permanent_street,permanent_union_or_urban_ward_id,permanent_upazila_id,permanent_village,phone_no,phone_number_area_code,phone_number_country_code,phone_number_extension,place_of_birth,post_code,post_office,primary_contact,primary_contact_no,primary_contact_number_area_code,primary_contact_number_country_code,primary_contact_number_extension,relations,religion,rural_ward_id,status,street,sur_name,uid,union_or_urban_ward_id,upazila_id,updated_at,updated_by,village) 
  VALUES (:health_id, :active,:address_line,:area_mouja,:assigned_by,:bin_brn,:blood_group,:city_corporation_id,:confidential,:country_code,:created_at,:created_by,:date_of_birth,:date_of_death,:disability,:district_id,:division_id,:dob_type,:edu_level,:ethnicity,:fathers_brn,:fathers_given_name,:fathers_name_bangla,:fathers_nid,:fathers_sur_name,:fathers_uid,:full_name_bangla,:gender,:given_name,:hid_card_status,:holding_number,:household_code,:marital_relations,:marital_status,:marriage_id,:merged_with,:mothers_brn,:mothers_given_name,:mothers_name_bangla,:mothers_nid,:mothers_sur_name,:mothers_uid,:national_id,:nationality,:occupation,:pending_approvals,:permanent_address_line,:permanent_area_mouja,:permanent_city_corporation_id,:permanent_country_code,:permanent_district_id,:permanent_division_id,:permanent_holding_number,:permanent_post_code,:permanent_post_office,:permanent_rural_ward_id,:permanent_street,:permanent_union_or_urban_ward_id,:permanent_upazila_id,:permanent_village,:phone_no,:phone_number_area_code,:phone_number_country_code,:phone_number_extension,:place_of_birth,:post_code,:post_office,:primary_contact,:primary_contact_no,:primary_contact_number_area_code,:primary_contact_number_country_code,:primary_contact_number_extension,:relations,:religion,:rural_ward_id,:status,:street,:sur_name,:uid,:union_or_urban_ward_id,:upazila_id,:updated_at,:updated_by,:village)`;

/**
 * This function will generate the parameters for the patient seeder
 * @param divisionId
 * @param districtId
 * @param upazilaId
 * @returns
 */
export const seederParams = async (
  divisionId: string,
  districtId: string,
  upazilaId: string
) => {
  // Generate a random number between 1 and 30
  const noOfDaysAgo = Math.floor(Math.random() * 30) + 1;
  const resultsData = async () => {
    return [
      generateHealthId(), // health_id
      true, // active
      randomAddressGenerator(), // address_line
      "Mouja 1", // area_mouja
      "MCI", // assigned_by
      fakerjs.faker.phone.number("192221####"), // bin_brn
      getRandomKeyFromDataObject(bloodGroupCodes), // blood_group
      "", // city_corporation_id
      false, // confidential
      "050", // country_code
      dateToUUID(xDaysAgo(noOfDaysAgo)), // created_at
      await getCreatedByOrUpdatedByFormat(), // created_by
      fakerjs.faker.date.birthdate(), // date_of_birth
      getRandomDeathYear(), // date_of_death
      null, // disability
      districtId, // district_id
      divisionId, // division_id
      "1", // dob_type
      getRandomKeyFromDataObject(educationLevelCodes), // edu_level
      null, // ethnicity
      "", // fathers_brn
      "", // fathers_given_name
      "", // fathers_name_bangla
      "", // fathers_nid
      "", // fathers_sur_name
      "", // fathers_uid
      null, // full_name_bangla
      getRandomGender(), // gender
      // "F", // gender
      fakerjs.faker.name.firstName(), // given_name
      "REGISTERED", // hid_card_status
      "", // holding_number
      null, // household_code
      null, // marital_relations
      null, // marital_status
      null, // marriage_id
      null, // merged_with
      "", // mothers_brn
      "", // mothers_given_name
      "", // mothers_name_bangla
      "", // mothers_nid
      "", // mothers_sur_name
      "", // mothers_uid
      generateNid(), // national_id
      "Bangladeshi", // nationality
      getRandomKeyFromDataObject(occupationCodes), // occupation
      null, // pending_approvals
      "", // permanent_address_line
      "Mouja 2", // permanent_area_mouja
      null, // permanent_city_corporation_id
      null, // permanent_country_code
      null, // permanent_district_id
      null, // permanent_division_id
      null, // permanent_holding_number
      null, // permanent_post_code
      null, // permanent_post_office
      null, // permanent_rural_ward_id
      null, // permanent_street
      null, // permanent_union_or_urban_ward_id
      null, // permanent_upazila_id
      null, // permanent_village
      fakerjs.faker.phone.number("17########"), // phone_no
      "02", // phone_number_area_code
      "+880", // phone_number_country_code
      null, // phone_number_extension
      null, // place_of_birth
      "", // post_code
      "", // post_office
      fakerjs.faker.name.firstName(), // primary_contact
      fakerjs.faker.phone.number("17########"), // primary_contact_no
      "02", // primary_contact_number_area_code
      "+880", // primary_contact_number_country_code
      null, // primary_contact_number_extension
      "[]", // relations
      getRandomKeyFromDataObject(religionCodes), // religion
      "", // rural_ward_id
      "1", // status
      "", // street
      fakerjs.faker.name.lastName(), // sur_name
      null, // uid
      "", // union_or_urban_ward_id
      upazilaId, // upazila_id
      dateToUUID(xDaysAgo(noOfDaysAgo)), // updated_at
      await getCreatedByOrUpdatedByFormat(), // updated_by
      "", // village
    ];
  };

  return await resultsData();
};

/**
 * This function will generate the parameters for the patient seeder
 * @param data
 * @returns
 */
export function getRandomKeyFromDataObject(data: Object): string {
  //Find the number of keys in the object
  const numberOfKeys = Object.keys(data).length;
  //Select a random number between 0 and numberOfKeys
  const randomIndex = Math.floor(
    Math.random() * (numberOfKeys > 0 ? numberOfKeys - 1 : 0)
  );
  return Object.keys(data)[randomIndex];
}

/**
 * This function will generate the parameters for the patient seeder
 * @returns
 */
export async function getCreatedByOrUpdatedByFormat() {
  //Create a random number which is between 10000001 and 10111111
  const min = 0;
  const max = facilityList.length - 1;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  const selectedFacility = facilityList[randomNumber];

  const getFacilityURL = resolveFacilityDetailURLFromNameAndId(
    "auth-get-facility-by-id",
    Number(selectedFacility.id)
  );

  const response = await fetch(getFacilityURL, {
    method: "GET",
    next: { revalidate: 6000 },
    headers: {
      "X-Auth-Token": String(process.env.NEXT_X_FACILITY_AUTH_TOKEN) || "",
      "client-id": String(process.env.NEXT_X_FACILITY_CLIENT_ID) || "",
    },
  });

  if (response.status == 200) {
    const facilityAllData: any = await response.json();
    const object = {
      facility: {
        id: selectedFacility.id,
        name: facilityAllData.name ?? "",
      },
      provider: null,
      admin: null,
    };
    return JSON.stringify(object);

    // console.log("<<< Pushing cached facility >>>");
    // console.table(facilityData);
  }

  console.log("The create/Updated facility id is --");
  console.log(selectedFacility);
  const object = {
    facility: {
      id: selectedFacility,
      name: selectedFacility.name ?? null,
    },
    provider: null,
    admin: null,
  };
  return JSON.stringify(object);
}
/**
 * Random Address Generator
 * @returns
 */
export function randomAddressGenerator() {
  return fakerjs.faker.address.streetAddress();
}
/**
 * Random Age Generator
 * @param min
 * @param max
 * @returns
 */
export function getRandomAgeObj(min: number = 0, max: number = 80): Date {
  // Get a random number between 0 and 100
  return fakerjs.faker.date.birthdate({
    min: 0,
    max: 100,
  });
}
/**
 * Random Death Year Generator
 * @param min
 * @param max
 * @returns
 */
export function getRandomDeathYear(
  min: number = 0,
  max: number = 80
): Date | null {
  // Get a random number between 0 and 15
  const randomVar = Math.floor(Math.random() * 15);
  // People are dead if randomVar > 10
  if (randomVar > 10) {
    const randomDeathYear = Math.floor(Math.random() * 15);
    return fakerjs.faker.date.past(randomDeathYear);
  }
  return null;
}
/**
 * Random Division Selector
 * @param divisionData
 * @returns
 */
export function getRandomlySelectedDivisionCode(divisionData: Object): string {
  //Roll a number between 0 and divisionData.length - 1
  const randomIndex = Math.floor(
    Math.random() *
      (Object.keys(divisionData).length > 0
        ? Object.keys(divisionData).length
        : 0)
  );

  return Object.keys(divisionData)[randomIndex];
}
/**
 * Random Divisionwise District Selector
 * @param divison_id
 * @returns
 */
export function getRandomDistrictFromDivisionCode(divison_id: string): string {
  //In our DistrictCodes.json file, we have a list of districts with their division_id appended at the start
  // Like this  "1004": "Barguna", "10" is the division code and "04" is the district code
  // So we need to filter out the districts which have the same division code as the one we passed in
  //Then we need to select a random district from the filtered list
  const filteredDistricts = Object.keys(districtList).filter((district) =>
    district.startsWith(divison_id)
  );
  // console.log(filteredDistricts);

  // Only proceed if there is at least one matching district
  if (filteredDistricts.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredDistricts.length);
    return filteredDistricts[randomIndex].slice(2);
  } else {
    return ""; // Or any other suitable value when no district matches the division ID
  }
}
/**
 * Random Divisionwise Districtwise Upazila Selector
 * @param divison_id
 * @param district_id
 * @returns
 */
export function getRandomUpazilaFromDivisionDistrictCode(
  divison_id: string,
  district_id: string
): string {
  const partialGeoCode = `${divison_id}${district_id}`;
  // console.log(partialGeoCode);
  // Our UpazilaCodes.json file has a list of upazilas with their divison_id & district_id appended at the start
  // Like this  "100409": "Amtali", "10" is the division code, "04" is the district code and "01" is the upazila code
  // So we need to filter out the upazilas which have the same division code and district code as the one we passed in
  // Then we need to select a random upazila from the filtered list
  const filteredUpazilas = Object.keys(upazilaCodes).filter((upazila) =>
    upazila.startsWith(partialGeoCode)
  );
  if (filteredUpazilas.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredUpazilas.length);
    return filteredUpazilas[randomIndex].slice(4);
  } else {
    return ""; // Or any other suitable value when no district matches the division ID
  }
}
/**
 * Random Gender Selector
 * @returns
 */
export function getRandomGender(): string {
  // We will return M or F 95% of the time and O 5% of the time
  const randomVar = Math.floor(Math.random() * 100);
  if (randomVar <= 95) {
    //Randomly select 1 or 2
    const randomGender = Math.floor(Math.random() * 2);
    if (randomGender === 1) {
      return "M";
    }
    return "F";
  }
  return "0";
}

/**
 * Random Health Id Generator
 * @returns
 */
export function generateHealthId(): string {
  // Generate a 2 or 3 digit number between 0 and 9999
  const randomNumber = Math.floor(Math.random() * 1000000);
  // Convert the number to a string and pad with leading zeros if necessary
  const randomPart = String(randomNumber).padStart(4, "0");
  // Append the random part to the prefix 9800
  // console.log("Generated HID - " + "9800" + randomPart);
  return "9800" + randomPart;
}

/**
 * Random NID Generator
 * @returns
 */
export function generateNid(): string {
  //Generate a 10 or 16 digit number between 1000000000 and 1099999999999999
  const randomNumber = Math.floor(
    Math.random() * (1099999999999999 - 1000000000 + 1) + 1000000000
  );
  return String(randomNumber);
}
