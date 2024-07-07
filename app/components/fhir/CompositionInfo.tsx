import { MCISpinner } from "@components/MCISpinner";
import { EncounterSectionWrapper } from "@components/fhir/EncounterSectionWrapper";
import { ReferenceErrorLog } from "@components/fhir/ReferenceErrorLog";
import { getAPIResponse } from "@library/utils";
import { useQuery } from "@tanstack/react-query";
import PatientInfoInterface from "@utils/interfaces/PatientInfoInterfaces";
import { getBaseUrl, getUrlFromName } from "@utils/lib/apiList";
import { calculateAge, convertDateToReadableFormat } from "@utils/utilityFunctions";
import { Composition } from "fhir/r3";
import { memo } from "react";


export default memo(function CompositionInfo({ ...composition }: Composition) {
  let errorMessage = "";
  if (!composition.subject?.reference) errorMessage = "No Reference Provided";

  const { isPending, isSuccess, isError, data } = composition.subject?.reference ? useQuery({
    queryKey: ["patientInfo", composition.subject?.reference],
    queryFn: async () => await getAPIResponse(
      getBaseUrl(),
      getUrlFromName("get-mci-patient") + "?url=" +
      composition.subject?.reference,
      "",
      "GET",
      null,
      false,
      0,
    ),
  }):{ isPending: false, isSuccess: false, isError: true, data: undefined };

  const patientInfo: PatientInfoInterface | undefined = isSuccess ? data.body as PatientInfoInterface:undefined;
  if(isSuccess) {
    console.log("isSucess patientInfo", data.body);
  }
  if (!isPending && (isError || patientInfo==undefined)) errorMessage = errorMessage + " Error fetching patient information. Please check the URL and try again. URL used: -" + (composition.subject?.reference ?? "") + "";
  const ageAtEncounter = patientInfo!=undefined ? patientInfo.date_of_birth!==undefined ? calculateAge(new Date(patientInfo.date_of_birth), new Date(composition.date)).toString():"":"";
  return (
    <div className="col-span-full">
      <div className="flex flex-col mb-12">
        <EncounterSectionWrapper>
          <div className="grid grid-cols-6 gap-x-12">
            <div className="col-span-2 gap-x-4 flex border-r-2 border-slate-200">
              {isPending && <div className='p-8'><MCISpinner /></div>}
              {!isPending &&
                <>
                  <div className="text-sm mr-4">Patient</div>
                  {(!isError && patientInfo) ?
                    <>
                      <div
                        className="font-semibold text-sm capitalize">{patientInfo?.given_name ?? ""} {patientInfo?.sur_name ?? ""}</div>
                      <span className="ml-1 text-sm">{patientInfo.gender ? "Gender: " + patientInfo?.gender ?? "N/A":""}</span>
                      <span className="ml-1 text-sm">{"Age: " + ageAtEncounter}</span>
                      <span className="ml-1 text-sm">{patientInfo.gender ? "Gender: " + patientInfo?.gender ?? "N/A":""}</span>
                    </>
                    :
                    <div className="font-semibold text-sm capitalize">{composition.subject?.display ?? "Invalid Data Found"}</div>
                  }
                </>
              }
            </div>
            <div className="col-span-2 gap-x-4 flex border-r-2 border-slate-200">
              <div className="text-sm mr-4">Last updated at</div>
              <div
                className="font-semibold text-sm capitalize">{convertDateToReadableFormat(composition.date, "2-digit", "long", "2-digit", true)}</div>
            </div>
            <div className="col-span-2 gap-x-4 flex">
              <div className="text-sm mr-4">Status:</div>
              <div className="font-semibold text-sm capitalize">{composition.status}</div>
            </div>
            {!isPending && isError &&
              <div className="col-span-full gap-x-4 gap-y-12 flex border-r-2 border-slate-200">
                <ReferenceErrorLog error={errorMessage} />
              </div>
            }
          </div>
        </EncounterSectionWrapper>
      </div>
    </div>);

});