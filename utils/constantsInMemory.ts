import prismaPostGresClient from "@api/providers/prisma/postgres/prismaPostGresClient";
import { MapDataItem } from "@components/charts/Map/BangladeshChart";
import { DropDownSingleItemProps } from "@library/form/DropDownSingle";
import bloodGroupList from "@utils/constants/BloodGroupCodes.json";
import countryList from "@utils/constants/CountryCodes.json";
import disabilityList from "@utils/constants/DisabilityCodes.json";
import districtList from "@utils/constants/DistrictCodes.json";
import divisionList from "@utils/constants/DivisionCodes.json";
import educationList from "@utils/constants/EducationLevels.json";
import facilityCodes from "@utils/constants/FacilityCodes.json";
import maritalStatusList from "@utils/constants/MaritalStatus.json";
import occupationList from "@utils/constants/OccupationCodes.json";
import religionList from "@utils/constants/ReligionCodes.json";
import upazilaList from "@utils/constants/UpazilaCodes.json";
import { FacilityInterface } from "@utils/interfaces/DataModels/FacilityInterfaces";
import { CountryInterface, DistrictInterface, DivisionInterface, UpazilaInterface } from "@utils/interfaces/DataModels/LocalityInterfaces";
import {
  BloodGroupInterface,
  DisabilityInterface,
  EducationInterface,
  MaritalStatusInterface,
  OccupationInterface,
  ReligionInterface
} from "@utils/interfaces/DataModels/PatientInfoInterfaces";
import process from "process";

export const KNOWN_SAFE_HOST_IP_LIST = String(process.env.KNOWN_SAFE_HOST_IP_LIST || '127.0.0.1,::1').split(",");

export const dropDownItems: DropDownSingleItemProps[] = [
  {
    id: 1,
    name: "Division Analytics",
    icon: "table",
  },
  {
    id: 2,
    name: "Gender Demographics",
    icon: "line-chart-up-02",
  },
  {
    id: 3,
    name: "Age Demographics",
    icon: "bar-chart-08",
  },
];
export const divisionCodes: DivisionInterface = divisionList;
export const districtCodes: DistrictInterface = districtList;
export const countryCodes: CountryInterface = countryList;
export const maritalStatusCodes: MaritalStatusInterface = maritalStatusList;
export const religionCodes: ReligionInterface = religionList;
export const bloodGroupCodes: BloodGroupInterface = bloodGroupList;
export const disabilityCodes: DisabilityInterface = disabilityList;

export const facilityList: FacilityInterface[] = facilityCodes;

export const occupationCodes: OccupationInterface = occupationList;
export const upazilaCodes: UpazilaInterface = upazilaList;
export const educationLevels: EducationInterface = educationList;

const divisionGeoCodeList = Object.keys(divisionCodes);
export const mapData: Array<MapDataItem> = [
  ["bd-ba", parseInt(divisionGeoCodeList[0]) ?? "10"],
  ["bd-cg", parseInt(divisionGeoCodeList[1]) ?? "20"],
  ["bd-da", parseInt(divisionGeoCodeList[2]) ?? "30"],
  ["bd-kh", parseInt(divisionGeoCodeList[3]) ?? "40"],
  ["bd-my", parseInt(divisionGeoCodeList[3]) ?? "45"],
  ["bd-rj", parseInt(divisionGeoCodeList[4]) ?? "50"],
  ["bd-rp", parseInt(divisionGeoCodeList[5]) ?? "55"],
  ["bd-sy", parseInt(divisionGeoCodeList[6]) ?? "60"],
];

export const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const ageRangeKeys: Array<string> = [
  ">80",
  "76-80",
  "71-75",
  "66-70",
  "61-65",
  "56-60",
  "51-55",
  "46-50",
  "41-45",
  "36-40",
  "31-35",
  "26-30",
  "21-25",
  "16-20",
  "11-15",
  "6-10",
  "0-5",
];

export const primaryMapGradientHue = "157";
export const primaryMapGradientSaturation = "82";

export const secondaryMapGradientHue = "1200";
export const secondaryMapGradientSaturation = "21";

const { NEXT_X_LOGIN_AUTH_TOKEN } = process.env;
export const loginAuthenticationHeaders = new Headers({
  "X-Auth-Token": String(process.env.NEXT_X_LOGIN_AUTH_TOKEN),
  "client-id": String(process.env.NEXT_LOGIN_AUTH_CLIENT_ID),
});

export const encounterAuthenticationHeaders = new Headers({
  "X-Auth-Token": String(process.env.FREESHR_AUTH_X_TOKEN),
  "client-id": String(process.env.FREESHR_CLIENT_ID),
  From: String(process.env.FREESHR_API_USERNAME),
});



export const facilityAPIAuthenticationHeaders = new Headers({
  "X-Auth-Token": String(process.env.NEXT_X_FACILITY_AUTH_TOKEN),
  "client-id": String(process.env.NEXT_X_FACILITY_CLIENT_ID),
});


let facilityDropDownItems: DropDownSingleItemProps[] = [];
let facilityFetchCount: number = 0;
export const ncdFacilityListDropdown = async (): Promise<DropDownSingleItemProps[]> => {
  if (facilityDropDownItems.length > 0 && facilityFetchCount < 10) {
    console.log("Returning from cache");
    console.log(facilityDropDownItems);
    console.log("Fetch Count");
    console.log(facilityFetchCount);
    facilityFetchCount++;
    return facilityDropDownItems;
  }

  facilityFetchCount = 0;
  facilityDropDownItems = [];
  console.log("Array state before fetching");
  console.log(facilityDropDownItems);
  console.log("Fetching from DB");
  const facilityFromNCDDB: FacilityInterface[] = await prismaPostGresClient.facility.findMany({
    where: {
      id: {
        gte: 0
      }
    }
  })
  let count = 1;
  facilityFromNCDDB.forEach((facility) => {
    facilityDropDownItems.push({
      id: count,
      name: facility.name ? (facility.code + " - " + facility.name) : ""
    });
    count++;
  })

  return facilityDropDownItems;
}
