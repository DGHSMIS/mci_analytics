import { divisionCodes } from "@utils/constantsInMemory";
import {
  DateRangeFormInterface,
  DateRangeWithFacilityFormInterface,
  ParsedFormDateAndDivisionInterface,
  ParsedFormDateAndFacilityInterface,
  ValidateDateAndDivisionResponseInterface,
  ValidateDateAndFacilityResponseInterface,
} from "@utils/interfaces/DataModels/ApiRequestQueryParamInterfaces";
import { isValidDateTimeString } from "@utils/utilityFunctions";
import { differenceInDays, differenceInMonths, parseISO } from "date-fns";
import { NextRequest } from "next/server";

/**
 * @description This function will validate the field type for the Text input element to check
 * 1. length of the input,
 * 2. If it is required or not
 * 3. Min and max length of the input
 * 4. If the input is an email address, we will use email address validation logic
 * @param {string} value - The value of the input field
 * @param {boolean} required - If the field is required or not
 * @param {number} minLength - The minimum length of the input field (Will contain default length if not passed)
 * @param {number} maxLength - The maximum length of the input field (Will contain default length if not passed)
 * @param {boolean} isEmail - If the field is an email field or not
 * @returns {object} - If the validation is successful, it will return an object with status as true and message as empty string
 * @returns {object} - If the validation is not successful, it will return an object with status as false and message as the error message
 */
export interface TextInputFieldInterface {
  value: string;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  isEmail: boolean;
}
export const validateTextInputField = ({
  value = "",
  required = true,
  minLength = 2,
  maxLength = 100,
  isEmail,
}: TextInputFieldInterface) => {
  if (required && value?.trim().length === 0 && !isEmail) {
    return { message: "This field is required" };
  }
  if (value?.trim().length < minLength && !isEmail) {
    return {
      status: false,
      message: `This field should be at least ${minLength} characters`,
    };
  }
  if (value?.trim().length > maxLength && !isEmail) {
    return {
      status: false,
      message: `This field should be at most ${maxLength} characters`,
    };
  }
  if (isEmail && (!value?.includes("@") || !value?.includes("."))) {
    return { status: false, message: "Please enter a valid email address" };
  }
  if (isEmail) {
    //check email address using regular expression
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(value)) {
      return { message: "Please enter a valid email address" };
    }
  }
  return { status: true };
};

/**
 * @description This function will validate the field type for the Password input element to check
 * 1. Minimum length of the password field
 * 2. Maximum length of the password field
 * 3. If an uppercase letter is present in the password field
 * 4. If a lowercase letter is present in the password field
 * 5. If a number is present in the password field
 * 6. If a special character is present in the password field (We will use a regex to check this)
 * 7. We will use a regular expression to validate the password field
 * @param {object} - Object containing the value of the password field, maximum length of the password field and minimum length of the password field
 * @returns {object} - If the validation is successful, it will return an object with status as true and message as empty string
 * @returns {object} - If the validation is not successful, it will return an object with status as false and message as the error message
 */
export interface PasswordFieldInterface {
  value: string;
  maxLength?: number;
  minLength?: number;
  isSimplePassword?: boolean;
}
export const validatePasswordField = ({
  value,
  maxLength = 20,
  minLength = 6,
  isSimplePassword = true,
}: PasswordFieldInterface) => {
  if (isSimplePassword) {
    const isValid = value.length >= minLength && value.length <= maxLength;
    if (!isValid) {
      return {
        status: false,
        message: `This field should be between ${minLength} and ${maxLength} characters`,
      };
    }
    return { status: true };
  } else {
    if (
      !value?.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{minLength,maxLength}$/
      )
    ) {
      if (value?.trim().length < minLength) {
        return {
          status: false,
          message: `This field should be at least ${minLength} characters`,
        };
      }
      if (value?.trim().length > maxLength) {
        return {
          status: false,
          message: `This field should be at most ${maxLength} characters`,
        };
      }
      if (!value?.match(/[a-z]/g)) {
        return {
          status: false,
          message: "This field should contain at least one lowercase letter",
        };
      }
      if (!value?.match(/[A-Z]/g)) {
        return {
          status: false,
          message: "This field should contain at least one uppercase letter",
        };
      }
      if (!value?.match(/[0-9]/g)) {
        return {
          status: false,
          message: "This field should contain at least one number",
        };
      }
      if (!value?.match(/[^a-zA-Z\d]/g)) {
        return {
          status: false,
          message: "This field should contain at least one special character",
        };
      }
      // return { status: false, message: "Please enter a valid password" };
    }

    return { status: true };
  }
};

