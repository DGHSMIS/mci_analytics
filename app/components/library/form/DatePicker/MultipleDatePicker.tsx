// https://react-day-picker.js.org/
// https://date-fns.org/docs/Getting-Started

import { format } from "date-fns";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
// import FocusTrap from "focus-trap-react"
import variables from "@variables/variables.module.scss";
import { usePopper } from "react-popper";
import twcolors from "tailwindcss/colors";

import "react-day-picker/dist/style.css";
import { cn } from "tailwind-cn";
import TextField from "../TextField";
import { DatePickerParams, DaysOfWeek } from "./DatePickerProps";

export interface MultipleDatePickerProps extends DatePickerParams {
  /**
   * @description the mode of the date picker
   */
  mode?: "range" | "multiple",
  /**
   * @description the string text between two dates in range mode
   */
  dateBetweenConnector?: string;
  /**
   * @description Currently selected date as a Date object
   */
  value?: Date[]
  /**
   * @description Minimum number of dates that should be selected
   */
  min?: number
  /**
   * @description Maximum number of dates that can be selected
   */
  max?: number
  /**
   * @description Callback function that is called when a date is selected
   */
  onChange?: (
    /**
     * @param date - Selected date in ISO format or undefined if date is cleared
     */
    date: string[] | null
  ) => void
}

/**
 * @description MultipleDatePicker is a component that allows users to select a single date from a calendar.
 * @copyright ARITS Limited
 * - Courtesy: \@emranffl
 */

