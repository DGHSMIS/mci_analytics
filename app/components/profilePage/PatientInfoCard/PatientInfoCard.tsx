import { ESPatientInterface } from "@api/providers/elasticsearch/patientIndex/interfaces/ESPatientInterface";
import { MCISpinner } from "@components/MCISpinner";
import Button from "@library/Button";
import { IconProps } from "@library/Icon";
import { downloadDataURIAsPNG, getAPIResponse, getRevalidationTime } from "@library/utils";
import { useQuery } from "@tanstack/react-query";
import { getBaseUrl, getUrlFromName } from "@utils/lib/apiList";
import {
  convertDateToReadableFormat,
  convertGenderToReadableFormat,
  selectBloodGroupFromCode,
  selectMaritalStatusFromCode
} from "@utils/utilityFunctions";
import dynamic from "next/dynamic";
import { memo, useState } from "react";

interface PatientTopBlockProps {
  patient: ESPatientInterface;
  facilityName: string;
  session: any;
}

const PatientIDBlocks = dynamic(() => import("@components/profilePage/PatientIDBlocks/PatientIDBlocks"), { ssr: true });
const Avatar = dynamic(() => import("@library/Avatar"), { ssr: true });
export default memo(function PatientTopBlock(props: PatientTopBlockProps) {
  const nid = props.patient.national_id ?? "";
  const session = props.session;
  const [hidCardDownloadBtnText, setHidCardDownloadBtnText] = useState("Download Health Card");
  const [iconName, setIconName] = useState<IconProps["iconName"]>("download-01");
  const [disableImageDownload, setDisableImageDownload] = useState(false);
  const { isLoading, isSuccess, isError, data } = useQuery({
    queryKey: ["profileImage", nid],
    queryFn: async () =>
      await getAPIResponse(
        getBaseUrl(),
        getUrlFromName("get-patient-photo") + `?nid=${nid}`,
        session.accessToken ?? "",
        "GET",
        null,
        false,
        getRevalidationTime()
      ),
    enabled: nid.length > 0 // This will prevent the query from running if nid is empty
  });
  const patientName = `${props.patient.given_name ?? ""} ${props.patient.sur_name ?? ""}`;
  const fatherName = `${props.patient.fathers_given_name ?? ""}  ${props.patient.fathers_sur_name ?? ""}`;
  const motherName = `${props.patient.mothers_given_name ?? ""}  ${props.patient.mothers_sur_name ?? ""}`;


  return (
    <div className="card w-full h-fit space-y-12 flex flex-col">
      <div className="flex items-center space-x-12 static md:relative min-h-96">
      {isLoading ? <MCISpinner classNames="h-full w-full flex items-start justify-start" spinnerText="" spinnerClassName="h-48 w-48" size="lg"/>
        : isError ? <><Avatar size="xl" className="mr-12" /><h6>{patientName}</h6></> 
        : isSuccess && data.imgURI ? <><Avatar size="xl" className="mr-12" src={data.imgURI}/><h6>{patientName}</h6></>
        : <><Avatar size="xl" className="mr-12" /><h6>{patientName}</h6></>}
      </div>
      <div className={"flex flex-col w-100 justify-start items-center space-8"}>
        <div className={"py-12 w-full text-sm"}>
        <Button
              size="sm"
              fullWidth={true}
              btnText={hidCardDownloadBtnText}
              outline={true}
              isDisabled={disableImageDownload}
              iconName={iconName}
              variant="secondary"
              clicked={async () => {
                console.log("Hello")
                const cardResults = await getAPIResponse(
                  getBaseUrl(),
                  getUrlFromName("get-patient-health-card") + `?hid=${props.patient.health_id}`,
                  session.accessToken ?? "",
                  "GET",
                  null,
                  false,
                  getRevalidationTime()
                )
                console.log("Health Card Results are: ", cardResults);
                if(!cardResults.imageURI){
                  setDisableImageDownload(true);
                } else{
                  if(cardResults.imageURI.length === 0){
                    setDisableImageDownload(true);
                  }
                  downloadDataURIAsPNG(cardResults.imageURI, `${props.patient.health_id}.png`);
                  setHidCardDownloadBtnText("Health Card Downloaded");
                  setIconName("");
                  setDisableImageDownload(true);
                }
              }}
              />
        </div>
        <div className={"py-12 w-full text-sm"}>
          <b>Primary Info</b>
          <hr />
        </div>
        <PatientIDBlocks idNumber={props.patient.gender ? convertGenderToReadableFormat(props.patient.gender) : "N/A"} idName={"Sex"} />
        <PatientIDBlocks idNumber={props.patient.date_of_birth ? convertDateToReadableFormat(String(props.patient.date_of_birth)) : ""} idName={"DOB"} />
        <PatientIDBlocks idNumber={props.patient.blood_group ? selectBloodGroupFromCode(props.patient.blood_group) : ""} idName={"Blood Grp"} />
        <PatientIDBlocks idNumber={props.patient.phone_no ?? ""} idName={"Phone"} allowCopy={true}/>
        <PatientIDBlocks idNumber={props.patient.marital_status ? selectMaritalStatusFromCode(props.patient.marital_status) : "N/A"} idName={"Marital Status"} />
        {fatherName ? fatherName.trim().length ? <PatientIDBlocks idNumber={fatherName ?? "Unavailable"} idName={"Father's Name"} /> : "" :""}
        {motherName ? motherName.trim().length ? <PatientIDBlocks idNumber={motherName ?? "Unavailable"} idName={"Mother's Name"} /> : "" :""}
      </div>



      {/* <span className="flex items-start justify-start bg-white border rounded border-slate-200 text-sm p-8 w-full md:w-auto"> */}
      {/*           Registered at: <b>{props.facilityName.length > 0 ? props.facilityName:"Unknown"}</b> */}
      {/* </span> */}
      <div className={"flex flex-col w-100 justify-start items-center space-8"}>
        <div className={"py-12 w-full text-sm"}>
          <b>User Identifiers</b>
          <hr />
        </div>
        <PatientIDBlocks idNumber={props.patient.health_id ?? ""} idName={"HID"} allowCopy={true}/>
        <PatientIDBlocks idNumber={String(props.patient.national_id ?? "")} idName={"NID"} allowCopy={true}/>
        <PatientIDBlocks idNumber={String(props.patient.bin_brn ?? "")} idName={"BRN"} allowCopy={true}/>
        <PatientIDBlocks idNumber={String(props.patient.uid ?? "")} idName={"UID"} allowCopy={true}/>
      </div>

      <div className={"flex flex-col w-100 justify-start items-center space-8"}>
        <div className={"py-12 w-full text-sm"}>
          <b>Primary Contact</b>
          <hr />
        </div>
        <PatientIDBlocks idNumber={props.patient.primary_contact ?? ""} idName={"Name"} allowCopy={true}/>
        <PatientIDBlocks idNumber={props.patient.primary_contact_no ?? ""} idName={"Phone"} allowCopy={true}/>
      </div>
    </div>
  );
});
