import { MCISpinner } from "@components/MCISpinner";
import KeyValueFormItem from "@components/fhir/KeyValueFormItem";
import { ReferenceErrorLog } from "@components/fhir/ReferenceErrorLog";
import { getAPIResponse } from "@library/utils";
import { useQuery } from "@tanstack/react-query";
import { districtCodes, divisionCodes } from "@utils/constants";
import { getBaseUrl } from "@utils/lib/apiList";
import { Reference } from "fhir/r3";
import React, { useMemo } from "react";

const useFacilityInfo = (reference: Reference) => {
  const facilityURL = useMemo(() => {
    if (!reference.reference) return null;
    const url = new URL(reference.reference);
    if (url.protocol !== "https") {
      url.protocol = "https";
    }
    return url;
  }, [reference.reference]);

  const { isLoading, isSuccess, isError, data } = useQuery({
    queryKey: ["providerInfo", facilityURL?.toString()],
    queryFn: async () =>
      await getAPIResponse(
        getBaseUrl(),
        facilityURL?.toString() || "",
        "",
        "GET",
        null,
        false,
        Number(process.env.NEXT_PUBLIC_API_REVALIDATE_TIME) || 0,
        true,
        {
          "X-Auth-Token": process.env.NEXT_X_FACILITY_AUTH_TOKEN || "",
          "client-id": process.env.NEXT_X_FACILITY_CLIENT_ID || "",
        }
      ),
    enabled: !!facilityURL,
  });

  return { isLoading, isSuccess, isError, data, facilityURL };
};

const FacilityInfoComponent: React.FC<{ reference: Reference }> = ({ reference }) => {
  const { isLoading, isSuccess, isError, data, facilityURL } = useFacilityInfo(reference);

  if (!reference.reference) return <ReferenceErrorLog error="No Reference Provided" />;

  let errorMessage = "";

  if (!isLoading && (isError || !data)) {
    errorMessage = "Error fetching facility information. Please check the URL and try again.";
  }

  const facilityInfo = data?.status == 200 ? data : undefined;

  return (
    <>
      {isSuccess && facilityInfo !== undefined && (
        <>
          <KeyValueFormItem title="Name" value={facilityInfo?.name ?? "No Name Found"} />
          <KeyValueFormItem
            title="Upazila"
            value={facilityInfo?.properties?.locations?.upazila_code ? districtCodes[facilityInfo.properties.locations.upazila_code] : "No Upazila Found"}
          />
          <KeyValueFormItem
            title="District"
            value={facilityInfo?.properties?.locations?.district_code ? districtCodes[facilityInfo.properties.locations.district_code] : "No District Found"}
          />
          <KeyValueFormItem
            title="Division"
            value={facilityInfo?.properties?.locations?.division_code ? divisionCodes[facilityInfo.properties.locations.division_code] : "No Division Found"}
          />
          <KeyValueFormItem title="Type" value={facilityInfo?.properties?.org_type + " (" + facilityInfo?.properties?.ownership + ")"} />
        </>
      )}
      {isLoading && <MCISpinner classNames="h-full w-full flex align-center justify-center" />}
      {errorMessage !== "" && <ReferenceErrorLog error={errorMessage} />}
    </>
  );
};

interface FacilityListInfoProps {
  references: Reference[];
}

export const FacilityListInfo: React.FC<FacilityListInfoProps> = ({ references }) => {
  if (references.length === 0) return <>No references found</>;

  return (
    <>
      {references.map((item: Reference, index) => (
        <FacilityInfoComponent key={index} reference={item} />
      ))}
    </>
  );
};
