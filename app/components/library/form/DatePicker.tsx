"use client";

/**
 * *Component dependency packages
 */
import Label from "@components/library/form/Label";
import Icon, { IconProps } from "@components/library/Icon";
import { memo } from "react";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { cn } from "tailwind-cn";

/**
 * *Interface definition for the component
 */

export interface DateFieldProps {
  showCalendarIcon?: boolean;
  showClearIcon?: boolean;
  calendarIcon?: IconProps["iconName"]; //calendar icon
  label?: string; //calendar icon
  isRequired?: boolean;
  className?: string | string[];
  clearIcon?: IconProps["iconName"]; //clear button
  clockClassName?: string | string[]; //gets the classname(s) for the clock
  calendarClassName?: string | string[]; //gets the classname(s) for the clock
  disabled?: boolean; //disable the entire datetime picker
  disableCalendar?: boolean; //disable the visual calendar picker
  disableClock?: boolean; //disable the clock visual
  format?: string; //format for the clock in string
  language?: string; //define language here
  maxTimeDetail?: "hour" | "minute" | "second"; //max time detail
  onCalendarClose?: () => void; //onCalendarClose
  onCalendarOpen?: () => void; //onCalendarOpen
  onChange?: (value: Date) => void; //onChange
  onClockClose?: () => void; //onClockClose
  onClockOpen?: () => void; //onClockOpen
  value?: Date | [Date, Date] | undefined; //Date value
  maxDate?: Date; //Maximum date value that the picker is selectable
  minDate?: Date; //Minimum date value that the picker is selectable
  size?: "sm" | "md" | "lg"; // size of the date picker
  wrapperClassName?: string; // wrapper class name
}

/**
 * Datepicker Component
 *
 * @description
 * Company - ARITS Ltd. 3rd Jan 2023.
 * This component is used to render the datetimepicker in the app.
 * Component DateTimePicker Documentation URL { https://github.com/wojtekmaj/react-datetime-picker }
 * @param {JSX.Element} calendarIcon Calendar right icon
 * @param {JSX.Element} clearIcon Calendar right icon
 * @param { string | string[] } className gets the classname(s)
 * @param {string | string[]} calendarClassName gets the classname(s) for the calendar
 * @param {string | string[]} clockClassName gets the classname(s) for the clock
 * @param {string} label Date picker label
 * @param {boolean} disabled Disable the clock and the calendar
 * @param {boolean} disableCalendar Disable the visual calendar
 * @param {boolean} disableClock Disable the visual clock
 * @param {string} format Format for the calendar and the clock e.g: "y-MM-dd h:mm:ss a"
 * @param {string} language Format for the calendar and the clock
 * @param {string} maxTimeDetail max time detail - value: 'hour' | 'minute' | 'second'
 * @param {void} onCalendarClose This function triggers when the calendar is closed
 * @param {void} onCalendarOpen This function triggers when the calendar is open
 * @param {void} onChange This function triggers when the calendar selected value is changed
 * @param {void} onClockClose This function triggers when the clock is closed
 * @param {void} onClockOpen This function triggers when the clock is open
 * @param {void} maxDate Maximum date that the user can select.
 * @param {void} minDate Min date that the user can select.
 * @param {string} size Size of the date picker
 * @param {string} wrapperClassName Wrapper classname
 */

const DatePicker = memo(function InputField({
  isRequired = false,
  showCalendarIcon = false,
  showClearIcon = false,
  calendarIcon = "calendar-check-01",
  className,
  label = "Pick a Date",
  clearIcon = "x",
  clockClassName = "",
  calendarClassName = "",
  disabled = false,
  disableCalendar = false,
  disableClock = false,
  format = "",
  language = "en-US",
  maxTimeDetail = "second",
  maxDate,
  minDate,
  size = "md",
  wrapperClassName,
  onCalendarClose,
  onCalendarOpen,
  onChange,
  onClockClose,
  onClockOpen,
  value = undefined,
}: DateFieldProps) {
  return (
    // <div className="group relative mb-24 flex w-full flex-col items-start justify-start">
    <div className={cn("flex flex-col", wrapperClassName)}>
      {label && (
        <Label text={label} size="text-sm" isRequired={isRequired}></Label>
      )}
      <DateTimePicker
        calendarIcon={
          showCalendarIcon ?? <Icon iconName={calendarIcon} iconSize="16" />
        }
        clearIcon={showClearIcon ?? <Icon iconName={clearIcon} iconSize="16" />}
        className={cn(
          "rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
          size == "sm" && "h-36",
          size == "md" && "h-44",
          size == "lg" && "h-52",
          className
        )}
        clockClassName={clockClassName}
        calendarClassName={calendarClassName}
        value={value}
        locale={language}
        disabled={disabled}
        disableClock={disableClock}
        format={format ? format : "MMMM, dd, yyyy"}
        disableCalendar={disableCalendar}
        returnValue={"start"}
        maxDetail={maxTimeDetail}
        maxDate={maxDate}
        minDate={minDate}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onChange={onChange}
        onCalendarClose={onCalendarClose}
        onCalendarOpen={onCalendarOpen}
        onClockClose={onClockClose}
        onClockOpen={onClockOpen}
      />
    </div>
  );
});

export default DatePicker;