/**
 * @description This function will validate the field type for the Number input element to check
 * 1. If the input is a number or not
 * 2  If the input is required or not
 * 3. If the input must be a positive number or not
 * 4. If the input is a decimal number or not
 * 5. Via a input object, a validation logic will be sent to this function for confirmation
 * @param {object} value - Object containing the value of the number field, if the number field is required or not, if the number field is a positive number or not, if the number field is a negative number or not, if the number field is a decimal number or not and a validation logic
 *
 * @returns {object} - If the validation is successful, it will return an object with status as true and message as empty string
 * @returns {object} - If the validation is not successful, it will return an object with status as false and message as the error message
 */
export interface NumberFieldInterface {
  value: string;
  required: boolean;
  shouldBePositive: boolean;
  canBeDecimal: boolean;
  validationLogic?: (value: string) => { status: boolean; message: string };
}

export const validateNumberField = ({
  value,
  required,
  shouldBePositive,
  canBeDecimal,
  validationLogic,
}: NumberFieldInterface) => {
  if (required && value?.trim().length === 0) {
    return { status: false, message: "This field is required" };
  }
  if (validationLogic) {
    return validationLogic(value);
  }
  if (shouldBePositive && Number(value) < 0) {
    return { status: false, message: "This field should be a positive number" };
  }
  if (!canBeDecimal && value?.includes(".")) {
    return { status: false, message: "This field should be an integer" };
  }
  if (isNaN(Number(value))) {
    return { status: false, message: "This field should be a number" };
  }
  return { status: true };
};

/**
 *
 * @description This function will validate the field type for the Dropdown input element to check
 * 1. If the input is required or not
 * 2. If the input is a valid option or not
 * 3. If multiple fields are allowed or not
 * @param {Array[]}
 *      selectedItems - Array of objects containing the options for the dropdown field
 *      required - Boolean value to check if the dropdown field is required or not
 *      allowMultiple - Boolean value to check if multiple options can be selected or not
 *
 * @returns {object} - If the validation is successful, it will return an object with status as true and message as empty string
 * @returns {object} - If the validation is not successful, it will return an object with status as false and message as the error message
 */

export interface DropdownFieldInterface {
  selectedItems: Array<Object>;
  required?: boolean;
  allowMultiple?: boolean;
}

export const validateDropdownField = ({
  selectedItems,
  required = false,
  allowMultiple = false,
}: DropdownFieldInterface) => {
  if (required && selectedItems.length === 0) {
    return { status: false, message: "This field is required" };
  }
  if (!allowMultiple && selectedItems.length > 1) {
    return {
      status: false,
      message: "This field should have only one option selected",
    };
  }

  return { status: true };
};

/**
 * @description This function will validate the field type for the Date input element to check
 * 1. If the input is required or not
 * 2. If the input is a valid date or not
 * 3. If the input is a valid date format or not
 * 4. If future date is allowed or not
 * 5. If past date is allowed or not
 * @param {object} - Object containing the value of the date field, if the date field is required or
 * not, if the date field is a future date or not, if the date field is a past date or not and a
 * validation logic
 * @returns {object} - If the validation is successful, it will return an object with status as true and message as empty string
 * @returns {object} - If the validation is not successful, it will return an object with status as false and message as the error message
 */
