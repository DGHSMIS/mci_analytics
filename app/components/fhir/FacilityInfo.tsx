import { MCISpinner } from "@components/MCISpinner";
import KeyValueFormItem from "@components/fhir/KeyValueFormItem";
import { ReferenceErrorLog } from "@components/fhir/ReferenceErrorLog";
import { getAPIResponse } from "@library/utils";
import { useQuery } from "@tanstack/react-query";
import { districtCodes, divisionCodes } from "@utils/constants";
import { HRISFacilityInterface } from "@utils/interfaces/FacilityInterfaces";
import { getBaseUrl, getUrlFromName } from "@utils/lib/apiList";
import { Reference } from "fhir/r3";
import { memo } from "react";

export const FacilityInfoComponent = memo(function FacilityInfoComponent(reference: Reference) {


  if (!reference.reference) return <ReferenceErrorLog error="No Reference Provided" />;
  console.log("The identity url is - ");
  console.log(reference.reference);

  const url = reference.reference;
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

console.log(getBaseUrl()+getUrlFromName("get-identity-info") + "?url=" + facilityURL.toString());
  const { isPending, isSuccess, isError, data } = useQuery({
    queryKey: ["providerInfo", facilityURL.toString()],
    
    // queryFn: async () => await fetch(getBaseUrl()+getUrlFromName("get-identity-info") + "?url=" + facilityURL.toString(), {
    //   method: "GET",
    //   // cache: 'force-cache',
    //   next: { revalidate: 0 },
    //   headers: {
    //     "X-Auth-Token": "ZPYXP4k9ltEwKr7LOaR74SytY7DBN6kRWt8ZmK3EdgnhsgE6aBVbBWPyEsw4wt8v" || "",
    //     "client-id": "187721" || "",
    //   },
    // }),
    queryFn: async () => await getAPIResponse(
      getBaseUrl(),
      // getUrlFromName("get-identity-info") + "?url=" +
      facilityURL.toString(),
      "",
      "GET",
      null,
      false,
      0,
      true,
      {
            "X-Auth-Token": process.env.NEXT_X_FACILITY_AUTH_TOKEN || "",
            "client-id": process.env.NEXT_X_FACILITY_CLIENT_ID || "",
          },
    ),
  });

  const facilityInfo = data?.status == 200 ? await data.json() as HRISFacilityInterface:undefined;
  console.log(facilityInfo);
  if (!isPending && (isError || facilityInfo==undefined)) {
    errorMessage = errorMessage + " Error fetching facility information. Please check the URL and try again.";
  }

  console.log("The provider info is - ");
  console.log(facilityInfo);

  return (
    <>
      {isSuccess && facilityInfo!==undefined &&
        <>
          <KeyValueFormItem title="Name" value={facilityInfo?.name ?? "No Name Found"} />
          <KeyValueFormItem title="Upazila"
                            value={facilityInfo?.properties?.locations?.upazila_code ? districtCodes[facilityInfo.properties.locations.upazila_code]:"No Upazila Found"} />
          <KeyValueFormItem title="District"
                            value={facilityInfo?.properties?.locations?.district_code ? districtCodes[facilityInfo.properties.locations.district_code]:"No District Found"} />
          <KeyValueFormItem title="Division"
                            value={facilityInfo?.properties?.locations?.division_code ? divisionCodes[facilityInfo.properties.locations.division_code]:"No Division Found"} />
          <KeyValueFormItem title="Type" value={facilityInfo?.properties?.org_type + " (" + facilityInfo?.properties?.ownership + ")"} />
        </>
      }
      {isPending && <MCISpinner classNames="h-full w-full flex align-center justify-center" />}
      {/* {isError && <ReferenceErrorLog error="Something went wrong" />} */}
      {/* {errorMessage!=="" && <ReferenceErrorLog error={errorMessage} />} */}
    </>
  );
});


interface FacilityListInfoProps {
  references: Reference[];
}

export const FacilityListInfo = memo(function FacilityListInfo({ references }: FacilityListInfoProps) {
  if (references.length==0) return <>No references found</>;
  console.log("The references for Facility are - ");
  console.log(references);
  return (<>
    {references.map((item: Reference, index) => <FacilityInfoComponent key={index} {...item} />)}
  </>);
});

