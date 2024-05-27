// https://react-day-picker.js.org/
// https://date-fns.org/docs/Getting-Started

import variables from "@variables/variables.module.scss";
import { compareAsc, compareDesc, format, isToday } from "date-fns";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { DayPicker, SelectSingleEventHandler } from "react-day-picker";
// import FocusTrap from "focus-trap-react"
import { usePopper } from "react-popper";
import twcolors from "tailwindcss/colors";
import "react-day-picker/dist/style.css";
import { cn } from "tailwind-cn";
import TextField from "../TextField";
import { DatePickerParams, DaysOfWeek } from "./DatePickerProps";

export interface SingleDatePickerProps extends DatePickerParams {
  /**
   * @description Currently selected date as a Date object
   */
  value?: Date;
  /**
   * @description Callback function that is called when a date is selected
   */
  onChange?: (
    /**
     * @param date - Selected date in ISO format or undefined if date is cleared
     */
    date: string | null
  ) => void;
}

/**
 * @description SingleDatePicker is a component that allows users to select a single date from a calendar.
 * @copyright ARITS Limited
 * - Courtesy: \@emranffl
 */

const SingleDatePicker = ({
  dateField,
  className,
  placement = "bottom-end",
  showWeekCount,
  footerCaption,
  value,
  fromDate = new Date(1899, 0, 1), // 1899-01-01
  toDate = new Date(2099, 11, 31), // 2099-12-31
  disabledDates = [],
  bookedDates = [],
  outOfBoundsDatesVisibility = false,
  weekStartsOn,
  dateReturnFormat = "yyyy-MM-dd",
  onChange,
  onBlur,
}: SingleDatePickerProps) => {
  const mergedDateField: SingleDatePickerProps["dateField"] = {
    rightIconName: "calendar-date",
    className: "cursor-pointer",
    shellClassName: "z-0",
    placeholder: "Select date",
    isReadOnly: true,
    isDisabled: false,
    isRequired: false,
    displayDateFormat: "MMMM d, yyyy",
    ...dateField,
  };

  const [selectedDate, updateSelectedDate] = useState<Date | undefined>(
    undefined
  );
  const FORMATTED_DISPLAY_DATE = selectedDate
    ? format(selectedDate, mergedDateField?.displayDateFormat ?? "dd-MM-y")
    : undefined;
  const [isPopperOpen, setIsPopperOpen] = useState(false);

  const popperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );

  const popper = usePopper(popperRef.current, popperElement, {
    placement,
  });

  const closePopper = () => {
    setIsPopperOpen(false);
    buttonRef?.current?.focus();
  };

  // const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
  // const date = parse(e.currentTarget.value, "y-MM-dd", new Date())
  // if (isValid(date)) {
  //   updateSelectedDate(date)
  // } else {
  //   updateSelectedDate(undefined)
  // }
  // }

  const handleClick = () => {
    setIsPopperOpen((prev) => !prev);
    if (popperRef.current) {
      popperRef.current.focus();
    }
  };

  const handleDateSelect: SelectSingleEventHandler = useCallback(
    (date) => {
      if (date) {
        updateSelectedDate(date);
        closePopper();
      }
      onChange?.(date ? format(date, dateReturnFormat) : null);
    },
    [dateReturnFormat, onChange]
  );

  // useEffect(() => {
  //   document.addEventListener("click", (e) => {
  //     if (!popperRef.current?.contains(e.target as Node)) {
  //       return
  //     }
  //     setIsPopperOpen(false)
  //   })

  //   return () => {
  //     document.removeEventListener("click", () => {})
  //   }
  // }, [])

  // + set value to selected date
  useEffect(() => {
    updateSelectedDate(value);
  }, [value]);

  const css = `
    .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
      background-color: ${variables.gray200};
    }
    .rdp-day_selected {
      background-color: ${variables.primary500};
    }
    .rdp-day_today {
      color: ${variables.primary600};
      text-decoration: underline;
      text-underline-offset: 4px;
    }
    .rdp-day_selected.rdp-day_today {
      color: white;
      text-decoration: none;
    }
    .rdp-day_selected:hover {
      color: white;
      text-decoration: none;
      background-color: ${variables.primary500};
    }
    .rdp-button:focus-visible:not([disabled]) {
      border-color: ${variables.primary200};
    }
  `;
  const styles = {
    button: {
      height: "2.2rem",
      width: "2.2rem",
      margin: "0.075rem",
    },
    caption_label: {
      color: twcolors.slate[700],
      fontSize: "1rem",
      fontWeight: 600,
    },
    caption: {
      display: "flex",
    },
    caption_dropdowns: {
      marginInline: "auto",
    },
    caption_start: {
      fontSize: "0.95rem",
    },
    caption_between: {
      fontSize: "0.95rem",
    },
    caption_end: {
      fontSize: "0.95rem",
    },
    head_row: {
      color: twcolors.slate[500],
    },
    dropdown_icon: {
      color: twcolors.slate[400],
    },
    nav_button_next: {
      color: twcolors.slate[400],
      transform: "scale(0.8)",
    },
    nav_button_previous: {
      color: twcolors.slate[400],
      transform: "scale(0.8)",
    },
    weeknumber: {
      color: twcolors.slate[500],
      fontWeight: 600,
      height: "2rem",
      width: "2rem",
      marginRight: "0.5rem",
    },
    with_weeknumber: {
      color: twcolors.slate[500],
      fontWeight: 600,
      height: "2.5rem",
      width: "2.5rem",
      marginRight: "0.5rem",
    },
  };
  const bookedStyles = {
    border: `1px dashed ${variables.primary700}`,
  };
  const Footer = (
    <div className="flex gap-8 pt-5">
      {typeof footerCaption === "string" ? (
        FORMATTED_DISPLAY_DATE ? (
          <p className="text-xs text-slate-500">
            Currently {FORMATTED_DISPLAY_DATE} is selected
          </p>
        ) : (
          <p className="text-xs text-slate-500">{footerCaption}</p>
        )
      ) : (
        footerCaption
      )}
      <div className="mb-auto ml-auto flex max-w-min gap-8">
        {/* // * display today button if date is between range */}
        {compareDesc(fromDate, new Date()) === 1 &&
          compareAsc(toDate, new Date()) === 1 &&
          !disabledDates.some((date) => isToday(date)) && (
            <button
              className="text-[0.8rem] text-primary-600"
              onClick={(e) => {
                handleDateSelect(new Date(), new Date(), {}, e);
              }}
            >
              Today
            </button>
          )}
        <button
          className="text-[0.8rem] text-slate-600"
          onClick={(e) => {
            handleDateSelect(undefined, new Date(), {}, e);
            updateSelectedDate(undefined);
            closePopper();
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div ref={popperRef}>
        <TextField
          {...mergedDateField}
          isRightIconClickable
          type="text"
          value={FORMATTED_DISPLAY_DATE}
          isDisabled={isPopperOpen ?? mergedDateField.isDisabled}
          onClick={handleClick}
          onRightIconClick={handleClick}
          // onChange={(_, e) => handleInputChange(e)}
          onBlur={onBlur}
        />
      </div>

      {isPopperOpen && (
        // <FocusTrap
        //   active
        //   focusTrapOptions={{
        //     initialFocus: popperRef.current ?? undefined,
        //     // allowOutsideClick: true,
        //     // clickOutsideDeactivates: true,
        //     onDeactivate: closePopper,
        //     // fallbackFocus: buttonRef.current ?? undefined,
        //   }}
        // >
        <div
          tabIndex={-1}
          style={{ ...popper.styles.popper, zIndex: 1 }}
          {...popper.attributes.popper}
          ref={(node) => {
            setPopperElement(node);
            if (node) {
              node.focus();
            }
          }}
          role="dialog"
          aria-label="Calendar"
        >
          <style>{css}</style>
          <DayPicker
            mode="single"
            styles={styles}
            className={cn(
              "animate-fade animate-duration-300 rounded-md border bg-white p-8 shadow",
              placement === "top-start" && "absolute -bottom-8 -left-14",
              placement === "top-end" && "absolute -bottom-8 -right-14",
              placement === "bottom-start" && "absolute -left-14 -top-10",
              placement === "bottom-end" && "absolute -right-14 -top-10",
              // * auto placements are displayed dynamically based on over-the-fold (screen view) position
              // => classes for rest of the remaining placements to be added
              className
            )}
            captionLayout="dropdown-buttons"
            initialFocus={isPopperOpen}
            defaultMonth={selectedDate}
            selected={selectedDate}
            onSelect={handleDateSelect}
            showWeekNumber={showWeekCount}
            formatters={{
              formatWeekNumber: (weekNumber) => `W${weekNumber}`,
            }}
            required={mergedDateField.isRequired}
            footer={Footer}
            fromDate={fromDate}
            toDate={toDate}
            disabled={
              disabledDates && bookedDates
                ? [...disabledDates, ...bookedDates]
                : disabledDates ?? bookedDates
            }
            modifiers={{
              booked: bookedDates,
            }}
            modifiersStyles={{
              booked: bookedStyles,
            }}
            showOutsideDays={outOfBoundsDatesVisibility}
            weekStartsOn={weekStartsOn ? DaysOfWeek[weekStartsOn] : undefined}
          />
        </div>
        // </FocusTrap>
      )}
    </>
  );
};

export default memo(SingleDatePicker);