export interface DateFieldInterface {
  value: string;
  required: boolean;
  canBeFutureDate?: boolean;
  canBePastDate?: boolean;
}
export const validateDateField = ({
  value,
  required = false,
  canBeFutureDate = false,
  canBePastDate = true,
}: DateFieldInterface) => {
  if (required && value?.trim().length === 0) {
    return { status: false, message: "This field is required" };
  }
  if (isNaN(new Date(value).getTime())) {
    return { status: false, message: "This field should be a valid date" };
  }
  if (!canBeFutureDate && new Date(value) > new Date()) {
    return { status: false, message: "This field should not be a future date" };
  }
  if (!canBePastDate && new Date(value) < new Date()) {
    return { status: false, message: "This field should not be a past date" };
  }
  return { status: true };
};

export async function validateFormData(
  req: NextRequest,
  isDivisionIdOptional: boolean = false,
  isDivisionIdRequired: boolean = false,
  whichApi: string = ""
): Promise<ValidateDateAndDivisionResponseInterface> {
  interface TempParsedFormDateAndDivisionInterface {
    dateFrom?: string;
    dateTo?: string;
    divisionInfo?: {
      id: string;
      name: string;
    };
  }
  // console.log("Trying to validate - ", whichApi);

  //Lets not waste time if the method params are invalid
  if (isDivisionIdOptional && isDivisionIdRequired) {
    return {
      valid: false,
      errors: ["Invalid request. Check the API documentation for more info."],
    };
  }

  // Lets try and parse the form data from the request.
  let tempData: DateRangeFormInterface = {};
  try {

    const params: any = req.nextUrl.searchParams;
    let dateFrom = '';
    let dateTo = '';
    let divisionId = '';
    console.log("params");
    console.log(params);
    params.forEach((key: any, value: any) => {
      console.log(value);
      if (value == "dateFrom") {
        dateFrom = key;
      } else if (value == "dateTo") {
        dateTo = key;
      } else if (value == "divisionId") {
        divisionId = key;
      }
    });
    let reqBody ;
    if(dateTo == '' || dateFrom == '') {
      reqBody = await req.formData();
    }
    tempData = {
      dateFrom: dateFrom.length > 0 ? dateFrom : reqBody?.get("dateFrom")?.toString(),
      dateTo: dateTo.length > 0 ? dateTo : reqBody?.get("dateTo")?.toString(),
      divisionId: divisionId.length > 0 ? divisionId : reqBody?.get("divisionId")?.toString() ?? undefined
    };
  } catch (error) {
    console.log("Error while parsing form data.");
    console.log(error);
    return {
      valid: false,
      errors: ["Invalid form data provided. Please try again."],
    };
  }
  // Form data is parsed and no errors where thrown. Lets continue with the remaining validation.
  const data = { ...tempData };

  const errors: string[] = [];
  let results: TempParsedFormDateAndDivisionInterface | undefined = undefined;

  // Validate divisionId first
  if (
    isDivisionIdRequired &&
    (!data.divisionId || data.divisionId.trim() === "")
  ) {
    errors.push("divisionId is required.");
  }

  if (data.divisionId && data.divisionId.trim() !== "") {
    if (isDivisionIdOptional) {
      if (divisionCodes[data.divisionId]) {
        results = {
          divisionInfo: {
            id: String(data.divisionId),
            name: divisionCodes[data.divisionId],
          },
        };
      } else {
        errors.push("Invalid divisionId provided.");
      }
    } else {
      errors.push("divisionId should not be provided for this API.");
    }
  }

  // Continue with other validations only if there are no errors so far
  if (errors.length === 0) {
    if (
      !data.dateFrom ||
      data.dateFrom.trim() === "" ||
      !data.dateTo ||
      data.dateTo.trim() === ""
    ) {
      errors.push("Both dateFrom and dateTo are required.");
    } else {
      if (
        !isValidDateTimeString(data.dateFrom) ||
        !isValidDateTimeString(data.dateTo)
      ) {
        errors.push("One or both of the provided dates are invalid.");
      } else {
        const dateFrom = parseISO(data.dateFrom);
        const dateTo = parseISO(data.dateTo);

        results = { ...results, dateFrom: data.dateFrom, dateTo: data.dateTo };

        // Check if dateFrom is greater than or equal to dateTo
        if (differenceInDays(dateTo, dateFrom) < 0) {
          errors.push("dateFrom must be greater than or equal to dateTo.");
        }

        // Check if difference between the two dates is more than 9 months
        if (differenceInMonths(dateTo, dateFrom) > 9) {
          errors.push(
            "The difference between the two dates cannot be more than 9 months."
          );
        }
      }
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }
  //Converting tempResults to finalResults
  if (results) {
    if (results.dateTo && results.dateFrom) {
      let finalResults: ParsedFormDateAndDivisionInterface = {
        dateTo: results.dateTo,
        dateFrom: results.dateFrom,
      };
      if (results.divisionInfo) {
        finalResults = {
          ...finalResults,
          divisionInfo: results.divisionInfo,
        };
      }

      return {
        valid: errors.length === 0,
        errors: errors,
        results: finalResults,
      };
    }
    errors.push(
      "Unknown error occured while parsing the form data. Please try again."
    );
    return { valid: false, errors: errors };
  }
  errors.push(
    "Unknown error occured while parsing the form data. Please try again."
  );
  return { valid: false, errors: errors };
}


export async function validateFormDataForNCD(
  req: NextRequest,
  whichApi: string = ""
): Promise<ValidateDateAndFacilityResponseInterface> {
  // Parse query parameters from the request URL
  let tempData: DateRangeWithFacilityFormInterface = {};
  try {
    const params = req.nextUrl.searchParams;
    let dateFrom = params.get("dateFrom") || "";
    let dateTo = params.get("dateTo") || "";
    let facilityCode = params.get("facility_code") || "";
    let diseaseCode = params.get("disease_code") || "";
    // If dateFrom, dateTo, or facilityCode are not in query params, attempt to get them from the request body
    console.log('log 1');
    if (!dateFrom || !dateTo) {
      const reqBody = await req.formData();
      dateFrom = dateFrom || reqBody.get("dateFrom")?.toString() || "";
      dateTo = dateTo || reqBody.get("dateTo")?.toString() || "";
    }
    console.log('log 2');

    tempData = {
      dateFrom: dateFrom,
      dateTo: dateTo,
      facilityCode: facilityCode || undefined,
      diseaseCode: diseaseCode || undefined
    };

  } catch (error) {
    console.error("Error while parsing form data:", error);
    return {
      valid: false,
      errors: ["Invalid form data provided. Please try again."],
      results: {},
    };
  }

  const data = { ...tempData };
  const errors: string[] = [];
  let results: ParsedFormDateAndFacilityInterface = {};

  // Pass facilityCode through without validation
  if (data.facilityCode && data.facilityCode.trim() !== "") {
    results.facilityCode = data.facilityCode.trim();
  }
  // Pass diseaseCode through without validation
  if (data.diseaseCode && data.diseaseCode.trim() !== "") {
    results.diseaseCode = data.diseaseCode.trim();
  }

  // Validate dateFrom and dateTo
  if ((data.dateFrom && !data.dateTo) || (!data.dateFrom && data.dateTo)) {
    errors.push("Both dateFrom and dateTo must be provided together or both left blank.");
  } else if (data.dateFrom && data.dateTo) {
    if (!isValidDateTimeString(data.dateFrom) || !isValidDateTimeString(data.dateTo)) {
      errors.push("One or both of the provided dates are invalid.");
    } else {
      const dateFrom = parseISO(data.dateFrom);
      const dateTo = parseISO(data.dateTo);

      results.dateFrom = data.dateFrom;
      results.dateTo = data.dateTo;

      // Check if dateFrom is less than or equal to dateTo
      if (differenceInDays(dateTo, dateFrom) < 0) {
        errors.push("dateFrom must be less than or equal to dateTo.");
      }

      // Check if the difference between the two dates is more than 9 months
      if (differenceInMonths(dateTo, dateFrom) > 9) {
        errors.push("The difference between the two dates cannot be more than 9 months.");
      }
    }
  } else {
    // Both dates are blank; leave them as undefined
    results.dateFrom = undefined;
    results.dateTo = undefined;
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Return the validated results
  return {
    valid: true,
    errors: [],
    results,
  };
}
