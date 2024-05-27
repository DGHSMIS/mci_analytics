"use client";

// this is a client component
import Button from "@library/Button";
import ErrorText from "@library/form/ErrorText";
import FormItemResponseInterface from "@library/form/FormItemResponseProps";
import TextField from "@library/form/TextField";
import { IconProps } from "@library/Icon";
import {
  PasswordFieldInterface,
  TextInputFieldInterface,
  validatePasswordField,
  validateTextInputField,
} from "@library/molecules/auth/Validation";
import Link from "next/link";
import { memo, useEffect, useState } from "react";

export interface logInFormInterface {
  onTextInputChange?: (e: FormItemResponseInterface) => void;
  onPasswordChange?: (e: FormItemResponseInterface) => void;
  textInputMinLength?: number;
  textInputMaxLength?: number;
  passwordMinLength?: number;
  passwordMaxLength?: number;
  submitClicked: Function;
  isFetchingAPI?: boolean;
  errorTextInput?: string;
  errorTextPassword?: string;
  btnText?: string;
  btnHasSpinner?: boolean;
  errorLoginText?: string;
  textInputLabel?: string;
  loginFormLabel?: string | JSX.Element;
  defaultValidation?: boolean;
  forgotPassLink?: string;
  signUpLink?: string;
  btnClassName?: string;
  showForgotPass?: boolean;
  showSignUp?: boolean;
  backdropBlur?: boolean;
  isSimplePassword?: boolean;
  noShadow?: boolean;
  className?: string;
}

/**
 * LogIn Component
 *
 * @description
 * Company - ARITS Ltd. 20 Feb Jan 2023.

* This component is used to render a LogIn form
* This component has default validation only for email and password.But if needed custom    validation can be added.
*Initially default validation is set false.For default validation 'defaultValidation(boolean)'  param needs to true in parent component.
 *For custom validation,'defaultValidation(boolean)' can't be called in parent component.'onTextInputChange' will return the value of textInput(email/username) firing onChange event of react in parent component.Using the value of 'onTextInputChange',validation can be done.
 * 'errorTextInput' this attribute accept the value from parent component and shows the value of
 textInput(email/username).if validation returns error,'errorTextInput' has to be set from parent
 component with the response of validation from parent component
 *'onPasswordChange' will return the value of password firing onChange event of react in parent component.Using the value of 'onPasswordChange',validation can be done.
 * 'errorTextPassword' this attribute accept the value from parent component and shows the value of password.if validation returns error,'errorTextPassword' has to be set from parent
 component with the response of validation from parent component
 * Please note,  require('@tailwindcss/forms'), is required in the tailwind.config.js file.
 * for this component to work.
    @param {FormItemResponseInterface}   onTextInputChange - trigger with onChange event and return the value of text(email/username) in parent component
    @param {FormItemResponseInterface}   onPasswordChange - trigger with onChange event and return the value of password in parent component
    @param {Function}   submitClicked - trigger with click event of Login button and return the
    value of text(email/username) and password to parent component
    @param {string}   errorTextInput - if any error triggers for text(email/username) custom validation in parent component,this parameter should be initialize with the response of validation from parent component. for defaultValidation this parameter has no use
    @param {string}   errorTextPassword - if any error triggers for password for custom validation in parent component,this parameter should be initialize with the response of validation from parent component.for defaultValidation this parameter has no use
    @param {string}   btnText - sets the value of button from parent component. e.g:"Log In"
    @param {boolean}   btnHasSpinner - Login Button Spins if it is set true
    @param {string}   textInputLabel - sets the value of label of textInput from parent component. e.g:"username,email....."
    @param {string|JSX.Element}   loginFormLabel - The label of the form. e.g: "Log In"
    @param {boolean}  defaultValidation -if default validation needed,this parameter needs to be
    "true" otherwise default validation for this component is set false
    @param {string}  forgotPassLink - Custom link URL for Forgot Password
    @param {string}  signUpLink - Custom link URL for sign up
    @param {string}  btnClassName -for custom css(tailwind) class for button
    @param {string}  showForgotPass -Show or hide Forgot Password Link
    @param {string}  showSignUp -Show or hide sign up Link
    @param {boolean} noShadow Remove box-shadow. Set to false by default.
    @param {string}  className -for custom class names of the entire form
 */

