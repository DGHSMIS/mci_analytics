import FormItemResponseProps from "@components/library/form/FormItemResponseProps";
import { memo, useCallback } from "react";
import { cn } from "tailwind-cn";
import Label from "./Label";

export interface CheckboxProps {
  label?: string;
  value: boolean;
  isDisabled?: boolean;
  color?: string;
  labelClassName?: string;
  size?: "sm" | "md" | "lg";
  onCheck: (e: FormItemResponseProps) => void;
  id?: string;
}
/**
 * Checkbox Component
 * @description
 * Company - ARITS Ltd. 31st Dec 2022.
 * This component is used to render a checkbox in the app.
   @param {boolean} value Initial value of the checkbox when the component is rendered
   @param {boolean} isDisabled Disables the checkbox button (on hover, show not allowed cursor)
   @param {void} onCheck On toggling the button, this function is called and returns the current value to the parent
 */

const Checkbox = memo(function Checkbox({
  size = "md",
  value,
  isDisabled,
  label = "",
  labelClassName = "",
  color = "primary",
  id = "checkboxId",
  onCheck,
}: CheckboxProps) {
  //Handle Toggle Event and Return the value to the parent to re-render the component
  const handleToggleEvent = useCallback(
    (e: any) => {
      const { checked } = e.target;
      //   console.log(checked);
      const data: FormItemResponseProps = {
        data: checked,
        status: 200,
      };
      if (onCheck) {
        onCheck(data);
      }
    },
    [onCheck]
  );
  const accentClass = `${size == "sm" && "h-14 w-14"} ${
    size == "md" && "h-16 w-16"
  } ${
    size == "lg" && "h-20 w-20"
  } rounded border-gray-300 bg-gray-100 text-${color}-500 accent-${color}-500 focus:ring-2 focus:ring-${color}-500 dark:border-gray-600 dark:bg-gray-700 dark:text-${color}-200 dark:accent-${color}-600 dark:ring-offset-gray-800 dark:focus:ring-${color}-600`;
  return (
    <div className="flex items-center">
      <input
        disabled={isDisabled}
        checked={value}
        id={id}
        type="checkbox"
        className={cn(
          size == "lg" ? "" : "my-auto",
          isDisabled ? "hover:cursor-not-allowed" : "",
          accentClass
        )}
        onChange={handleToggleEvent}
      />
      {label.length > 0 && (
        <Label
          text={label}
          marginBottom={false}
          htmlFor={id}
          className={cn(
            "ml-8",
            //! leading-none added below. For some reason it doesn't work when I place it right above in the common classes section :/
            {
              "text-sm leading-none": size == "sm",
              "text-md leading-none": size == "md",
              "text-lg leading-none": size == "lg",
            },
            labelClassName
          )}
        />
      )}
    </div>
  );
});

export default Checkbox;
