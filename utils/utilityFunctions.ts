import { AddressProps } from "@components/profilePage/AddressBlock/AddressBlock";
import { CreateAndUpdatedByEncounterInterface } from "@providers/elasticsearch/encounterIndex/interfaces/ESEncounterInterface";
import { CreateAndUpdatedByPatientInterface, ESPatientInterface } from "@providers/elasticsearch/patientIndex/interfaces/ESPatientInterface";
import {
  bloodGroupCodes,
  countryCodes,
  disabilityCodes,
  districtCodes,
  divisionCodes,
  educationLevels,
  KNOWN_SAFE_HOST_IP_LIST,
  maritalStatusCodes,
  occupationCodes,
  religionCodes,
  upazilaCodes
} from "@utils/constantsInMemory";
import { ESDateRangeSingleItemQueryInterface } from "@utils/interfaces/DataModels/ESModelInterfaces";
import { addDays, formatISO, set, subDays, subHours, subMinutes, subMonths, subYears } from "date-fns";
import { NextRequest } from "next/server";
import { v1 as uuidv1 } from "uuid";

/**
 * Convert Gender Code to Readable Format
 * @param genderCode
 * @returns
 */
export function convertGenderToReadableFormat(genderCode: string, lang: string = "en"): string {
  console.log("genderCode");
  console.log(genderCode);
  if (lang.includes("bn")) {
    if (genderCode === "M") {
      return "পুরুষ";
    } else if (genderCode === "F") {
      return "মহিলা";
    } else {
      return "";
    }
  } else {
    if (genderCode === "M") {
      return "Male";
    } else if (genderCode === "F") {
      return "Female";
    } else {
      return genderCode;
    }
  }
}


  /**
   * Sets the date by subtracting the specified number of years from today's date and returns it in ISO format.
   *
   * @param {number} yearsFromToday - The number of years to subtract from today's date.
   * @return {string} The date in ISO format.
   */
  export function setDateByYears(yearsFromToday: number) {
    return formatISO(
      set(subYears(new Date(), yearsFromToday), {
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      })
    );
  }

/**
 * Convert Date to Readable Format
 */

export function convertDateToReadableFormat(
  dateString: string,
  day: "numeric" | "2-digit" | undefined = "numeric",
  month: "numeric" | "2-digit" | "long" | "short" | "narrow" | undefined = "numeric",
  year: "numeric" | "2-digit" | undefined = "numeric",
  includeTime: boolean = false
): string {
  if (dateString.length === 0) return "N/A";
  // Check if dateString can be directly parsed
  const timestamp = Date.parse(dateString);
  if (isNaN(timestamp)) {
    throw new Error('Invalid date. Please check the input date string.');
  }

  // Create a date object from the timestamp
  const date = new Date(timestamp);

  // Set the format options
  const options: Intl.DateTimeFormatOptions = {
    day,
    month,
    year
  };

  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
    options.second = "2-digit";
  }

  // Use 'en-GB' locale for "DD/MM/YYYY" format
  return date.toLocaleDateString("en-GB", options);
}




/**
 * Select Education Level from Education Level Code
 */
export function selectEducationLevelFromCode(code: string): string {
  if (code.length === 0) return "Unavailable";
  return educationLevels[code] || code;
}

/**
 * Select Country Name from Country Code
 */
export function selectCountryNameFromCode(code: string): string {
  if (code.length === 0) return "Unavailable";
  return countryCodes[code] || code;
}

/**
 * Select Marital Status from Marital Status Code
 */
export function selectMaritalStatusFromCode(code: string): string {
  if (code.length === 0) return "Unavailable";
  return maritalStatusCodes[code] || code;
}

/**
 * Select Religion from Religion Code
 */
export function selectReligionFromCode(code: string): string {
  if (code.length === 0) return "Unavailable";
  return religionCodes[code] || code;
}

/**
 * Select Blood Group from Blood Group Code
 */
export function selectBloodGroupFromCode(code: string): string {
  if (code.length === 0) return "Unavailable";
  return bloodGroupCodes[code] || code;
}

/**
 * Select Disability from Disability Code
 */
export function selectDisabilityFromCode(code: string): string {
  if (code.length === 0) return "Unavailable";
  return disabilityCodes[code] || code;
}

/**
 * Select Occupation from Occupation Code
 */