const LogInForm = memo(function LogInForm({
  onTextInputChange,
  onPasswordChange,
  submitClicked,
  textInputMinLength = 5,
  textInputMaxLength = 20,
  passwordMaxLength = 20,
  passwordMinLength = 8,
  errorTextInput = "",
  errorTextPassword = "",
  errorLoginText = "",
  btnText = "Login",
  btnHasSpinner = false,
  textInputLabel = "Email",
  loginFormLabel = "Login",
  defaultValidation = false,
  isFetchingAPI = false,
  forgotPassLink = "",
  signUpLink = "",
  btnClassName,
  backdropBlur = true,
  showForgotPass = true,
  showSignUp = true,
  isSimplePassword = true,
  noShadow = false,
  className,
}: logInFormInterface) {
  const [text, setText] = useState("");
  const [errorText, setErrorText] = useState(errorTextInput ?? "");
  const [isTextValidated, setIsTextValidated] = useState<boolean>(false);
  const [textFieldBlurCount, setTextFieldBlurCount] = useState(0);

  const [password, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState(errorTextPassword ?? "");
  const [isPasswordValidated, setIsPasswordValidated] =
    useState<boolean>(false);
  const [passwordFieldBlurCount, setPasswordFieldBlurCount] = useState(0);

  const [isClicked, setIsClicked] = useState(false);
  const [passwordIconName, setPasswordIconName] =
    useState<IconProps["iconName"]>("eye-off");
  const [IsPasswordVisible, setIsPasswordVisible] = useState("password");
  const emailValidatorProps: TextInputFieldInterface = {
    value: text,
    required: true,
    isEmail: true,
    minLength: textInputMinLength,
    maxLength: textInputMaxLength,
  };
  const validatePasswordFieldProps: PasswordFieldInterface = {
    value: password,
    minLength: passwordMinLength,
    maxLength: passwordMaxLength,
    isSimplePassword: isSimplePassword,
  };

  useEffect(() => {
    handleIsTextInputValid(text, "email");
    emailValidatorProps.value = text;
    const validationText = validateTextInputField(emailValidatorProps);
    if (validationText.status == false) {
      setErrorText(validationText.message ?? "");
      setIsTextValidated(false);
    } else {
      setErrorText("");
      setIsTextValidated(true);
    }
  }, [text]);

  useEffect(() => {
    const validationPwd = validatePasswordField(validatePasswordFieldProps);
    if (!validationPwd.status) {
      if (errorTextPassword) {
        setErrorPassword(errorTextPassword);
      } else {
        setErrorPassword(validationPwd?.message ?? "");
        setIsPasswordValidated(false);
      }
    } else {
      setErrorPassword("");
      setIsPasswordValidated(true);
    }
  }, [password]);

  useEffect(() => {
    if (errorTextInput !== undefined) {
      setErrorText(errorTextInput);
    }
  }, [errorTextInput]);

  useEffect(() => {
    if (errorTextPassword !== undefined) {
      setErrorPassword(errorTextPassword);
    }
  }, [errorTextPassword]);

  const handleIsTextInputValid = (e: any, type: string) => {
    if (type == "email") {
      // console.log(e)
      const resp = validateTextInputField({
        value: e.data,
        required: true,
        isEmail: true,
      }).message;

      if (resp) {
        setErrorText(resp);
      } else {
        setErrorText("");
      }
    } else {
      const resp = validatePasswordField({
        value: e.data,
        minLength: 5,
      }).message;

      if (resp) {
        setErrorPassword(resp);
      } else {
        setErrorPassword("");
      }
    }
  };

  return (
    <>
      <div
        id="form"
        style={{ width: "min(32rem, 94vw)" }}
        className={`login-form mx-auto flex grow-0 flex-col space-y-10 rounded-lg
        ${
          backdropBlur == true ? "bg-white/80 backdrop-blur" : "bg-white"
        } p-40 ${
          noShadow == false ? "shadow-lg" : ""
        } dark:border-gray-700 dark:bg-gray-800 md:space-y-40 ${className}`}
      >
        <div className="mx-auto">
          <h4 className="mb-8 block">{loginFormLabel}</h4>
        </div>

        <div className="!mt-14 flex flex-col space-y-20">
          {errorLoginText && isFetchingAPI == false && (
            <ErrorText text={errorLoginText} />
          )}
          <TextField
            label={textInputLabel}
            value={text}
            isRequired={true}
            showErrorIcon={true}
            errorText={
              errorText.length == 0 || textFieldBlurCount == 0 ? "" : errorText
            }
            // fieldHeight="sm" // sm, md, lg
            onChange={(e: any) => {
              console.log(e.data);
              setText(e.data);
              // handleOnTextInputChange(e.data);
              // if (defaultValidation) {
              //   handleIsTextInputValid(e, "email");
              // }
            }}
            onKeyDown={(e: any) => {
              setText(e.data);
              setTimeout(() => {
                if (
                  !(!isTextValidated || !isPasswordValidated || isFetchingAPI)
                ) {
                  submitClicked({
                    text: text,
                    password: password,
                  });
                }
              }, 200);
            }}
            onBlur={(e: any) => {
              setTextFieldBlurCount((_prev) => _prev + 1);
              setText(e.data);
            }}
          />

          <TextField
            label="Password"
            type={IsPasswordVisible}
            rightIconName={passwordIconName}
            isRightIconClickable={true}
            onRightIconClick={() => {
              if (isClicked == false) {
                setIsClicked(true);
                {
                  setPasswordIconName("eye");
                  setIsPasswordVisible("text");
                }
              } else {
                setIsClicked(false);
                {
                  setPasswordIconName("eye-off");
                  setIsPasswordVisible("password");
                }
              }
            }}
            value={password}
            isRequired={true}
            showErrorIcon={false}
            errorText={
              errorPassword.length == 0 || passwordFieldBlurCount == 0
                ? ""
                : errorPassword
            }
            // fieldHeight="sm" // sm, md, lg
            onChange={(e: any) => {
              console.log(e.data);
              setPassword(e.data);
              // handleOnPasswordChange(e.data);
              // if (defaultValidation) {
              //   handleIsTextInputValid(e, "password");
              // }
            }}
            onKeyDown={(e: any) => {
              setPassword(e.data);

              setTimeout(() => {
                if (
                  !(!isTextValidated || !isPasswordValidated || isFetchingAPI)
                ) {
                  submitClicked({
                    text: text,
                    password: password,
                  });
                }
              }, 200);
            }}
            onBlur={(e: any) => {
              setPasswordFieldBlurCount((_prev) => _prev + 1);
              setPassword(e.data);
              // if (defaultValidation) {
              //   handleIsTextInputValid(e, "password");
              // }
            }}
          />
          <Button
            btnText={btnText}
            type="submit"
            isDisabled={
              !isTextValidated || !isPasswordValidated || isFetchingAPI
            }
            disabledClass="bg-primary-300 text-white pointer-events-none"
            className={btnClassName}
            clicked={() => {
              submitClicked({
                text: text,
                password: password,
              });
            }}
            hasSpinner={btnHasSpinner}
          ></Button>

          {showForgotPass && (
            <Link
              href={forgotPassLink}
              className="mx-auto inline-flex w-max text-center text-primary transition hover:text-primary-600"
            >
              Forgot password?
            </Link>
          )}
          {showSignUp && (
            <div className="text-center text-slate-600 transition hover:text-primary-600">
              Don&apos;t have any account?{" "}
              <Link href={signUpLink} className=" text-primary">
                Create one
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
});

export default LogInForm;
