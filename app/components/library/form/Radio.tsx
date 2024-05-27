import FormItemResponseProps from "@components/library/form/FormItemResponseProps";
import Label from "@components/library/form/Label";
import { memo, useCallback } from "react";
import { cn } from "tailwind-cn";

export interface RadioItemProps {
  id: number | string;
  name: string;
  label: string;
  isDisabled?: boolean;
  isChecked: boolean;
}

export interface RadioGroupProps {
  id: number | string;
  data: RadioItemProps[];
  label?: string;
  labelClassName?: string;
  hintText?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  marginBottom?: boolean;
  clicked: (e: FormItemResponseProps) => void;
}

/**
 * Radio Component
 * @description
 * Company - ARITS Ltd. 31st Dec 2022.
 * This component is used to render a radio in the app.
 * @param {number | string} id The ID of the radio
 * @param {string} label The label of the radio component
 * @param {string} labelClassName The classname for label of the Radio component
 * @param {string} name The name of the radio component
 * @param {string} hintText The hint text of the radio component
 * @param {boolean} isRequired The required state of the dropdown
 * @param {boolean} isDisabled The disabled state of the radio component
 * @param {RadioItemProps[]} The items to choose in the radio component
 * @param {FormItemResponseProps} clicked The callback function to return the value of the radio component to the parent
 */

const Radio = memo(function Radio({
  id,
  data,
  label = "",
  labelClassName = "",
  hintText = "",
  isDisabled = false,
  isRequired = false,
  marginBottom = false,
  clicked,
}: RadioGroupProps) {
  //Handle Toggle Event and Return the value to the parent to re-render the component
  const handleClick = useCallback(
    (e: any) => {
      const results: RadioItemProps[] = [];
      data.forEach((item, index) => {
        if (item.id == e.id) {
          item.isChecked = true;
        } else {
          item.isChecked = false;
        }
        results.push(item);
      });
      const data2: FormItemResponseProps = {
        data: results,
        status: 200,
      };
      if (clicked) {
        clicked(data2);
      }
    },
    [clicked, data]
  );

  return (
    <div id={id.toString()} className="altd-radio">
      {label.length > 0 ? <Label text={label} isRequired={isRequired} /> : null}
      {hintText.length > 0 && (
        <p className="mb-12 text-sm leading-5 text-slate-500">{hintText}</p>
      )}
      <fieldset disabled={isDisabled}>
        {label.length > 0 && <legend className="sr-only">{label}</legend>}
        {data.map((item, index) => (
          <div
            className="flex max-w-max items-start py-4 md:items-center"
            key={index.toString()}
            onClick={() => !isDisabled && handleClick(item)}
          >
            <input
              id={item.id.toString()}
              name={item.name}
              type="radio"
              checked={item.isChecked}
              disabled={item.isDisabled}
              className={cn(
                "h-16 w-16 border-slate-300 text-primary-500 focus:ring-primary-500",
                item.isDisabled &&
                  "hover:pointer-events-none hover:cursor-not-allowed"
              )}
            />
            {/* Radio Item Label */}
            <Label
              marginBottom={marginBottom}
              htmlFor={item.id.toString()}
              text={item.label.length > 0 ? item.label : item.name}
              className={cn(
                "ml-6 inline-block !pb-0 font-medium !text-slate-700",
                item.isDisabled &&
                  "hover:pointer-events-none hover:cursor-not-allowed",
                labelClassName
              )}
            />
          </div>
        ))}
      </fieldset>
    </div>
  );
});

export default Radio;