export function selectOccupationFromCode(code: string): string {
  if (code.length === 0) return "Unavailable";
  return occupationCodes[code] || code;
}

/**
 * Select Division from Division Code
 */
export function selectDivisionFromCode(code: string): string {
  if (code.length === 0) return "Unavailable";
  return divisionCodes[code] || code;
}

/**
 * Select District from District Code
 */
export function selectDistrictFromCode(code: string): string {
  if (code.length === 0) return "Unavailable";
  return districtCodes[code] || code;
}

/**
 * Select Upazilla from Upazilla Code
 */
export function selectUpazilaFromCode(code: string): string {
  if (code.length === 0) return "Unavailable";
  return upazilaCodes[code] || code;
}

/**
 * Construct Address Items to be shown
 */
export function getUserAddressesFromInstance(patientInfo: ESPatientInterface): AddressProps[] {
  const allAddress: AddressProps[] = [];
  if (patientInfo.permanent_address_line != null) {
    const permanentAddress: AddressProps = {
      address: {
        address_line: patientInfo.permanent_address_line,
        district_id: patientInfo.permanent_district_id
          ? String(patientInfo.permanent_district_id)
          : "",
        division_id: patientInfo.permanent_division_id
          ? String(patientInfo.permanent_division_id)
          : "",
        upazila_id: patientInfo.permanent_upazila_id
          ? String(patientInfo.permanent_upazila_id)
          : "",
        country_code: patientInfo.permanent_country_code
          ? String(patientInfo.permanent_country_code)
          : "",
      },
      addressHeader: "Permanent Address",
    };
    allAddress.push(permanentAddress);
  }
  const divisionCode = (division_id: string) => division_id ? String(division_id).length == 1 ? "0" + String(division_id) : String(division_id) : "";
  const districtCode = (district_id: string) => district_id ? String(district_id).length == 1 ? "0" + String(district_id) : String(district_id) : "";
  const upazilaCode = (upazila_id: string) => upazila_id ? String(upazila_id).length == 1 ? "0" + String(upazila_id) : String(upazila_id) : "";

  if (patientInfo.address_line) {
    const currentAddress: AddressProps = {
      address: {
        address_line: patientInfo.address_line,
        district_id: patientInfo.district_id && patientInfo.division_id
          ? selectDistrictFromCode(divisionCode(String(patientInfo.division_id)) + districtCode((String(patientInfo.district_id)))) : "",
        division_id: patientInfo.division_id
          ? selectDivisionFromCode(divisionCode(String(patientInfo.division_id)))
          : "",
        upazila_id: patientInfo.upazila_id && patientInfo.district_id && patientInfo.division_id
          ? selectUpazilaFromCode(selectDistrictFromCode(divisionCode(String(patientInfo.division_id)) + districtCode((String(patientInfo.district_id))) + upazilaCode(String(patientInfo.upazila_id))))
          : "",
        country_code: patientInfo.country_code
          ? selectCountryNameFromCode(String(patientInfo.country_code))
          : "",
      },
      addressHeader: "Current Address",
    };
    allAddress.push(currentAddress);
  }
  return allAddress;
};

// Create a date x days ago
export function xDaysAgo(xdaysAgo: number): Date {
  return subDays(new Date(), xdaysAgo);
}

// Create a date x days in the future
export function addXDaysToDate(xdays: number): Date {
  return addDays(new Date(), xdays);
}

export function xMonthsAgo(xmonthsAgo: number): Date {
  return subMonths(new Date(), xmonthsAgo);
}

export function getLastXHoursRange(hours: number): { start: Date; end: Date } {
  const end = new Date(); // now (UTC in Node.js)
  const start = subHours(end, hours); // subtract X hours
  return { start, end };
}

// Create a date x minutes ago
export function xMinutesAgo(xminutesAgo: number): Date {
  return subMinutes(new Date(), xminutesAgo);
}

// Create a date x minutes in the future
export function getDateFromString(dateString: string): Date {
  return new Date(dateString);
}

// Get days between two Dates
export function getDaysBetweenDates(startDate: Date, endDate: Date): number {
  const diffInMs = Math.abs(endDate.getTime() - startDate.getTime());
  return diffInMs / (1000 * 60 * 60 * 24);
}
// Calculate Age from Birth Date
export function calculateAge(birthDate: Date, currentDate: Date): number {
  let age = currentDate.getFullYear() - birthDate.getFullYear();
  const m = currentDate.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && currentDate.getDate() < birthDate.getDate())) {
    age--;
  }

  return Math.abs(age);
}

