import { MCISpinner } from "@components/MCISpinner";
import { getAPIResponse } from "@library/utils";
import { useQuery } from "@tanstack/react-query";
import PatientInfoInterface from "@utils/interfaces/DataModels/PatientInfoInterfaces";
import { getBaseUrl, getUrlFromName } from "@utils/lib/apiList";
import { calculateAge, convertDateToReadableFormat, convertGenderToReadableFormat } from "@utils/utilityFunctions";
import { Composition } from "fhir/r3";
import { memo } from "react";


export default memo(function CompositionInfo({ ...composition }: Composition) {
  let errorMessage = "";
  if (!composition.subject?.reference) errorMessage = "No Reference Provided";

  const { isPending, isSuccess, isError, data } = composition.subject?.reference ? useQuery({
    queryKey: ["patientInfo", composition.subject?.reference, process.env.FREESHR_AUTH_X_TOKEN,
      process.env.FREESHR_CLIENT_ID,
      process.env.FREESHR_API_USERNAME],
    queryFn: async () => await getAPIResponse(
      getBaseUrl(),
      getUrlFromName("get-mci-patient") + "?url=" +
      composition.subject?.reference,
      "",
      "GET",
      null,
      false,
      0,
      true,
      {
        "X-Auth-Token": process.env.FREESHR_AUTH_X_TOKEN || "",
        "client-id": process.env.FREESHR_CLIENT_ID || "",
        "FROM": process.env.FREESHR_API_USERNAME || "",
      }
    ),
  }) : { isPending: false, isSuccess: false, isError: true, data: undefined };

  const patientInfo: PatientInfoInterface | undefined = isSuccess ? data.body as PatientInfoInterface : undefined;
  if (isSuccess) {
    console.log("isSucess patientInfo", data.body);
    console.log(data.body);
  }
  if (!isPending && (isError || patientInfo == undefined)) errorMessage = errorMessage + " Error fetching patient information. Please check the URL and try again. URL used: -" + (composition.subject?.reference ?? "") + "";
  const ageAtEncounter = patientInfo != undefined ? patientInfo.date_of_birth !== undefined ? calculateAge(new Date(patientInfo.date_of_birth), new Date(composition.date)).toString() : "" : "";
  // if (patientInfo) {
  //   console.log("The date of birth is -")
  //   console.log(patientInfo.date_of_birth)
  //   console.log("The date of encounter")
  //   console.log(composition.date)
  // }
  return (
    <div className="border-bottom border-slate-300">
      <div className="flex flex-col mb-12 col-span-full">
        <div className="grid grid-cols-12 gap-x-12 pt-8">
          <div className="col-span-4 gap-x-4 flex">
            {isPending && <div className='p-8'><MCISpinner /></div>}
            {!isPending &&
              <>
                <div className="text-sm mr-4">Patient: </div>
                {(!isError && patientInfo) ?
                  <>
                    <div
                      className="font-semibold text-sm capitalize">{patientInfo?.given_name ?? ""} {patientInfo?.sur_name ?? ""}
                    </div>
                  </>
                  :
                  <div className="font-semibold text-sm capitalize">{composition.subject?.display ?? "Invalid Data Found"}</div>
                }
              </>
            }
          </div>
          <div className="col-span-2 gap-x-4 flex">
            {(!isError && patientInfo &&
              <>
                <div className="text-sm mr-4">Gender: </div>
                <span className="ml-1 text-sm">{patientInfo?.gender ? convertGenderToReadableFormat(patientInfo.gender) : "N/A"}</span>
              </>
            )}
          </div>
          <div className="col-span-2 gap-x-4 flex">
            {(!isError && patientInfo &&
              <>
                <div className="text-sm mr-4">Age: </div>
                <span className="ml-1 text-sm">{ageAtEncounter}</span>
              </>
            )}
          </div>
          <div className="col-span-4 gap-x-4 flex">
            <div className="text-sm mr-4">Visit Date: </div>
            <div
              className="font-normal text-sm capitalize">{convertDateToReadableFormat(composition.date, "2-digit", "long", "2-digit", true)}</div>
          </div>
        </div>
      </div>
    </div>);

});