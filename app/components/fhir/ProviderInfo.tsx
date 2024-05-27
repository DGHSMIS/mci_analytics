import React, { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import HRISProviderInterface, { HRISProviderCodedIdentifier } from "@utils/interfaces/HRISProviderInterface";
import { getAPIResponse } from "@library/utils";
import { MCISpinner } from "@components/MCISpinner";
import { getBaseUrl, getUrlFromName } from "@utils/lib/apiList";
import { Reference } from "fhir/r3";
import { ReferenceErrorLog } from "@components/fhir/ReferenceErrorLog";
import KeyValueFormItem from "@components/fhir/KeyValueFormItem";

export const ProviderInfo = memo(function ProviderInfo(reference: Reference) {


  if (!reference.reference) return <ReferenceErrorLog error="No Reference Provided" />

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

  console.log("The provider info is - ");
  console.log(providerInfo);

  return <>
    {isSuccess && providerInfo!==undefined &&
        <>
          <KeyValueFormItem title="Consultant Name" value={providerInfo.name} />
          <KeyValueFormItem title="Designation" value={providerInfo.properties ? providerInfo.properties.designation ?? "Not found":"Not found"} />
          <KeyValueFormItem title="Discipline" value={providerInfo.properties ? providerInfo.properties.designationDiscipline ?? "Not found":"Not found"} />
          {contactEmail !=="" &&
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
    {errorMessage!=="" && <ReferenceErrorLog error={errorMessage} />}
  </>;
});

interface ProvidersListInfoProps {
  references: Reference[];
}

export const ProvidersListInfo = memo(function ProvidersListInfo({ references }: ProvidersListInfoProps) {
  if (references.length==0) return <>No references found</>;
  console.log("The references are - ");
  console.log(references);
  // const sectionTitle = "Primary Health Care Provider";
  return (<>
    {references.map((item: Reference, index) => <ProviderInfo key={index} {...item} />)}
  </>);
});