// Check if a string is a valid date
export function isValidDateTimeString(str: string) {
  const date = new Date(str);
  return !isNaN(date.getTime());
}

/**
 * Convert a UUID to a Date object
 * @param uuid
 * @returns
 */
export function uuidToDate(uuid: String) {
  // console.log("uuid");
  // console.log(uuid);
  // UUID timestamps are over 100-nanosecond intervals since 15 October 1582
  const ticksPerMillisecond = 10000;
  const ticksPerSecond = ticksPerMillisecond * 1000;
  const ticksPerMinute = ticksPerSecond * 60;
  const ticksPerHour = ticksPerMinute * 60;
  const ticksPerDay = ticksPerHour * 24;

  // 12219292800 is the number of seconds between UUID epoch (1582-10-15) and Unix epoch (1970-01-01)
  const uuidEpoch = 12219292800 * ticksPerSecond;

  const timestampHex = uuid.split("-").slice(0, 3).reverse().join("");
  const timestamp = parseInt(timestampHex, 16) - uuidEpoch;

  // JavaScript dates use milliseconds
  const milliseconds = timestamp / ticksPerMillisecond;

  return new Date(milliseconds);
}

// Date to UUID v1 converter
export function dateToUUID(dateObj: Date) {
  const v1options = {
    node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
    clockseq: 0x1234,
    msecs: dateObj.getTime(),
    nsecs: 5678,
  };
  const uuid = uuidv1(v1options);
  // console.log(uuid);
  return uuid;
  // return uuidv1({ msecs: uuidTimestamp });
}

function getTimeInt(uuid_str: string) {
  try {
    const uuid_arr = String(uuid_str).split("-");
    // console.log(uuid_arr);
    // console.log(uuid_arr[0]);
    // console.log(uuid_arr[1]);
    // console.log(uuid_arr[2]);
    const time_str = [uuid_arr[2].substring(1), uuid_arr[1], uuid_arr[0]].join(
      "",
    );
    return parseInt(time_str, 16);
  } catch (err) {
    console.log(err);
    return 0;
  }
}

// TimeUUID to Date converter
export function timeUUIDToDate(uuid_str: any) {
  // console.log("uuid_str");
  // console.log(uuid_str);
  try {
    var int_time = getTimeInt(uuid_str) - 122192928000000000,
      int_millisec = Math.floor(int_time / 10000);
    return new Date(int_millisec);
  } catch (err) {
    console.log(err);
    return new Date();
  }
}

// Date to TimeUUID v1 converter
export function dateToUuidv1(date: Date) {
  const origNow = Date.now;
  Date.now = () => date.getTime(); // Override Date.now
  const uuid = uuidv1();
  Date.now = origNow; // Reset Date.now
  return uuid;
}

//Helper function to generate the date range for Elasticsearch
export const datesRangeGenerator = (
  startDateString: string,
  endDateString: string,
): ESDateRangeSingleItemQueryInterface[] => {
  let startDate = new Date(startDateString);
  let endDate = new Date(endDateString);

  if (isNaN(startDate.getTime())) {
    startDate = xMonthsAgo(3)
  }
  if (isNaN(endDate.getTime())) {
    endDate = new Date();
  }

  const datesRange: ESDateRangeSingleItemQueryInterface[] = [];
  let current = new Date(startDate);

  while (current <= endDate) {
    const nextDate = new Date(current);
    nextDate.setDate(nextDate.getDate() + 1);

    datesRange.push({
      from: current.toISOString(),
      to: nextDate.toISOString(),
      key: current.toDateString(),
    });
    current = nextDate;
  }
  return datesRange;
};

export const generateHslLightShades = (
  hue: string,
  saturation: string,
  numberOfShades: number,
  maxRange: number = 50,
  minRange: number = 20,
) => {
  const generetedColors = [];
  // console.log("Max Range - ");
  // console.log(maxRange);
  // console.log("Min Range - ");
  // console.log(minRange);
  const lightVariationRange = maxRange - minRange;
  const stepSize =
    Math.round((lightVariationRange / numberOfShades) * 100) / 100;
  let lightFactor = maxRange;
  for (let i = 0; i <= numberOfShades; i++) {
    lightFactor = Math.round(lightFactor * 100) / 100;
    const genereatedHSLColor = String(
      `hsl(${hue}deg, ${saturation}%, ${lightFactor}%)`,
    );
    generetedColors.push(genereatedHSLColor);
    lightFactor = lightFactor - stepSize;
  }
  return generetedColors;
};

