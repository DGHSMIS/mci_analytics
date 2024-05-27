import ErrorText from "@library/form/ErrorText";
import Label from "@library/form/Label";
import { cn } from "tailwind-cn";

export interface TextAreaProps {
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  label?: string;
  labelClassName?: string;
  className?: string;
  errorText?: string;
  shellClassName?: string;
  rows?: number;
  isDisabled?: boolean;
  isRequired?: boolean;
  onChange?: (e: any) => void;
  onBlur?: (e: any) => void;
}

/**
 * Textarea Component
 * @description
 * Company - ARITS Ltd. 12th Jan 2022.
 * This component is used to render textarea element in the app.
 * @param {number | string} id The ID of the Textarea
 * @param {string} name The name of the Textarea component
 * @param {string} value The value of the Textarea component
 * @param {string} defaultValue The default value of the Textarea component
 * @param {string} placeholder The placeholder of the Textarea component
 * @param {string} label The label of the Textarea component
 * @param {string} labelClassName The classname for label of the TextArea component
 * @param {string} shellClassName Add a class at the container level of the component
 * @param {string} className Add a class for the textarea input field
 * @param {string} errorText The error message of the textarea input field
 * @param {number} rows Define the number of rows (height of the textarea)
 * @param {boolean} isRequired - The required state of the dropdown
 * @param {boolean} isDisabled The disabled state of the Textarea component
 * @param {void} onChange The onChange event of the Textarea component
 * @param {void} onBlur The onBlur event of the Textarea component
 */

export default function TextArea({
  id = "",
  name = "name",
  value = "",
  defaultValue = "",
  placeholder,
  label = "",
  labelClassName = "",
  className = "",
  errorText = "",
  shellClassName = "",
  rows = 4,
  isDisabled = false,
  isRequired = false,
  onChange,
  onBlur,
}: TextAreaProps) {
  return (
    <>
      <div className={`altd-text-area w-full ${shellClassName}`}>
        {label.length > 0 && (
          <Label
            htmlFor={name}
            isRequired={isRequired}
            text={label.length > 0 ? label : name}
            className={cn(
              "block",
              labelClassName,
              isDisabled && "hover:pointer-events-none hover:cursor-not-allowed"
            )}
          />
        )}
        <textarea
          rows={rows}
          name={name}
          id={id}
          className={cn(
            "block w-full rounded-md border-slate-300 bg-white font-medium text-slate-700 placeholder-slate-400 focus-within:border-primary-500 focus-within:ring-primary-500 focus:ring-0 sm:text-sm md:text-base",
            isDisabled &&
              "resize-none bg-slate-300 hover:pointer-events-none hover:cursor-not-allowed",
            errorText.length > 0
              ? "border-red-300 ring-red-300 focus-within:border-red-500 focus-within:ring-red-500"
              : "border-slate-300 ring-slate-300 focus-within:border-primary-500 focus-within:ring-primary-500 focus:outline-none focus:ring-0",
            className
          )}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={isDisabled}
          onChange={(e) => {
            if (onChange) {
              onChange(e);
            }
          }}
          onBlur={(e) => {
            if (onBlur) {
              onBlur(e);
            }
          }}
        />
        {errorText.length > 0 ? <ErrorText text={errorText} /> : null}
      </div>
    </>
  );
}
