"use client";

// this is a client component
import Checkbox, { CheckboxProps } from "@library/form/Checkbox";
import DropDownSingle from "@library/form/DropDownSingle";
import FormItemResponseProps from "@library/form/FormItemResponseProps";
import TextField from "@library/form/TextField";
import SectionDivider from "@library/SectionDivider";
import Link from "next/link";
import React, { memo, useState } from "react";

export interface RegisterFormInterface {
  onTextInputChange?: (e: FormItemResponseProps) => void;
  onPasswordChange?: (e: FormItemResponseProps) => void;
  submitClicked: Function;
  errorTextInput?: string;
  errorTextPassword?: string;
  btnText?: string;
  textInputLabel?: string;
  logInFormLabel?: string | JSX.Element;
  defaultValidation?: boolean;
  btnClassName?: string;
}

const RegisterForm = memo(function RegisterForm({
  onTextInputChange,
  onPasswordChange,
  submitClicked,
  errorTextInput,
  errorTextPassword,
  btnText,
  textInputLabel,
  logInFormLabel,
  defaultValidation,
  btnClassName,
}: RegisterFormInterface) {
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const handleClick = () => {
    if (showCompanyForm) {
      setShowCompanyForm(false);
    } else setShowCompanyForm(true);
  };

  const checkProps: CheckboxProps = {
    value: false,
    isDisabled: false,
    label: "I agree to the",
    color: "primary",
    // size: "", //  prop needs to be functioning
    onCheck: () => {},
  };

  return (
    <div className="grid grid-flow-row space-y-24">
      <div className="grid grid-cols-1 gap-x-0 space-y-24 sm:grid-cols-2 sm:gap-x-20 sm:space-y-0">
        <TextField label="First name" placeholder="John" type="text" />
        <TextField label="Last name" placeholder="Appleseed" type="text" />
      </div>
      <TextField label="Email" placeholder="john@appleseed.com" type="email" />
      <TextField label="Mobile" placeholder="017XX-XXX-XXX" type="telephone" />
      <DropDownSingle
        label={"What type of merchant are you?"}
        items={[
          { id: 1, name: "Seller" },
          { id: 2, name: "Buyer" },
        ]}
        index={null}
        isDisabled={false}
        isRequired={false}
        isFilterable={false}
        onChange={() => {}}
      />
      {/* //+ Apply as Company */}
      <div className="!mb-4 !mt-28 flex font-medium">
        <p className="text-slate-500">Applying as a company?</p>
        {/* //- SM Devices */}
        <button
          className="ml-4 text-primary transition hover:text-primary-600 lg:hidden
        "
          onClick={handleClick}
        >
          Tap here
        </button>

        {/* //- LG Devices */}
        <button
          className="ml-4 hidden text-primary transition hover:text-primary-600 lg:block
        "
          onClick={handleClick}
        >
          Click here
        </button>
      </div>
      {showCompanyForm && (
        <>
          <div className="grid grid-flow-row space-y-20 sm:space-y-0">
            <div className="my-28">
              <SectionDivider text="Company information" />
            </div>
          </div>
          <TextField
            label="Company name"
            placeholder="Appleseed"
            type="text"
            isRequired
          />
          <DropDownSingle
            label={"What type of merchant are you?"}
            items={[
              { id: 1, name: "Trader" },
              { id: 2, name: "Something else" },
            ]}
            index={null}
            isDisabled={false}
            isRequired={false}
            isFilterable={false}
            onChange={() => {}}
            placeholder="Trader"
          />
          <TextField label="Designation" placeholder="Manager" type="text" />
          <TextField
            label="Website"
            placeholder="https://www.appleseed.com"
            type="text"
          />
          <TextField
            label="Company phone"
            placeholder="017XX-XXX-XXX"
            type="telephone"
            isRequired
          />
          <TextField
            label="Registered address"
            placeholder="123 Apple Orchard, San Fransisco, LA 44691"
            type="address"
          />
        </>
      )}
      {/* //+ AGREE TO T AND C */}
      <div className="flex items-center text-base">
        <Checkbox
          {...checkProps}
          labelClassName="text-slate-600/90 !text-base"
        />
        <Link
          href={"/terms"}
          className="ml-4 font-medium text-primary transition hover:text-primary-600"
        >
          Terms & Conditions
        </Link>
      </div>
    </div>
  );
});
export default RegisterForm;
