import { Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useRef, useState } from "react";
import ColorPick, { themes } from "react-pick-color";
// import variables from "@variables/variables.module.scss"
import { cn } from "tailwind-cn";
import twcolors from "tailwindcss/colors";
import ButtonIcon from "./ButtonIcon";
import Label from "./form/Label";

// import Icon from "./Icon";

export interface ColorObjectProps {
  hex: string;
  rgb: object;
  hsl: object;
  alpha: number;
}

export interface ColorPickerProps {
  hasLabel?: boolean;
  labeText?: string;
  initialColor?: string;
  hideInputs?: boolean;
  hideAlpha?: boolean;
  combination?:
    | "analogous"
    | "monochromatic"
    | "splitcomplement"
    | "triad"
    | "tetrad"
    | "complement";
  fieldHeight?: string;
  containerClassName?: string;
  labelClassName?: string;
  className?: string;
  isOpen?: (e: boolean) => void;
  onChange: (e: ColorObjectProps) => void;
}

/**
 * ColorPicker Component
 *
 * @description
 * Company - ARITS Ltd. 19th June 2023.
 * This component is used to render a color picker
 * The color picker component is capable of setting hex value/rgb value
 * The color picker component also shows related color palette of the selected color
 * On cursor change, this component returns a object(ColorObjectProps type) which contains hex values,rgb values,hsl values,alpha values .
 * The parent component can also can get the status of the color picker either its open or collapsed.

 * @param {boolean}  hasLabel To hide/show if there would be any label of component
 * @param {string}   label The label of the color picker component
 * @param {string}   labelClassName The classname for label of the ColorPicker component
 * @param {boolean}  hideInputs To hide/show if there would be any hex/rgb/alpha value input
 * @param {boolean}  hideAlpha To hide/show if there would be any alpha value range
 * @param {"analogous"| "monochromatic"| "splitcomplement"| "triad"| "tetrad"|     "complement"}       combination to set the type of combination of the related color palette of the selected color
 * @param {void}     onCursorChange Returns the current object value of the color containing hex,rgb,hsl,alpha value to the parent
 * @param {void}     isOpen Returns the current status of the color picker either its open or closed to the parent
 */

export const ColorPicker = ({
  hasLabel = true,
  labeText = "Pick a Color",
  hideInputs = false,
  hideAlpha = false,
  combination = "monochromatic",
  initialColor = "#000000",
  fieldHeight = "md",
  containerClassName,
  labelClassName = "",
  className = "",
  isOpen,
  onChange,
}: ColorPickerProps) => {
  const [color, setColor] = useState(initialColor);
  const [colorObj, setColorObj] = useState<ColorObjectProps>({
    hex: initialColor,
    alpha: 1,
    hsl: { h: 0, s: 0, l: 0, a: 1 },
    rgb: { r: 0, g: 0, b: 0, a: 1 },
  });
  const [showPicker, setShowPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      console.log(event);
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (onChange) {
      onChange(colorObj);
    }
  }, [colorObj]);

  useEffect(() => {
    if (isOpen) {
      isOpen(showPicker);
    }
  }, [showPicker]);

  const handleClick = () => {
    setShowPicker(!showPicker);
  };

  return (
    <div className={cn("color-picker relative", containerClassName)}>
      {hasLabel && <Label text={labeText} className={labelClassName} />}
      <div ref={colorPickerRef}>
        <div
          className={cn(
            "dark flex w-full items-center justify-between space-x-16 rounded border-2 border-slate-400 px-12 py-4 ",
            fieldHeight == "sm" && "h-36",
            fieldHeight == "md" && "h-44",
            fieldHeight == "lg" && "h-52",
            className
          )}
        >
          <div className="flex gap-x-12">
            <div
              className="aspect-square w-20 cursor-pointer rounded"
              style={{ background: color }}
              onClick={handleClick}
            />
            {colorObj && (
              <span className="font-medium text-gray-500">{colorObj.hex}</span>
            )}
          </div>
          <ButtonIcon
            iconColor={twcolors.slate[400]}
            iconName="chevron-down"
            clicked={handleClick}
          />
        </div>

        {/* {showPicker && ( */}

        <Transition
          as={Fragment}
          show={showPicker}
          enter="transition ease-out duration-200"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div style={{ position: "absolute", zIndex: "2" }} className="mt-8">
            <ColorPick
              theme={themes.light}
              color={color}
              hideInputs={hideInputs}
              hideAlpha={hideAlpha}
              combinations={combination}
              onChange={(color: ColorObjectProps) => {
                setColorObj(color);
                setColor(color.hex);
              }}
            />
          </div>
        </Transition>
      </div>

      {/* )} */}
    </div>
  );
};
