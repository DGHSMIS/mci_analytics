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
import { CountryCode, isValidPhoneNumber } from "libphonenumber-js";

export interface TextInputFieldInterface {
  value: string;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  isEmail: boolean;
}

// + Function To Validate Mobile Number of Bangladesh
export const validateBangladeshMobileNumber = (
  input: string
): { status: boolean; message: string } => {
  const bangladeshMobileNumberRegex = /^(\+?8801|01)[1-9][0-9]{8}$/;

  if (input?.trim().length === 0) {
    return { status: false, message: "This field is required!" };
  } else {
    if (bangladeshMobileNumberRegex.test(input)) {
      return { status: true, message: "" };
    } else {
      return { status: false, message: "Invalid Phone Number!" };
    }
  }
};

// + Function To Validation Phone Number
export const validatePhoneNumber = (
  phoneNumber: string,
  countryCode: CountryCode
): { status: boolean; message: string } => {
  if (phoneNumber?.trim().length === 0) {
    return { status: false, message: "This field is required!" };
  } else {
    if (isValidPhoneNumber(phoneNumber, countryCode)) {
      return { status: true, message: "" };
    } else {
      return { status: false, message: "Invalid phone number!" };
    }
  }
};

export const validateTextInputField = ({
  value = "",
  required = true,
  minLength = 2,
  maxLength = 100,
  isEmail,
}: TextInputFieldInterface) => {
  if (required && value?.trim().length === 0 && !isEmail) {
    return { status: false, message: "This field is required" };
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
      return { status: false, message: "Please enter a valid email address" };
    }
  }
  return { status: true, message: "" };
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
    return { status: true, message: "" };
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

    return { status: true, message: "" };
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
  return { status: true, message: "" };
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

  return { status: true, message: "" };
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
  return { status: true, message: "" };
};
