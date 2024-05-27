"use client";

import ButtonIcon from "@components/library/ButtonIcon";
import FormItemResponseProps from "@components/library/form/FormItemResponseProps";
import Label from "@components/library/form/Label";
import TextField from "@components/library/form/TextField";
import Icon, { IconProps } from "@components/library/Icon";
import ErrorText from "@library/form/ErrorText";
import {
  FocusEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "tailwind-cn";
import twcolors from "tailwindcss/colors";

export interface DropDownSingleProps {
  label?: string;
  labelClassName?: string;
  placeholder?: string;
  items: Array<DropDownSingleItemProps>;
  index: number | null;
  isDisabled?: boolean;
  isRequired?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  fontSize?: string;
  fontWeight?: string;
  leftIcon?: IconProps["iconName"];
  reset?: boolean;
  isFilterable?: boolean;
  filterPlaceholder?: string;
  noItemsFoundText?: string;
  errorText?: string;
  onChange: (value: FormItemResponseProps) => void;
  onBlur?: (value: FormItemResponseProps) => void;
}

export interface DropDownSingleItemProps {
  id: number;
  name: string;
  icon?: IconProps["iconName"];
  isHidden?: boolean;
}

/**
 * Dropdown Component
 *
 * @description
 * Company - ARITS Ltd. 2nd Jan 2023.
 * This component is used to render a dropdown with single selection ONLY
 *
 * @param {string}          label The label of the dropdown
 * @param {string}          labelClassName The classname for label of the DropDownSingle component
 * @param {string}          placeholder The placeholder of the dropdown
 * @param {array}           items dropdown items
 * @param {number}          index The index of selected item
 * @param {boolean}         isDisabled The disabled state of the dropdown
 * @param {boolean}         isRequired The required state of the dropdown
 * @param {string}          errorText The error message of the dropdown
 * @param {string}          fontSize The overall fontsize of the component
 * @param {string}          className The class of the dropdown
 * @param {boolean}         leftIcon The left icon on the dropdown
 * @param {boolean}         isFilterable The filterable state of the dropdown
 * @param {string}          filterPlaceholder The placeholder of the filter
 * @param {string}          noItemsFoundText The text to show when no items are found
 * @param {void}            onChange Returns the current value of the dropdown to the parent
 * @param {void}            onBlur Returns the current value of the text field to the parent
 */

const DropDownSingle = memo(function DropDown({
  label = "",
  labelClassName = "",
  placeholder = "-- Select --",
  items,
  index = null,
  isDisabled = false,
  isRequired = false,
  className = "",
  size = "md",
  fontSize = "text-base",
  fontWeight = "font-medium",
  leftIcon = "",
  isFilterable = false,
  filterPlaceholder = "Filter Items",
  noItemsFoundText = "No items found",
  reset = false,
  errorText = "",
  onChange,
  onBlur,
}: DropDownSingleProps) {
  const [ddItems, setDdItems] = useState(items);
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(index);
  const ref = useRef(null);
  const btnRef = useRef<any>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      const val: any = ref.current;

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

  useEffect(() => {
    if (reset) {
      setIsOpen(false);
      setSelectedIndex(null);
      setFilterText("");
      setDdItems(items);
    }
  }, [reset]);

  useEffect(() => {
    setDdItems(items);
  }, [items]);

  useEffect(() => {
    setSelectedIndex(index);
  }, [index]);

  const handleOnChange = useCallback(
    (index: any) => {
      setDdItems(items);
      console.log("Open/Close DD");
      console.log(index);
      setSelectedIndex(index);
      setIsOpen(!isOpen);
      if (onChange) {
        const data: FormItemResponseProps = {
          data: ddItems[index],
          status: 500,
        };
        onChange(data);
      }
    },
    [ddItems, isOpen, items, onChange]
  );
  const handleOnBlur = (e: FocusEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // console.log(e);
    if (onBlur) {
      const { value } = e.target;
      try {
        const data: FormItemResponseProps = {
          data: value,
          status: 200,
        };
        onBlur(data);
      } catch (err) {
        const data: FormItemResponseProps = {
          data: value,
          status: 500,
        };
        onBlur(data);
      }
    }
  };
  const getSelectedItemName = useCallback(
    (index: number | null) => {
      if (index !== null) {
        if (typeof index === "number") {
          if (ddItems[index]) {
            if (typeof ddItems[index].name === "string") {
              return ddItems[index].name;
            }
          }
        }
      }
      return <div className="text-slate-400">{placeholder}</div>;
    },
    [ddItems, placeholder]
  );

  return (
    <div className="altd-dropdown-single relative w-full transition" ref={ref}>
      {label.length > 0 ? (
        <Label
          text={label}
          isRequired={isRequired}
          className={labelClassName}
        />
      ) : null}
      <button
        ref={btnRef}
        disabled={isDisabled}
        onClick={(e) => {
          !isDisabled && setIsOpen(!isOpen);
        }}
        onBlur={(e) => handleOnBlur(e)}
        id="dropdownSearchButton"
        data-dropdown-toggle="dropdownSearch"
        data-dropdown-placement="bottom"
        className={cn(
          "relative inline-flex w-full items-center rounded-md border border-slate-300 bg-white py-8 pr-12 text-center font-medium text-slate-600 focus-within:border-primary-500 focus:outline-none focus:ring-0 dark:focus-within:border-primary-600",
          fontSize,
          leftIcon.length > 0 ? "pl-36" : "pl-12",
          {
            "bg-slate-300 opacity-50 hover:cursor-not-allowed": isDisabled,
            "h-36": size == "sm",
            "h-44": size == "md",
            "h-52": size == "lg",
          },
          selectedIndex !== null && selectedIndex < 0 && "text-slate-400",
          className
        )}
        type="button"
      >
        {(leftIcon.length > 0 || (ddItems[0]?.icon && selectedIndex)) && (
          <Icon
            iconName={
              ddItems[0]?.icon && selectedIndex
                ? ddItems[selectedIndex].icon
                : leftIcon
            }
            className={cn("absolute left-8 ml-2", {
              "hover:cursor-not-allowed": isDisabled,
            })}
            iconColor={twcolors.slate[500]}
          />
        )}
        {getSelectedItemName(selectedIndex)}
        <Icon
          iconName="chevron-down"
          className={cn(
            "absolute right-10 ml-2 translate-y-full self-center hover:pointer-events-none",
            {
              "hover:cursor-not-allowed": isDisabled,
              "-top-12": size == "sm",
              "-top-7": size == "md",
              "-top-2": size == "lg",
            }
          )}
        />
      </button>
      <div
        id="ddFilter"
        className={cn(
          "absolute z-20 mt-4 w-full rounded bg-white shadow dark:bg-slate-700",
          isOpen ? "" : "hidden"
        )}
      >
        {isFilterable == true && (
          <div className="relative p-8">
            <TextField
              shouldFocus={true}
              label={""}
              value={filterText}
              leftIconName="search-md"
              fieldHeight="sm"
              className="placeholder-slate-500"
              iconColor={twcolors.slate[500]}
              placeholder={filterPlaceholder}
              onChange={(e) => {
                // console.log(e.data);
                // setFilterText(e.data);
                if (typeof e.data == "string") {
                  setFilterText(e.data);
                  if (e.data.length > 0) {
                    const searchTerm = e.data.toLowerCase();
                    //Filter items with the text on the attribute name

                    const filteredItems = items.map((item) => {
                      console.log(item);
                      // item.isHidden = false;
                      if (item.name.toLowerCase().includes(searchTerm)) {
                        item.isHidden = false;
                      } else {
                        item.isHidden = true;
                      }
                      return item;
                    });

                    setDdItems(filteredItems);
                  } else {
                    const allItems = items.map((item) => {
                      item.isHidden = false;
                      return item;
                    });
                    setDdItems(allItems);
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
                iconColor={twcolors.slate[500]}
                clicked={() => {
                  console.log("Items here!");
                  setFilterText("");
                  const allItems = items.map((item) => {
                    item.isHidden = false;
                    return item;
                  });
                  setDdItems(allItems);
                }}
              />
            </span>
          </div>
        )}

        <ul
          className={cn(
            "max-h-200 overflow-y-auto px-8 pb-8 text-slate-700 dark:text-slate-200",
            fontSize,
            { "pt-8": !isFilterable }
            // !isFilterable && "pt-8"
          )}
          aria-labelledby="dropdownSearchButton"
        >
          {/* If not items are found */}
          {ddItems.length === 0 && (
            <li className="py-4 transition hover:cursor-pointer">
              <div className="flex items-center rounded pl-4 hover:cursor-pointer">
                <Label
                  text={noItemsFoundText}
                  className="ml-12 pt-4 font-medium hover:cursor-default"
                  size={fontSize}
                  fontWeight={fontWeight}
                />
              </div>
            </li>
          )}
          {ddItems.map((item, i) => (
            <li
              key={i}
              onClick={(e) => {
                console.log("Open/Close DD");
                console.log(item.id);
                console.log("All the items are printed below");
                console.log(items);
                const itemIndex = items
                  .map((val, index) => {
                    if (val.id == item.id) {
                      return index;
                    }
                  })
                  .filter((val) => {
                    return val != null && val != undefined;
                  });

                const value = itemIndex[0];

                if (value) {
                  console.log(`SETTING UP VALUE: ${value}}`);
                  setSelectedIndex(value);
                }
                handleOnChange(value);
              }}
              className={`rounded py-4 transition hover:cursor-pointer ${
                selectedIndex === i
                  ? "bg-primary-500"
                  : "hover:bg-slate-100 dark:hover:bg-slate-600"
              } ${item.isHidden ? "hidden" : ""}`}
            >
              <div className="flex items-center rounded pl-4 hover:cursor-pointer">
                {item.icon && (
                  <Icon
                    iconName={item.icon}
                    className="ml-8 hover:stroke-current"
                    iconColor={
                      selectedIndex === i ? "#fff" : twcolors.slate[500]
                    }
                  />
                )}
                <Label
                  text={item.name}
                  className={cn(
                    "ml-8 pt-4 font-medium text-slate-700 hover:cursor-pointer",
                    {
                      " !text-white": selectedIndex === i,
                    }
                  )}
                  size={fontSize}
                  fontWeight={fontWeight}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
      {errorText.length > 0 && <ErrorText text={errorText} />}
    </div>
  );
});

export default DropDownSingle;
