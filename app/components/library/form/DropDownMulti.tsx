"use client";

import ButtonIcon from "@components/library/ButtonIcon";
import Chip from "@components/library/Chip";
import Checkbox from "@components/library/form/Checkbox";
import FormItemResponseProps from "@components/library/form/FormItemResponseProps";
import Label from "@components/library/form/Label";
import TextField from "@components/library/form/TextField";
import Icon, { IconProps } from "@components/library/Icon";
import variables from "@variables/variables.module.scss";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "tailwind-cn";

export interface DropDownMultiProps {
  label: string;
  labelClassName?: string;
  itemLabelClassName?: string;
  placeholder?: string;
  items: Array<DropDownMultiItemProps>;
  isDisabled?: boolean;
  isRequired?: boolean;
  className?: string;
  leftIcon?: IconProps["iconName"];
  isFilterable?: boolean;
  filterPlaceholder?: string;
  noItemsFoundText?: string;
  size?: "sm" | "md" | "lg";
  onChange: (value: FormItemResponseProps) => void;
}

export interface DropDownMultiItemProps {
  id: number;
  name: string;
  isHidden?: boolean;
  isChecked: boolean;
}

/**
 * Dropdown Component
 *
 * @description
 * Company - ARITS Ltd. 2nd Jan 2023.
 * This component is used to render a dropdown with single selection ONLY
 *
 * @param {string}          label The label of the dropdown
 * @param {string}          labelClassName The classname for label of the DropDownMulti component
 * @param {string}          placeholder The placeholder of the dropdown
 * @param {array}           items dropdown items
 * @param {number}          index The index of selected item
 * @param {boolean}         isDisabled The disabled state of the dropdown
 * @param {boolean}         isRequired The required state of the dropdown
 * @param {string}          className The class of the dropdown
 * @param {boolean}         leftIcon The left icon on the dropdown
 * @param {boolean}         isFilterable The filterable state of the dropdown
 * @param {string}          filterPlaceholder The placeholder of the filter
 * @param {string}          noItemsFoundText The text to show when no items are found
 * @param {void}            onChange Returns the current value of the dropdown to the parent
 */

