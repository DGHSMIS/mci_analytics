"use client";

import FormItemResponseProps from "@components/library/form/FormItemResponseProps";
import { Switch } from "@headlessui/react";
import { memo, useCallback, useState } from "react";
import { cn } from "tailwind-cn";
import Label from "./Label";

export interface ToggleProps {
  value: boolean;
  isDisabled?: boolean;
  bgColorClass?: string;
  size?: "lg" | "md" | "sm";
  label?: string;
  isRequired?: boolean;
  onToggle: (e: FormItemResponseProps) => void;
}

/**
 * Toggle Component
 *
 * @description
 * Company - ARITS Ltd. 29th Dec 2022.
 * This component is used to render a toggle switch in the app.
 *
 * @param {boolean} value — Initial value of the toggle when the component is rendered
 * @param {boolean} isDisabled — Disables the toggle button (on hover, show not allowed cursor)
 * @param {string} bgColorClass — Set a custom class to change the color from green-500 to something else
 * @param {string} size — Set the size of the toggle button. Can be 'lg', 'md' or 'sm'
 * @param {string} label — Set the label of the toggle button if any
 * @param {boolean} isRequired — Set the toggle button as required
 * @param {void} onToggle — On toggling the button, this function is called and returns the current value to the parent
 */

const Toggle = memo(function Toggle({
  value,
  isDisabled = false,
  bgColorClass = "bg-green-500",
  size,
  label = "",
  isRequired = false,
  onToggle,
}: ToggleProps) {
  const [sizeClassArray, setSizeClassArray] = useState<Array<string>>([]);
  const [bgColor, setBgColor] = useState<string>(bgColorClass);
  //Handle Size of the Toggle

  function sizeClasses() {
    if (size === "lg") {
      if (
        JSON.stringify(sizeClassArray) !==
        JSON.stringify(["h-32 w-52", "h-28 w-28"])
      ) {
        setSizeClassArray(["h-32 w-52", "h-28 w-28"]);
      }
    } else if (size === "md") {
      if (
        JSON.stringify(sizeClassArray) !==
        JSON.stringify(["h-24 w-44", "h-20 w-20"])
      ) {
        setSizeClassArray(["h-24 w-44", "h-20 w-20"]);
      }
    } else if (size === "sm") {
      if (
        JSON.stringify(sizeClassArray) !==
        JSON.stringify(["h-16 w-36", "h-12 w-12"])
      ) {
        setSizeClassArray(["h-16 w-36", "h-12 w-12"]);
      }
    } else {
      if (sizeClassArray.length == 0) {
        setSizeClassArray(["h-24 w-44", "h-20 w-20"]);
      }
    }
  }

  //Handle Toggle Event and Return the value to the parent to re-render the component
  const handleToggle = useCallback(
    (e: any) => {
      if (onToggle) {
        try {
          const data: FormItemResponseProps = {
            data: e,
            status: 200,
          };
          onToggle(data);
        } catch (err) {
          const data: FormItemResponseProps = {
            data: e,
            status: 500,
          };
          onToggle(data);
        }
      }
    },
    [onToggle]
  );

  console.log("Toggle Rendering");
  sizeClasses();
  return (
    <div className="altd-toggle flex items-center justify-between">
      {label.length > 0 ? (
        <Label className="mr-4 inline" text={label} isRequired={isRequired} />
      ) : null}
      <Switch.Group as="div" className="flex items-center">
        <Switch
          disabled={isDisabled}
          checked={value}
          onChange={handleToggle}
          className={cn(
            "relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75",
            isDisabled && "bg-slate-300 hover:cursor-not-allowed",
            value ? bgColor : "bg-slate-400",
            sizeClassArray[0]
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none inline-block transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
              value ? "translate-x-20" : "translate-x-0",
              sizeClassArray[1]
            )}
          />
        </Switch>
      </Switch.Group>
    </div>
  );
});

export default Toggle;
