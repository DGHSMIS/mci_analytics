import ButtonIcon from "@components/library/ButtonIcon";
import ErrorText from "@components/library/form/ErrorText";
import FormItemResponseProps from "@components/library/form/FormItemResponseProps";
import Label from "@components/library/form/Label";
import Icon, { IconProps } from "@components/library/Icon";
import {
  ChangeEvent,
  FocusEvent,
  FormEvent,
  HTMLInputTypeAttribute,
  KeyboardEvent,
  memo,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { cn } from "tailwind-cn";

// just extend this array if you want to add more key names
const KEY_NAMES = [
  "Enter",
  "Tab",
  "Delete",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "End",
  "Home",
  "PageDown",
  "PageUp",
  "Backspace",
  "Escape",
  "Spacebar",
  "Pause",
  "Insert",
  "CapsLock",
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "F6",
  "F7",
  "F8",
  "F9",
  "F10",
  "F11",
  "F12",
  "PrintScreen",
  "ScrollLock",
  "MetaLeft",
  "MetaRight",
  "ContextMenu",
  "OSLeft",
  "OSRight",
  "ControlLeft",
  "ControlRight",
  "ShiftLeft",
  "ShiftRight",
  "AltLeft",
  "AltRight",
  "AudioVolumeDown",
  "AudioVolumeUp",
  "AudioVolumeMute",
  "MediaTrackNext",
  "MediaTrackPrevious",
  "MediaStop",
  "MediaPlayPause",
  "Semicolon",
  "Equal",
  "NumpadDecimal",
  "NumpadMultiply",
  "NumpadAdd",
  "NumpadSubtract",
  "NumpadDivide",
  "NumpadComma",
  "Numpad0",
  "Numpad1",
  "Numpad2",
  "Numpad3",
  "Numpad4",
  "Numpad5",
  "Numpad6",
  "Numpad7",
  "Numpad8",
  "Numpad9",
  "Digit0",
  "Digit1",
  "Digit2",
  "Digit3",
  "Digit4",
  "Digit5",
  "Digit6",
  "Digit7",
  "Digit8",
  "Digit9",
  "KeyA",
  "KeyB",
  "KeyC",
  "KeyD",
  "KeyE",
  "KeyF",
  "KeyG",
  "KeyH",
  "KeyI",
  "KeyJ",
  "KeyK",
  "KeyL",
  "KeyM",
  "KeyN",
  "KeyO",
  "KeyP",
  "KeyQ",
  "KeyR",
  "KeyS",
  "KeyT",
  "KeyU",
  "KeyV",
  "KeyW",
  "KeyX",
  "KeyY",
  "KeyZ",
  "Meta",
  "ContextMenu",
  "Escape",
  "OSLeft",
  "OSRight",
  "ScrollLock",
  "Home",
  "End",
  "PageUp",
  "PageDown",
  "ArrowLeft",
  "ArrowUp",
  "ArrowRight",
  "ArrowDown",
  "NumpadMultiply",
  "NumpadAdd",
  "NumpadSubtract",
  "NumpadDecimal",
  "NumpadDivide",
  "Backspace",
  "Enter",
  "Tab",
  "Escape",
  "ShiftLeft",
  "ShiftRight",
  "ControlLeft",
  "ControlRight",
  "AltLeft",
  "AltRight",
  "CapsLock",
  "AudioVolumeMute",
  "AudioVolumeDown",
  "AudioVolumeUp",
  "MediaTrackNext",
  "MediaTrackPrevious",
  "MediaStop",
  "MediaPlayPause",
  "Semicolon",
  "Equal",
  "Numpad0",
  "Numpad1",
  "Numpad2",
  "Numpad3",
  "Numpad4",
  "Numpad5",
  "Numpad6",
  "Numpad7",
  "Numpad8",
  "Numpad9",
  "KeyA",
  "KeyB",
  "KeyC",
  "KeyD",
  "KeyE",
  "KeyF",
  "KeyG",
  "KeyH",
  "KeyI",
  "KeyJ",
  "KeyK",
  "KeyL",
  "KeyM",
  "KeyN",
  "KeyO",
  "KeyP",
  "KeyQ",
  "KeyR",
  "KeyS",
  "KeyT",
  "KeyU",
  "KeyV",
  "KeyW",
  "KeyX",
  "KeyY",
  "KeyZ",
  "MetaLeft",
  "MetaRight",
  "ContextMenu",
] as const;

export interface TextFieldProps {
  id?: string;
  label?: string;
  labelClassName?: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  value?: string | number;
  isRounded?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  isReadOnly?: boolean;
  minLen?: number;
  maxLen?: number;
  errorText?: string;
  name?: string;
  hintText?: string;
  className?: string;
  shellClassName?: string;
  fieldHeight?: "sm" | "md" | "lg";
  showErrorIcon?: boolean;
  iconSize?: string;
  iconStrokeWidth?: string;
  errorIconColor?: string;
  iconColor?: string;
  leftIconName?: IconProps["iconName"];
  rightIconName?: IconProps["iconName"];
  isRightIconClickable?: boolean;
  errorIconName?: IconProps["iconName"];
  stepSize?: number;
  getTargetElement?: boolean;
  shouldFocus?: boolean;
  onClick?: (e: MouseEvent<HTMLInputElement>) => void;
  onChange?: (
    e: FormItemResponseProps,
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  onBlur?: (
    e: FormItemResponseProps,
    event: FocusEvent<HTMLInputElement>
  ) => void;
  onFocus?: (e: FormItemResponseProps, event: FocusEvent<HTMLElement>) => void;
  onInput?: (
    e: FormItemResponseProps,
    event: FormEvent<HTMLInputElement>
  ) => void;
  onKeyUpKeyName?:
    | (typeof KEY_NAMES)[number]
    | (typeof KEY_NAMES)[number][]
    | (string & {})
    | (string & {})[];
  onKeyUp?: (
    e: FormItemResponseProps,
    event: KeyboardEvent<HTMLInputElement>
  ) => void;
  onKeyDownKeyName?: (typeof KEY_NAMES)[number] | (typeof KEY_NAMES)[number][];
  onKeyDown?: (
    e: FormItemResponseProps,
    event: KeyboardEvent<HTMLInputElement>
  ) => void;
  onRightIconClick?: () => void;
}

/**
 * TextField Component
 *
 * @description
 * Company - ARITS Ltd. 1st Jan 2023.
 * This component is used to render a text field
 * The tab component is capable of showing text, icons and badges with counts.
 * The tab component can have disabled tabs.
 * On click of a tab, the tab index is returned to the parent component.
 * The parent component can then use the index to render the content.
 * Please note,  require('@tailwindcss/forms'), is required in the tailwind.config.js file.
 * for this component to work.
 * @param {string}   label The label of the text field
 * @param {string}   labelClassName The classname for label of the TextField component
 * @param {string}   placeholder The placeholder of the text field
 * @param {string}   type The type of the text field
 * @param {string}   value The initial value of the text field
 * @param {boolean}  isRounded Determines whether corners are rounded | default: true
 * @param {boolean}  isDisabled The disabled state of the text field
 * @param {boolean}  isRequired The required state of the text field
 * @param {string}   minLen The minimum length of the text field
 * @param {string}   maxLen The maximum length of the text field
 * @param {string}   className The class of the text field
 * @param {string}   fieldHeight The height of the text field
 * @param {boolean}  showErrorIcon Show The right error icon on the text field
 * @param {string}   leftIconName The left icon name on the text field
 * @param {string}   rightIconName The right icon name on the text field
 * @param {string}   errorText The error message of the text field
 * @param {string}   hintText The hint text on the text field
 * @param {string}   iconSize The size of the icon on the text field
 * @param {string}   iconStrokeWidth The stroke width of the icon on the text field
 * @param {string}   errorIconColor The color of the error icon on the text field
 * @param {string}   iconColor The color of the icon on the text field
 * @param {string}   errorIconName The error icon name on the text field
 * @param {number}   stepSize The step size of the text field
 * @param {void}     onChange Returns the current value of the text field to the parent
 * @param {void}     onBlur Returns the current value of the text field to the parent
 * @params {void}    onInput Returns the current value of the text field to the parent
 */

const TextField = ({
  id,
  label = "",
  labelClassName = "",
  placeholder = undefined,
  type = "text",
  value = "",
  isDisabled = false,
  isRounded = true,
  isRequired = false,
  isReadOnly = false,
  minLen = 1,
  maxLen = 255,
  errorText = "",
  name = "",
  hintText = "",
  className,
  shellClassName,
  fieldHeight = "md", //sm/md/lg
  showErrorIcon = false,
  leftIconName,
  rightIconName,
  isRightIconClickable = false,
  iconSize = "20px",
  iconStrokeWidth = "2px",
  errorIconColor = "#f43f5e",
  errorIconName = "alert-triangle",
  iconColor = "#98a2b3",
  stepSize = 1,
  getTargetElement = false,
  shouldFocus = false,
  onClick,
  onChange,
  onBlur,
  onFocus,
  onKeyUpKeyName = "Enter",
  onKeyUp,
  onKeyDownKeyName = "Enter",
  onKeyDown,
  onInput,
  onRightIconClick,
}: TextFieldProps) => {
  const localRef = useRef<HTMLInputElement>(null);
  const isLeftIconValid = () => {
    return typeof leftIconName !== "undefined";
  };
  const isRightIconValid = () => {
    return typeof rightIconName !== "undefined";
  };

  const handleClick = (e: any) => {
    if (onClick) {
      onClick(e);
    }
  };

  const handleOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();

      if (onChange) {
        let { value } = e.target;
        value = type === "email" ? value.trim() : value;

        try {
          if (getTargetElement) {
            const data: FormItemResponseProps = {
              data: value,
              status: 200,
              element: e.target,
            };
            onChange(data, e);
          } else {
            const data: FormItemResponseProps = {
              data: value,
              status: 200,
            };
            onChange(data, e);
          }
        } catch (err) {
          const data: FormItemResponseProps = {
            data: value,
            status: 500,
          };
          onChange(data, e);
        }
      }
    },
    [onChange]
  );

  const handleOnBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      e.preventDefault();

      if (onBlur) {
        const { value } = e.target;

        try {
          const data: FormItemResponseProps = {
            data: value,
            status: 200,
          };
          onBlur(data, e);
        } catch (err) {
          const data: FormItemResponseProps = {
            data: value,
            status: 500,
          };
          onBlur(data, e);
        }
      }
    },
    [onBlur]
  );

  const handleOnFocus = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      e.preventDefault();

      if (onFocus) {
        const { value } = e.target;

        try {
          const data: FormItemResponseProps = {
            data: value,
            status: 200,
          };
          onFocus(data, e);
        } catch (err) {
          const data: FormItemResponseProps = {
            data: value,
            status: 500,
          };
          onFocus(data, e);
        }
      }
    },
    [onFocus]
  );

  const handleOnInput = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      e.preventDefault();

      if (onInput) {
        const { value } = e.target as HTMLInputElement;

        try {
          const data: FormItemResponseProps = {
            data: value,
            status: 200,
          };
          onInput(data, e);
        } catch (err) {
          const data: FormItemResponseProps = {
            data: value,
            status: 500,
          };
          onInput(data, e);
        }
      }
    },
    [onInput]
  );

  const handleOnKeyUpEnter = useCallback(
    (e: string | number, event: KeyboardEvent<HTMLInputElement>) => {
      // console.log(e);
      if (onKeyUp) {
        try {
          const data: FormItemResponseProps = {
            data: e,
            status: 200,
          };
          onKeyUp(data, event);
        } catch (err) {
          const data: FormItemResponseProps = {
            data: value,
            status: 500,
          };
          onKeyUp(data, event);
        }
      }
    },
    [onKeyUp]
  );

  const handleOnKeyDownEnter = useCallback(
    (e: string | number, event: KeyboardEvent<HTMLInputElement>) => {
      // console.log(e);
      if (onKeyDown) {
        try {
          const data: FormItemResponseProps = {
            data: e,
            status: 200,
          };
          onKeyDown(data, event);
        } catch (err) {
          const data: FormItemResponseProps = {
            data: value,
            status: 500,
          };
          onKeyDown(data, event);
        }
      }
    },
    [onKeyDown]
  );

  const handleOnRightIconClick = useCallback(() => {
    if (onRightIconClick) {
      onRightIconClick();
    }
  }, [onRightIconClick]);

  useEffect(() => {
    // if shouldFocus is true, focus on the input element
    shouldFocus && localRef?.current?.focus();
  }, []);

  return (
    <div className="altd-text-field w-full transition">
      {label.length > 0 ? (
        <Label
          text={label}
          isRequired={isRequired}
          className={labelClassName}
        />
      ) : null}
      <div
        className={cn(
          "relative bg-white dark:bg-slate-800",
          isRounded == true ? "rounded-md" : "",
          shellClassName
        )}
      >
        <input
          ref={localRef}
          value={value}
          onClick={(e) => handleClick(e)}
          onChange={(e) => handleOnChange(e)}
          onBlur={(e) => handleOnBlur(e)}
          onFocus={(e) => handleOnFocus(e)}
          onInput={(e) => handleOnInput(e)}
          onKeyUp={(e) => {
            if (e.key === onKeyUpKeyName) {
              onKeyUp && handleOnKeyUpEnter(value, e);
            }
          }}
          onKeyDown={(e) => {
            const isValid =
              e.key === onKeyDownKeyName ||
              e.code === onKeyDownKeyName ||
              (Array.isArray(onKeyDownKeyName) &&
                onKeyDownKeyName.includes(
                  e.key as (typeof onKeyDownKeyName)[number]
                ));

            if (isValid) {
              onKeyDown && handleOnKeyDownEnter(value, e);
            }
          }}
          disabled={isDisabled}
          type={type}
          name={name ? name : label}
          id={id ? id : label}
          readOnly={isReadOnly}
          step={type === "number" ? stepSize : undefined}
          minLength={isRequired ? minLen : 0}
          maxLength={maxLen}
          className={cn(
            "left-8 block w-full border font-medium text-slate-700 placeholder-slate-400",
            isRounded == true ? "rounded-md" : "",
            errorText.length > 0
              ? " border-red-300 ring-red-300 focus-within:border-red-500 focus-within:ring-red-500"
              : "border-slate-300 ring-slate-300 focus-within:border-primary-500 focus-within:ring-primary-500 focus:outline-none focus:ring-0",

            isLeftIconValid() ? "pl-36" : "pl-12",
            isRightIconValid() ? "pr-36" : "pr-8",
            fieldHeight == "sm" && "h-36",
            fieldHeight == "md" && "h-44",
            fieldHeight == "lg" && "h-52",

            isDisabled
              ? "!bg-slate-200 opacity-50 hover:hover:cursor-not-allowed"
              : "",
            className
          )}
          placeholder={placeholder ? placeholder : label}
        />
        {isLeftIconValid() ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-8">
            <Icon
              iconName={leftIconName}
              iconSize={iconSize}
              iconColor={iconColor}
              iconStrokeWidth={iconStrokeWidth}
            />
          </div>
        ) : null}
        {isRightIconValid() ? (
          <div
            className={`${
              !isRightIconClickable && "pointer-events-none"
            } absolute inset-y-0 right-0 flex items-center pr-8`}
          >
            {isRightIconClickable ? (
              <ButtonIcon
                iconName={rightIconName}
                iconSize={iconSize}
                iconColor={iconColor}
                iconStrokeWidth={iconStrokeWidth}
                clicked={() => handleOnRightIconClick()}
              />
            ) : (
              <Icon
                iconName={rightIconName}
                iconSize={iconSize}
                iconColor={iconColor}
                iconStrokeWidth={iconStrokeWidth}
              />
            )}
          </div>
        ) : null}
        {errorText.length > 0 && showErrorIcon ? (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-8">
            <Icon
              iconName={errorIconName}
              iconSize={iconSize}
              iconColor={errorIconColor}
              iconStrokeWidth={iconStrokeWidth}
            />
          </div>
        ) : null}
      </div>
      {errorText.length > 0 ? <ErrorText text={errorText} /> : null}
      {hintText.length > 0 && errorText.length == 0 ? (
        <p
          className={`mt-2 text-sm !text-slate-500 ${
            errorText.length > 0 ? "" : "pt-4"
          }`}
          id="email-description"
        >
          {hintText}
        </p>
      ) : null}
    </div>
  );
};

export default memo(TextField);
