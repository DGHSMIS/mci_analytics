import { EncounterSectionWrapper } from "@components/fhir/EncounterSectionWrapper";
import KeyValueFormItem from "@components/fhir/KeyValueFormItem";
import { ReferenceErrorLog } from "@components/fhir/ReferenceErrorLog";
import { MCISpinner } from "@components/MCISpinner";
import { getAPIResponse } from "@library/utils";
import { useQuery } from "@tanstack/react-query";
import { districtCodes, divisionCodes, upazilaCodes } from "@utils/constants";
import { HRISFacilityInterface } from "@utils/interfaces/FacilityInterfaces";
import HRISProviderInterface, { HRISProviderCodedIdentifier } from "@utils/interfaces/HRISProviderInterface";
import { getBaseUrl, getUrlFromName } from "@utils/lib/apiList";
import { Composition, Encounter, Reference } from "fhir/r3";
import { memo } from "react";

interface ProviderAndFacilityInfoProps {
  composition: Composition;
  encounter: Encounter;
}

export default memo(function ProviderAndFacilityInfoProps({ composition, encounter }: ProviderAndFacilityInfoProps) {
  const providerReferences = composition.author;
  const facilityReferences = encounter.serviceProvider;
  const ProviderInfo: JSX.Element[] = [];
  const FacilityInfo: JSX.Element[] = [];

  const getHRISHeaders = () => {
    return {
      "X-Auth-Token": process.env.NEXT_X_LOGIN_AUTH_TOKEN || "",
      "client-id": process.env.NEXT_LOGIN_AUTH_CLIENT_ID || ""
    };
  }

  if (!providerReferences) {
    ProviderInfo.push(<ReferenceErrorLog error="No Provider References Provided" />);
  } else {
    //Loop through the Composition reference and find the provider information
    providerReferences.forEach((reference: Reference) => {
      if (!reference.reference) {
        ProviderInfo.push(<ReferenceErrorLog error="No Reference Provided" />);
        return;
      }

      console.log("The identity url is - ");
      console.log(reference.reference);

      const url = reference.reference;
      // cast string to URL
      const providerURL = new URL(url);

      let errorMessage = "";

      if (providerURL.protocol !== "https") {
        providerURL.protocol = "https";
        errorMessage = "URL must be https. Please update the URL and try again. Will be included in the validator. URL Provided was: " + url;
      }

      if (!providerURL.hostname.toString().includes(String(process.env.NEXT_PUBLIC_AUTH_BASE_URL))) {
        errorMessage = errorMessage + " URL must be pointed to the correct domain at " + String(process.env.NEXT_PUBLIC_AUTH_BASE_URL) + ". Please update the URL and try again. URL Provided was: " + url;
      }

      if (providerURL.hostname.toString().includes(String(process.env.NEXT_PUBLIC_DOMAIN_IP_CHECKER))) {
        errorMessage = errorMessage + " URL must not contain " + String(process.env.NEXT_PUBLIC_DOMAIN_IP_CHECKER) + ". Please update the URL and try again. URL Provided was: " + url;
      }

      const { isPending, isSuccess, isError, data } = useQuery({
        queryKey: ["providerInfo", providerURL.toString(),  Number(process.env.NEXT_PUBLIC_API_REVALIDATE_TIME) || 0],
        queryFn: async () => await getAPIResponse(
          getBaseUrl(),
          getUrlFromName("get-identity-info") + "?url=" +
          providerURL.toString(),
          "",
          "GET",
          null,
          false,
          0,
          true,
          getHRISHeaders()
        ),
      });

      const providerInfo = data ? data.body as HRISProviderInterface : undefined;
      if (!isPending && (isError || providerInfo == undefined)) {
        errorMessage = errorMessage + " Error fetching provider information. Please check the URL and try again.";
      } else {
        console.log("The provider info is - ");
        console.log(providerInfo);
      }
      let contactEmail = "";
      let contactPhone: string = "";

      if (isSuccess && providerInfo !== undefined) {
        if (providerInfo.telecom !== undefined) {
          providerInfo.telecom.forEach((telecom: HRISProviderCodedIdentifier) => {
            if (telecom.system === "email") {
              if (contactEmail === "") {
                contactEmail = telecom.value?.toString() ?? "";
              } else {
                const contactEmailOthers = telecom.value?.toString() ?? "";
                if (contactEmailOthers !== "") {
                  contactEmail = contactEmail + ", " + contactEmailOthers;
                }
              }
            } else if (telecom.system === "phone") {
              if (contactPhone === "") {
                contactPhone = telecom.value?.toString() ?? "";
              } else {
                const contactPhoneOthers = telecom.value?.toString() ?? "";
                if (contactPhoneOthers.length !== 0) {
                  contactPhone = contactPhone + ", " + contactPhoneOthers;
                }
              }
            }
          });
        }

      }

      ProviderInfo.push(
        <>
          {isSuccess && providerInfo !== undefined &&
            <>
              <KeyValueFormItem title="Consultant Name" value={providerInfo.name} />
              <KeyValueFormItem title="Designation"
                value={providerInfo.properties ? providerInfo.properties.designation ?? "Not found" : "Not found"} />
              <KeyValueFormItem title="Discipline"
                value={providerInfo.properties ? providerInfo.properties.designationDiscipline ?? "Not found" : "Not found"} />
              {contactEmail !== "" &&
                <KeyValueFormItem title="Email" value={contactEmail} />
              }
              {contactPhone !== "" &&
                <KeyValueFormItem title="Phone" value={contactPhone} />
              }
              {/* <hr /> */}
            </>
          }
          {isPending && <MCISpinner classNames="h-full w-full flex align-center justify-center" />}
          {/* {isError && <ReferenceErrorLog error="Something went wrong" />} */}
          {/* {errorMessage!=="" && <ReferenceErrorLog error={errorMessage} />} */}
        </>
      )
    });
  }
  //Go through Encounter reference and find the facility information
  if (facilityReferences == undefined) {
    FacilityInfo.push(<ReferenceErrorLog error="No Reference Provided" />);
  }
  else {
    console.log("The identity url is - ");
    console.log(facilityReferences.reference);

    const url = facilityReferences.reference;
    if (!url) {
      FacilityInfo.push(<ReferenceErrorLog error="No Reference Provided" />);
    }
    else {

      // cast string to URL
      const facilityURL = new URL(url);

      let errorMessage = "";

      if (facilityURL.protocol !== "https") {
        facilityURL.protocol = "https";
        errorMessage = "URL must be https. Please update the URL and try again. Will be included in the validator. URL Provided was: " + url;
      }

      if (!facilityURL.hostname.toString().includes(String(process.env.NEXT_PUBLIC_AUTH_BASE_URL))) {
        errorMessage = errorMessage + " URL must be pointed to the correct domain at " + String(process.env.NEXT_PUBLIC_AUTH_BASE_URL) + ". Please update the URL and try again. URL Provided was: " + url;
      }

      if (facilityURL.hostname.toString().includes(String(process.env.NEXT_PUBLIC_DOMAIN_IP_CHECKER))) {
        errorMessage = errorMessage + " URL must not contain " + String(process.env.NEXT_PUBLIC_DOMAIN_IP_CHECKER) + ". Please update the URL and try again. URL Provided was: " + url;
      }


      const { isPending, isSuccess, isError, data } = useQuery({
        queryKey: ["providerInfo", facilityURL.toString(),  Number(process.env.NEXT_PUBLIC_API_REVALIDATE_TIME) || 0],
        queryFn: async () => await getAPIResponse(
          getBaseUrl(),
          getUrlFromName("get-identity-info") + "?url=" +
          facilityURL.toString(),
          "",
          "GET",
          null,
          false,
          Number(process.env.NEXT_PUBLIC_API_REVALIDATE_TIME) || 0,
          true,
          getHRISHeaders()
        ),
      });

      const facilityInfo = data ? data.body as HRISFacilityInterface : undefined;
      if (!isPending && (isError || facilityInfo == undefined)) {
        errorMessage = errorMessage + " Error fetching facility information. Please check the URL and try again.";
      } else {
        console.log("The facilityInfo info is - 2");
        console.log(facilityInfo);
      }

      console.log("The facilityInfo info is - ");
      console.log(facilityInfo);
      let divisionFacility = null;
      let districtFacility = null;
      let upazilaFacility = null;
      if (facilityInfo?.properties?.locations?.division_code) {
        divisionFacility = facilityInfo.properties.locations.division_code;
        if (facilityInfo?.properties?.locations?.district_code) {
          districtFacility = divisionFacility + facilityInfo.properties.locations.district_code;
        }
        if (facilityInfo?.properties?.locations?.upazila_code) {
          upazilaFacility = districtFacility + facilityInfo.properties.locations.upazila_code;
        }
      }
      FacilityInfo.push(<>
        {isSuccess && facilityInfo !== undefined &&
          <>
            <KeyValueFormItem title="Name" value={facilityInfo?.name ?? "No Name Found"} />
            <KeyValueFormItem title="Upazila"
              value={upazilaFacility ? upazilaCodes[upazilaFacility] : "No Upazila Found"} />
            <KeyValueFormItem title="District"
              value={districtFacility ? districtCodes[districtFacility] : "No District Found"} />
            <KeyValueFormItem title="Division"
              value={divisionFacility ? divisionCodes[divisionFacility] : "No Division Found"} />
            <KeyValueFormItem title="Type" value={facilityInfo?.properties?.org_type ? " (" + facilityInfo?.properties?.org_type + ")" : ""} />
            <KeyValueFormItem title="Ownership" value={facilityInfo?.properties?.ownership ? " (" + facilityInfo?.properties?.ownership + ")" : ""} />
          </>
        }
        {isPending && <MCISpinner classNames="h-full w-full flex align-center justify-center" />}
        {/* {isError && <ReferenceErrorLog error="Something went wrong" />} */}
        {/* {errorMessage!=="" && <ReferenceErrorLog error={errorMessage} />} */}
      </>);
    }
  }

  return <div className="flex flex-col px-12">
    {/* <div className="flex flex-col justify-start items-start pb-12">
      <h6 className={"text-md"}>Service Providers</h6>
      <hr />
    </div> */}
    <EncounterSectionWrapper wrapperClassNames="grid grid-cols-1 gap-y-8 space-x-8 mb-24" title="Provider Information">
      {ProviderInfo.map((item, index) => (
        <span key={index}>
          {item}
        </span>
      ))}
    </EncounterSectionWrapper>
    
    <EncounterSectionWrapper wrapperClassNames="grid grid-cols-1 gap-y-8 space-x-8" title="Facility Information">
      {FacilityInfo.map((item, index) => (
        <span key={index}>
          {item}
        </span>
      ))}
    </EncounterSectionWrapper>
  </div>;
});