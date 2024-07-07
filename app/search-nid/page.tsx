"use client";
import Alert from "@library/Alert";
import Button from "@library/Button";
import SingleDatePicker from "@library/form/DatePicker/SingleDatePicker";
import Radio, { RadioItemProps } from "@library/form/Radio";
import TextField from "@library/form/TextField";
import { getAPIResponse } from "@library/utils";
import LoggedInStoreInitializer from "@store/LoggedInStoreInitializer";
import { initialLoggedInStoreStates } from "@store/useLoggedInStore";
import { getBaseUrl } from "@utils/lib/apiList";
import { useRouter } from "next/navigation";
import React, { useState } from "react";


const radioItemsList: RadioItemProps[] = [{
  id: 1,
  name: "hid",
  label: "HID",
  isChecked: true,
  isDisabled: false,
}, {
  id: 2,
  name: "nid",
  label: "NID",
  isChecked: false,
  isDisabled: false,
},
];
export default function page() {
  const [text, setText] = React.useState("");
  const [errorText, setErrorText] = useState("");
  const [idValid, setIdValid] = useState(false);
  const [radioItems, setRadioItems] = useState(radioItemsList);
  const [dob, setDOB] = useState<Date>();
  const [dobString, setDobString] = useState();
  const [showAlert, setShowAlert] = useState(false);
  const [hasSpinner, setHasSpinner] = useState(false);
  const handleInputChange = (e: any) => {
    const value = e.data;
    if(radioItems[1].isChecked) {
      // Check if the input value is a number
      if (/^\d*$/.test(value) && value.length <= 17) {
        // If it's a number, update the text state
        setText(value);
        setErrorText(""); // Clear error message if input is valid
      }

      if (![10, 13, 17, 18].includes(value.length)) {
        console.log("value.length", value.length);
        setIdValid(false);
        setErrorText("Input must be 10, 13, or 17 digits long.");
      } else {
        setIdValid(true);
      }
    }
    else{
      if (/^\d*$/.test(value) && value.length <= 14) {
        // If it's a number, update the text state
        setText(value);
        setErrorText(""); // Clear error message if input is valid
      }

      if (![10, 11, 12, 13, 14].includes(value.length)) {
        console.log("value.length", value.length);
        setIdValid(false);
        setErrorText("Input must be between 10 and 14 digits long.");
      } else {
        setIdValid(true);
      }
    }
  };
  const router = useRouter();
  const initalizedStoreStates = {
    ...initialLoggedInStoreStates
  };


  return (
    <>
    <LoggedInStoreInitializer {...initalizedStoreStates} />
    <div className="login-layout">
      <div className={"container grid h-full w-full items-center justify-center"}>
        <div
          id="nidform"
          style={{ width: "min(32rem, 94vw)" }}
          className={`nid-form my-24 mx-auto flex grow-0 flex-col space-y-10 rounded-lg bg-white/80 backdrop-blur shadow-lg dark:border-gray-700 dark:bg-gray-800 md:space-y-24 p-40`}
        >
          <div className="mx-auto">
            <h4 className="mb-4 block">Patient NID Search</h4>
          </div>
          <TextField
            label=""
            placeholder={radioItems[0].isChecked ? "Enter Patient HID":"Enter Patient NID"}
            value={text}
            isRequired={true}
            showErrorIcon={true}
            errorText={errorText}
            onChange={handleInputChange}
          />
          <Radio data={radioItems} clicked={(e: any) => {
            console.log(e);
            setText("");
            setErrorText("");
            setRadioItems(e.data);
          }
          } id={"idTypeSelector"} />
          <SingleDatePicker toDate={new Date()} value={dob} onChange={(e: any) => {
            console.log(e);
            setDOB(new Date(e));
            setDobString(e);
          }} />
          <Button
            btnText="Search"
            type="submit"
            hasSpinner={hasSpinner}
            isDisabled={!idValid}
            disabledClass="!bg-primary-300 text-white pointer-events-none"
            className="!mt-12 !mb-12"
            clicked={async () => {
              setHasSpinner(true);
              console.log("Button Clicked");
              console.log(radioItems[0].isChecked ? "Fetch By HID": "Fetch By NID");
              const getPartialPath = radioItems[0].isChecked ?"hid" :"nid";
              console.log("/api/es/patient/get-patient-by-"+getPartialPath+"-dob?"+getPartialPath+"="+text+"&dob="+String(dobString));
              const results = await getAPIResponse(getBaseUrl(),"/api/es/patient/get-patient-by-"+getPartialPath+"-dob?"+getPartialPath+"="+text+"&dob="+String(dobString), "", "GET");
              console.log(results);
              console.log(results.length);
              if(results.length == 0) {
                setShowAlert(true);
                setHasSpinner(false);
              }
              else {
                console.log(results);
                setHasSpinner(false);
                router.push("/search-nid/" + results.health_id);
              }
              // router.push("/search-nid/" + "98000128861");
              //If NID Search - FIND the HID via API and then
              // 1. If found, redirect to /search-nid/HID
              // 2. If not found, show alert pop up


            }}
          />
          {showAlert && <Alert variant={'danger'} title="Not Found" isIconClicked={(e:any)=>setShowAlert(false)} />}
        </div>
      </div>
    </div>
    </>
  );
}