/**
 * Returns the key of the given value in the given object.
 * @param {object} object
 * @param {string | number} value
 * @returns {string | null}
 */
export const getObjectKeyFromValue = (
  object: object,
  value: string | number,
) => {
  const entry = Object.entries(object).find(([, val]) => val === value);
  return entry ? entry[0] : null;
};

// You can define your own formatPhoneNumber function or use any library
export function formatPhoneNumber(phone: String) {
  // This is a very simple example. You may need to use a more complex logic for different cases.
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
}

export function filterArray(array: any[], query: string): any[] {
  return array.filter(item => {
    for (let key in item) {
      if (item.hasOwnProperty(key) &&
        typeof item[key] === "string" &&
        item[key].toLowerCase().includes(query.toLowerCase())) {
        return true;
      }
    }
    return false;
  });
}

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * 
 * @param cacheTimeInSeconds 
 * 
 * @param allowedCors 
 * @param origin 
 * @param allowedMethods 
 * @param allowedHeaders 
 * @returns 
 */
export const getResponseHeaders = (
  cacheTimeInSeconds: Number = 30,
  allowedCors: Boolean = false,
  origin: string = "*",
  allowedMethods: string = "GET, POST, OPTIONS",
  allowedHeaders = "Content-Type, Authorization"): HeadersInit => {

  const responseHeaders: HeadersInit = {
    "content-type": "application/json",
    "Cache-Control": `max-age=${cacheTimeInSeconds}, s-maxage=${cacheTimeInSeconds}, stale-while-revalidate=${cacheTimeInSeconds}`
  }

  if (allowedCors) {
    // Define the domain pattern to check against
    // const allowedDomain =    /\.dghs\.gov\.bd$/;
    // Check if the origin matches the allowed pattern
    // Set the Access-Control-Allow-Origin header to the origin of the request
    responseHeaders['Access-Control-Allow-Origin'] = origin;
    responseHeaders["Access-Control-Allow-Methods"] = allowedMethods;
    responseHeaders["Access-Control-Allow-Headers"] = allowedHeaders;
  }
  return responseHeaders;
}


export const validateKnowHostToAccessRoute = (req: NextRequest) => {
  // Retrieve the IP address from the request
  const requestIP = (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || req.headers.get('host')) ?? "";
  // console.log(requestIP);
  // console.log(`requestIP: ${requestIP}`);
  // console.log(`x-forwarded-for: ${req.headers.get('x-forwarded-for')}`);
  // console.log(`x-real-ip: ${req.headers.get('x-real-ip')}`);
  // console.log(`host: ${req.headers.get('host')}`);

  // Check if the request is from the host server
  if (!KNOWN_SAFE_HOST_IP_LIST.includes(requestIP)) {
    return false;
  }
  return true;
}

export const blankCreatedAndUpdatedByPatientESObject: CreateAndUpdatedByPatientInterface = {
  facility: null,
  provider: null,
  admin: null,
}


export const blankCreatedAndUpdatedByEncounterESObject: CreateAndUpdatedByEncounterInterface = {
  facilityId: null,
  provider: null
};
export const ncdDiseases: string[] = [
  "Bronchial Asthma",
  "Congenital Heart Diseases",
  "Epilepsy",
  "Type 1 Diabetes Mellitus",
  "Thalassemia and iron deficiency anemia",
  "Nephrotic Syndrome",
];

export const getFacilitySolutionTypeFromName = (
  facilityNamePartialMatch: string
) => {
  if (facilityNamePartialMatch.includes("Directorate General of Health Services (DGHS)") || facilityNamePartialMatch.includes("DGHS")) {
    return "openSRP";
  }
  return "openMRS+";
};

export const isAaloClinic = (facilityCode: string) => {
  const aaloClinicFacilityCodes = ["10034140", "10034141", "10034142", "10034144", "10034145", "10034146"];
  for (const code of aaloClinicFacilityCodes) {
    if (code == facilityCode) {
      return true;
    }
  }
  return false;
};

