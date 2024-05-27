import { TextFieldProps } from "../TextField";
import PopperJS from "@popperjs/core";

export const DATE_FORMATS = [
  /**
   * @example 12/09/2099
   */
  "MM/dd/yyyy",
  /**
   * @example 09/12/2099
   */
  "dd/MM/yyyy",
  /**
   * @example 2099-12-09
   */
  "yyyy-MM-dd",
  /**
   * @example December 9, 2099
   */
  "MMMM d, yyyy",
  /**
   * @example Dec 9, 2099
   */
  "MMM d, yyyy",
  /**
   * @example 12-09-99
   */
  "MM-dd-yy",
  /**
   * @example 9-12-2099
   */
  "d-M-yyyy",
  /**
   * @example December 09, 2099
   */
  "MMMM dd, yyyy",
  /**
   * @example Dec 09, 2099
   */
  "MMM dd, yyyy",
  /**
   * @example 09 December 2099
   */
  "dd MMMM yyyy",
  /**
   * @example 9 December 2099
   */
  "d MMMM yyyy",
  /**
   * @example 2099/12/09
   */
  "yyyy/MM/dd",
  /**
   * @example 09-Dec-2099
   */
  "dd-MMM-yyyy",
  /**
   * @example Dec 9
   */
  "MMM d",
  /**
   * @example December 9
   */
  "MMMM d",
  /**
   * @example 9 December
   */
  "d MMMM",
  /**
   * @example December 09
   */
  "MMMM dd",
  /**
   * @example Dec 09
   */
  "MMM dd",
  /**
   * @example 09 December
   */
  "dd MMMM",
  /**
   * @example 09 Dec
   */
  "dd MMM",
  /**
   * @example Dec 09, 99
   */
  "MMM dd, yy",
  /**
   * @example December 9, 99
   */
  "MMMM d, yy",
  /**
   * @example 9 Dec, 99
   */
  "d MMM, yy",
  /**
   * @example 09 Dec, 99
   */
  "dd MMM, yy",
  /**
   * @example 9 December, 99
   */
  "d MMMM, yy",
  /**
   * @example 09 December, 99
   */
  "dd MMMM, yy",
  /**
   * @example 99/12/09
   */
  "yy/MM/dd",
  /**
   * @example 99-12-09
   */
  "yy-MM-dd",
] as const

export enum DaysOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export enum MonthsOfYear {
  January = 0,
  February = 1,
  March = 2,
  April = 3,
  May = 4,
  June = 5,
  July = 6,
  August = 7,
  September = 8,
  October = 9,
  November = 10,
  December = 11,
}

export interface DatePickerParams {
  /**
   * @description Props for the date field
   */
  dateField?: Pick<
    TextFieldProps,
    | "className"
    | "id"
    | "label"
    | "labelClassName"
    | "placeholder"
    | "rightIconName"
    | "isReadOnly"
    | "isDisabled"
    | "isRequired"
    | "fieldHeight"
    | "errorText"
    | "iconColor"
    | "iconStrokeWidth"
    | "iconSize"
    | "showErrorIcon"
    | "errorIconColor"
    | "errorIconName"
    | "shellClassName"
    | "leftIconName"
    | "name"
    | "hintText"
  > & {
    /**
     * @description Date format to be displayed in the date field
     * @default "MMMM d, yyyy"
     */
    displayDateFormat?: (typeof DATE_FORMATS)[number] | (string & {})
  }
  /**
   * @description Class names for the calendar flyout
   */
  className?: string
  /**
   * @description Placement of the calendar
   * @default "bottom-end"
   */
  placement?: Extract<
    PopperJS.Options["placement"],
    "auto" | "auto-start" | "auto-end" | "top-start" | "top-end" | "bottom-start" | "bottom-end"
  >
  /**
   * @description Whether to show week count in the calendar
   * @default false
   */
  showWeekCount?: boolean
  /**
   * @description Caption to be displayed in the footer
   */
  footerCaption?: string | React.ReactNode | null
  /**
   * @description Minimum date that can be selected
   * @default 1899-01-01
   */
  fromDate?: Date
  /**
   * @description Maximum date that can be selected
   * @default 2099-12-31
   */
  toDate?: Date
  /**
   * @description Array of dates that are disabled
   */
  disabledDates?: Date[]
  /**
   * @description Array of dates that are booked
   */
  bookedDates?: Date[]
  /**
   * @description Whether to show dates outside the current month
   */
  outOfBoundsDatesVisibility?: boolean
  /**
   * @description What day the week starts on
   */
  weekStartsOn?: keyof typeof DaysOfWeek
  /**
   * @description Return date format in provided format
   * @default "yyyy-MM-dd"
   */
  dateReturnFormat?: (typeof DATE_FORMATS)[number] | (string & {})
  /**
   * @description Whether to show the reset button
   * @default true
   */
  showResetButton?: boolean
  /**
   * @description Callback function that is called when the date field is blurred
   */
  onBlur?: TextFieldProps["onBlur"]
}