const DropDownMulti = memo(function DropDown({
  label = "Nationality",
  labelClassName = "",
  itemLabelClassName = "ml-8",
  placeholder = "-- Select --",
  items,
  isDisabled = false,
  isRequired = false,
  className = "",
  leftIcon = "",
  isFilterable = false,
  filterPlaceholder = "Filter Items",
  noItemsFoundText = "No items found",
  size = "md",
  onChange,
}: DropDownMultiProps) {
  const [ddItems, setDdItems] = useState(items);
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [hasFilteredResults, setHasFilteredResults] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      const val: any = ref.current;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      if (val && !val.contains(event.target)) {
        // You can add your logic here for what should happen when the user clicks outside the component
        isOpen && setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, ref]);

  const handleOnChange = useCallback(
    (index: number) => {
      console.log("Open/Close DD");

      const ddItemsVal: Array<DropDownMultiItemProps> = [];
      ddItems.forEach((item, i) => {
        if (i !== index) {
          ddItemsVal.push(item);
        } else {
          ddItemsVal.push({
            id: item.id,
            name: item.name,
            isChecked: !item.isChecked,
          });
        }
      });
      setDdItems(ddItemsVal);
      if (onChange) {
        const data: FormItemResponseProps = {
          data: ddItemsVal,
          status: 500,
        };
        onChange(data);
      }
    },
    [ddItems, onChange]
  );

  useEffect(() => {
    console.log("DD Items changed");
    console.log(items);
  }, [items]);

  const getSelectedItemName = useCallback(() => {
    const items: Array<any> = [];
    ddItems.forEach((item, index) => {
      if (item.isChecked) {
        items.push(
          <Chip text={item.name} clicked={() => handleOnChange(index)} />
        );
      }
    });
    if (items.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return items;
    }
    return (
      <div
        className="text-slate-400"
        onClick={(e) => !isDisabled && setIsOpen(!isOpen)}
      >
        {placeholder}
      </div>
    );
  }, [ddItems, handleOnChange, isDisabled, isOpen, placeholder]);

  return (
    <div className="altd-dropdown-multi relative transition" ref={ref}>
      {label.length > 0 ? (
        <Label
          text={label}
          isRequired={isRequired}
          className={labelClassName}
        />
      ) : null}
      <button
        disabled={isDisabled}
        onClick={(e) => !isDisabled && setIsOpen(!isOpen)}
        id="dropdownSearchButton"
        data-dropdown-toggle="dropdownSearch"
        data-dropdown-placement="bottom"
        type="button"
        className={cn(
          "scrollbar-hide scrollbar-hide first-letter: inline-flex w-full items-center overflow-y-hidden overflow-x-scroll rounded-lg border border-slate-300 bg-white py-8 pr-[3rem] text-center text-base font-medium text-slate-700 focus-within:border-primary-500 focus:outline-none focus:ring-0 dark:focus-within:border-primary-600",
          leftIcon.length > 0 ? "pl-28" : "pl-12",
          isDisabled && "bg-slate-300 hover:cursor-not-allowed",
          {
            "h-36": size == "sm",
            "h-44": size == "md",
            "h-52": size == "lg",
          },
          className
        )}
      >
        {leftIcon.length > 0 && (
          <Icon
            iconName="chevron-down"
            className={`absolute left-8 ml-2 ${
              isDisabled && "hover:cursor-not-allowed"
            }`}
          />
        )}
        {getSelectedItemName()}
        <div
          className="absolute right-10 bg-white "
          // style={{
          //   boxShadow:
          //     "rgb(255 255 255) 0px -8px 0px, rgb(255 255 255) 0px 10px 0px, rgb(255 255 255) 8px 0px 0px, rgb(255 255 255) 9px 8px 0px, rgb(255 255 255) 9px -8px 0px",
          //   borderRadius: "0 4px 4px 0",
          // }}
        >
          <ButtonIcon
            iconName={isOpen ? "chevron-up" : "chevron-down"}
            className={`ml-2 ${isDisabled && "hover:cursor-not-allowed"}
					${size == "sm" && "top-[34px]"}
					${size == "md" && "top-[38px]"}
					${size == "lg" && "top-[42px]"}
					`}
            clicked={() => setIsOpen(!isOpen)}
          />
        </div>
      </button>
      <div
        id="ddFilter"
        className={`${
          isOpen ? "" : "hidden"
        } absolute z-20 mt-4 w-full rounded bg-white shadow dark:bg-slate-700 `}
      >
        {isFilterable == true && (
          <div className="relative p-8">
            <TextField
              shouldFocus={true}
              label={""}
              value={filterText}
              leftIconName="search-md"
              fieldHeight="sm"
              placeholder={filterPlaceholder}
              onChange={(e) => {
                console.log(e.data);
                // setFilterText(e.data);
                if (typeof e.data == "string") {
                  setFilterText(e.data);
                  if (e.data.length > 0) {
                    const searchTerm = e.data.toLowerCase();
                    const ddNew: DropDownMultiItemProps[] = [];
                    let hasResults = false;
                    ddItems.forEach((item) => {
                      if (item.name.toLowerCase().includes(searchTerm)) {
                        item.isHidden = false;
                        hasResults = true;
                      } else {
                        item.isHidden = true;
                      }
                      ddNew.push(item);
                    });
                    if (hasResults) {
                      setHasFilteredResults(true);
                    } else {
                      setHasFilteredResults(false);
                    }
                    setDdItems(ddNew);
                  } else {
                    const ddNew: DropDownMultiItemProps[] = [];
                    ddItems.forEach((item) => {
                      item.isHidden = false;
                      ddNew.push(item);
                    });
                    setDdItems(ddNew);
                  }
                }
              }}
              onBlur={() => null}
            />
            <span
              className={`absolute right-12 top-[15px] ${
                filterText.length > 0 ? "" : "hidden"
              }`}
            >
              <ButtonIcon
                iconName="x"
                iconColor={variables.gray400}
                clicked={() => {
                  const ddNew: DropDownMultiItemProps[] = [];
                  let hasResults = false;
                  ddItems.forEach((item) => {
                    item.isHidden = false;
                    hasResults = true;
                    ddNew.push(item);
                  });
                  setHasFilteredResults(hasResults);
                  setDdItems(ddNew);
                  setFilterText("");
                }}
              />
            </span>
          </div>
        )}

        <ul
          className={`${
            !isFilterable && "pt-8"
          } max-h-204 overflow-y-auto px-8 pb-8 text-base text-slate-700  dark:text-slate-200`}
          aria-labelledby="dropdownSearchButton"
        >
          {/* If not items are found */}
          {!hasFilteredResults && (
            <li className="py-4 transition hover:cursor-pointer">
              <div className="flex items-center rounded pl-4 hover:cursor-pointer">
                <Label
                  text={noItemsFoundText}
                  className="ml-12 pt-4 hover:cursor-default"
                />
              </div>
            </li>
          )}
          {ddItems.map((item, i) => {
            if (item.isHidden) {
              return null;
            }
            return (
              <li
                key={i}
                // onClick={(e) => handleOnChange(i)}
                className={`mb-4 rounded py-4 transition hover:cursor-pointer ${
                  item.isChecked
                    ? "bg-primary-400"
                    : "hover:bg-slate-100 dark:hover:bg-slate-600"
                }`}
                onClick={() => handleOnChange(i)}
              >
                <div className="flex items-center rounded pl-12 hover:cursor-pointer">
                  <Checkbox
                    value={item.isChecked ? true : false}
                    onCheck={() => handleOnChange(i)}
                  />
                  <Label
                    text={item.name}
                    className={cn(
                      "ml-0 pt-4 hover:cursor-pointer",
                      item.isChecked && "text-white",
                      itemLabelClassName
                    )}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
});

export default DropDownMulti;