const MultipleDatePicker = ({
                              mode = "multiple",
                              dateBetweenConnector = "to",
                              dateField,
                              className,
                              placement = "bottom-end",
                              showWeekCount,
                              footerCaption = "Select multiple dates",
                              value,
                              fromDate = new Date(1899, 0, 1), // 1899-01-01
                              toDate = new Date(2099, 11, 31), // 2099-12-31
                              disabledDates = [],
                              bookedDates = [],
                              outOfBoundsDatesVisibility = false,
                              weekStartsOn,
                              dateReturnFormat = "yyyy-MM-dd",
                              showResetButton = true,
                              min,
                              max,
                              onChange,
                              onBlur,
                            }: MultipleDatePickerProps) => {
  const mergedDateField: MultipleDatePickerProps["dateField"] = {
    rightIconName: "calendar-date",
    className: "cursor-pointer",
    shellClassName: "z-0",
    placeholder: "Select dates",
    isReadOnly: true,
    isDisabled: false,
    isRequired: false,
    displayDateFormat: "dd MMM, yy",
    ...dateField,
  }

  const [selectedDates, updateSelectedDates] = useState<Date[] | undefined>(undefined)
  const FORMATTED_DISPLAY_DATES = selectedDates
    ? selectedDates.map((date) => format(date, mergedDateField.displayDateFormat ?? "dd-MM-y")).join(" " +dateBetweenConnector+" ")
    : undefined
  const [isPopperOpen, setIsPopperOpen] = useState(false)
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)

  const popperRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const calendarContainerRef = useRef<HTMLDivElement | null>(null)




  const popper = usePopper(popperRef.current, popperElement, {
    placement,
  })

  const closePopper = () => {
    setIsPopperOpen(false)
    buttonRef?.current?.focus()
  }

  // const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
  // const date = parse(e.currentTarget.value, "y-MM-dd", new Date())
  // if (isValid(date)) {
  //   updateSelectedDate(date)
  // } else {
  //   updateSelectedDate(undefined)
  // }
  // }

  const handleClick = () => {
    setIsPopperOpen((prev) => !prev)
    if (popperRef.current) {
      popperRef.current.focus()
    }
  }

  const handleDateSelect: any = useCallback(
    (dates:any) => {
      updateSelectedDates(dates)
      // closePopper()

      // * if dates are valid, then return dates in dateReturnFormat
      if (dates) {
        onChange?.(dates.map((date:any) => format(date, dateReturnFormat)))
        return
      }

      // * if date is undefined, then return null
      onChange?.(null)
    },
    [dateReturnFormat, onChange]
  )

  const handleCalendarRef = (node: HTMLDivElement | null) => {
    calendarContainerRef.current = node
  }

  const handleClickOutside = (event: any) => {
    if (calendarContainerRef.current && !calendarContainerRef.current.contains(event.target)) {
      setIsPopperOpen(false)
    }
  }

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
  `
  const styles = {
    button: {
      height: "2.2rem",
      width: "2.2rem",
      margin: "0.075rem",
    },
    caption_label: { color: twcolors.slate[700], fontSize: "1rem", fontWeight: 600 },
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
  }
  const bookedStyles = {
    border: `1px dashed ${variables.primary700}`,
  }
  const doneButtonVisibility =
    selectedDates && min && max
      ? selectedDates.length >= min && selectedDates.length <= max
      : selectedDates && min
        ? selectedDates.length >= min
        : selectedDates && max
          ? selectedDates.length <= max
          : selectedDates
            ? selectedDates.length >= 1
            : false
  const Footer = (
    <div className="flex gap-8 pt-5">
      {/* // + left col */}
      {typeof footerCaption === "string" ? (
        selectedDates && selectedDates.length == 1 ? (
          <p className="text-xs text-slate-500">Currently {FORMATTED_DISPLAY_DATES} is selected</p>
        ) : selectedDates && selectedDates.length > 1 ? (
          <p className="text-xs text-slate-500">{selectedDates.length} dates selected</p>
        ) : (
          <p className="text-xs text-slate-500">{footerCaption}</p>
        )
      ) : (
        footerCaption
      )}
      {/* // + right col */}
      <div className="-mt-2 mb-auto ml-auto flex max-w-min gap-8">
        {doneButtonVisibility && (
          <button
            className="text-[0.8rem] text-primary-600"
            onClick={(e) => {
              closePopper()
            }}
          >
            Done
          </button>
        )}
        {selectedDates && showResetButton && selectedDates.length > 1 && (
          <button
            className="text-[0.8rem] text-slate-600"
            onClick={(e) => {
              updateSelectedDates(undefined)
              closePopper()
              onChange?.(null)
            }}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  )

  const [selectedDateRange, setSelectedDateRange] = useState<DateRange >();
  const [selectedFromRange, updateSelectedFromRange] = useState<string>('')
  const [selectedToRange, updateSelectedToRange] = useState<string>('')
  const handleRangeSelect: any = (
    range: DateRange | undefined
  ) => {
    setSelectedDateRange(range);
    let dates:Date[] = [];
    if(range?.from){
      updateSelectedFromRange(format(range.from, dateReturnFormat));
    }
    if(range?.to){
      updateSelectedToRange(format(range.to, dateReturnFormat));
    }
  };

  useEffect(() => {
    if(onChange){
      onChange([selectedFromRange, selectedToRange])
    }
  }, [selectedFromRange, selectedToRange]);

  // + close date selector on outside click
  useEffect(() => {
    if (isPopperOpen) {
      document.addEventListener("click", handleClickOutside)
    }
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [isPopperOpen])

  // + set value to selected date
  useEffect(() => {

    if(mode === "range") {
      if (value) {
        let range:DateRange = {
          from: value.length > 0 ? value[0] : undefined,
          to: value.length > 1 ? value[1] : undefined,
        };
        setSelectedDateRange(range);
        let dates:Date[] = [];
        if(range.from){
          dates.push(range.from);
        }
        if(range.to){
          dates.push(range.to);
        }
        updateSelectedDates(dates);
      }
    }
    else{
      updateSelectedDates(value)
    }
  }, [value])

  const getSelectedDateRange = ():any => {
    return mode === "range" ? selectedDateRange : selectedDates
  }

  // @ts-ignore
  return (
    <>
      <div ref={popperRef}>
        <TextField
          {...mergedDateField}
          isRightIconClickable
          type="text"
          value={FORMATTED_DISPLAY_DATES}
          isDisabled={isPopperOpen ?? mergedDateField.isDisabled}
          onClick={handleClick}
          onRightIconClick={handleClick}
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
            setPopperElement(node)
            handleCalendarRef(node)
            if (node) {
              node.focus()
            }
          }}
          role="dialog"
          aria-label="Calendar"
        >
          <style>{css}</style>
          <DayPicker
            mode='range'
            styles={styles}
            className={cn(
              "animate-fade rounded-md border bg-white p-8 shadow animate-duration-300",
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
            selected={getSelectedDateRange()}
            onSelect={mode === "range" ? handleRangeSelect : handleDateSelect}
            showWeekNumber={showWeekCount}
            formatters={{
              formatWeekNumber: (weekNumber) => `W${weekNumber}`,
            }}
            footer={Footer}
            fromDate={fromDate}
            toDate={toDate}
            disabled={
              disabledDates && bookedDates ? [...disabledDates, ...bookedDates] : disabledDates ?? bookedDates
            }
            modifiers={{
              booked: bookedDates,
            }}
            modifiersStyles={{
              booked: bookedStyles,
            }}
            showOutsideDays={outOfBoundsDatesVisibility}
            weekStartsOn={weekStartsOn ? DaysOfWeek[weekStartsOn] : undefined}
            min={mode == "range" ? min ?? 2 : min}
            max={mode == "range" ? max ?? Infinity : max}
          />
        </div>
        // </FocusTrap>
      )}
    </>
  )
}

export default memo(MultipleDatePicker)
