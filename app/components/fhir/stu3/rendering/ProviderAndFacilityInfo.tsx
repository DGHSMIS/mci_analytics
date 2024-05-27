import React, { memo } from "react";
import { Composition, Encounter, Reference } from "fhir/r3";
import { EncounterSectionWrapper } from "@components/fhir/EncounterSectionWrapper";
import { ReferenceErrorLog } from "@components/fhir/ReferenceErrorLog";
import { useQuery } from "@tanstack/react-query";
import { getAPIResponse } from "@library/utils";
import { getBaseUrl, getUrlFromName } from "@utils/lib/apiList";
import HRISProviderInterface, { HRISProviderCodedIdentifier } from "@utils/interfaces/HRISProviderInterface";
import KeyValueFormItem from "@components/fhir/KeyValueFormItem";
import { MCISpinner } from "@components/MCISpinner";
import { HRISFacilityInterface } from "@utils/interfaces/FacilityInterfaces";
import { districtCodes, divisionCodes } from "@utils/constants";

interface ProviderAndFacilityInfoProps {
  composition: Composition;
  encounter: Encounter;
}

export default memo(function ProviderAndFacilityInfoProps({ composition, encounter }: ProviderAndFacilityInfoProps) {
  const providerReferences = composition.author;
  const facilityReferences = encounter.serviceProvider;
  const ProviderInfo:JSX.Element[] = [];
  const FacilityInfo:JSX.Element[] = [];
  if (!providerReferences) {
    ProviderInfo.push(<ReferenceErrorLog error="No Provider References Provided" />);
  }else {
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

      if (providerURL.protocol!=="https") {
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
        queryKey: ["providerInfo", providerURL.toString()],
        queryFn: async () => await getAPIResponse(
          getBaseUrl(),
          getUrlFromName("get-identity-info") + "?url=" +
          providerURL.toString(),
          "",
          "GET",
          null,
          false,
          0,
        ),
      });

      const providerInfo = data ? data.body as HRISProviderInterface:undefined;
      if (!isPending && (isError || providerInfo==undefined)) {
        errorMessage = errorMessage + " Error fetching provider information. Please check the URL and try again.";
      }
      let contactEmail = "";
      let contactPhone: string = "";

      if (isSuccess && providerInfo!==undefined) {
        if (providerInfo.telecom!==undefined) {
          providerInfo.telecom.forEach((telecom: HRISProviderCodedIdentifier) => {
            if (telecom.system==="email") {
              if (contactEmail==="") {
                contactEmail = telecom.value?.toString() ?? "";
              } else {
                const contactEmailOthers = telecom.value?.toString() ?? "";
                if (contactEmailOthers!=="") {
                  contactEmail = contactEmail + ", " + contactEmailOthers;
                }
              }
            } else if (telecom.system==="phone") {
              if (contactPhone==="") {
                contactPhone = telecom.value?.toString() ?? "";
              } else {
                const contactPhoneOthers = telecom.value?.toString() ?? "";
                if (contactPhoneOthers.length!==0) {
                  contactPhone = contactPhone + ", " + contactPhoneOthers;
                }
              }
            }
          });
        }

      }

      ProviderInfo.push(
        <>
          {isSuccess && providerInfo!==undefined &&
            <>
              <KeyValueFormItem title="Consultant Name" value={providerInfo.name} />
              <KeyValueFormItem title="Designation"
                                value={providerInfo.properties ? providerInfo.properties.designation ?? "Not found":"Not found"} />
              <KeyValueFormItem title="Discipline"
                                value={providerInfo.properties ? providerInfo.properties.designationDiscipline ?? "Not found":"Not found"} />
              {contactEmail!=="" &&
                <KeyValueFormItem title="Email" value={contactEmail} />
              }
              {contactPhone!=="" &&
                <KeyValueFormItem title="Phone" value={contactPhone} />
              }
              <hr />
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
  if (facilityReferences ==undefined) {
    FacilityInfo.push(<ReferenceErrorLog error="No Reference Provided" />);
  }
  else{
    console.log("The identity url is - ");
    console.log(facilityReferences.reference);

    const url = facilityReferences.reference;
    if(!url) {
      FacilityInfo.push(<ReferenceErrorLog error="No Reference Provided" />);
    }
    else {

      // cast string to URL
      const facilityURL = new URL(url);

      let errorMessage = "";

      if (facilityURL.protocol!=="https") {
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
        queryKey: ["providerInfo", facilityURL.toString()],
        queryFn: async () => await getAPIResponse(
          getBaseUrl(),
          getUrlFromName("get-identity-info") + "?url=" +
          facilityURL.toString(),
          "",
          "GET",
          null,
          false,
          0,
        ),
      });

      const facilityInfo = data ? data.body as HRISFacilityInterface:undefined;
      if (!isPending && (isError || facilityInfo==undefined)) {
        errorMessage = errorMessage + " Error fetching facility information. Please check the URL and try again.";
      }

      console.log("The provider info is - ");
      console.log(facilityInfo);

      FacilityInfo.push(<>
        {isSuccess && facilityInfo!==undefined &&
          <>
            <KeyValueFormItem title="Name" value={facilityInfo?.name ?? "No Name Found"} />
            <KeyValueFormItem title="Upazila"
                              value={facilityInfo?.properties?.locations?.upazila_code ? districtCodes[facilityInfo.properties.locations.upazila_code]:"No Upazila Found"} />
            <KeyValueFormItem title="District"
                              value={facilityInfo?.properties?.locations?.district_code ? districtCodes[facilityInfo.properties.locations.district_code]:"No District Found"} />
            <KeyValueFormItem title="Division"
                              value={facilityInfo?.properties?.locations?.division_code ? divisionCodes[facilityInfo.properties.locations.division_code]:"No Division Found"} />
            <KeyValueFormItem title="Type" value={facilityInfo?.properties?.org_type + facilityInfo?.properties?.ownership ? " (" + facilityInfo?.properties?.ownership + ")" : ""} />
          </>
        }
        {isPending && <MCISpinner classNames="h-full w-full flex align-center justify-center" />}
        {/* {isError && <ReferenceErrorLog error="Something went wrong" />} */}
        {/* {errorMessage!=="" && <ReferenceErrorLog error={errorMessage} />} */}
      </>);
    }
  }

  return <div className="flex flex-col overflow-hidden">
    <EncounterSectionWrapper wrapperClassNames="grid grid-cols-1 gap-y-8" title="Service Provider Information">
      {ProviderInfo.map((item, index) => (
        <div key={index}>
          {item}
        </div>
      ))}
      {FacilityInfo.map((item, index) => (
        <div key={index}>
          {item}
        </div>
      ))}
    </EncounterSectionWrapper>
  </div>;
});