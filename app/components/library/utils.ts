/**
 * @name Utils Functions
 * @description
 * * Company - ARITS Ltd. 24th Feb 2023.
 * * This ts file contains all the utility functions used in the project.
 */

import imageCompression from "browser-image-compression";
import { format, isValid, parse, parseISO } from "date-fns";
import Cookies from "js-cookie";
// @ts-ignore
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { DATE_FORMATS } from "./form/DatePicker/DatePickerProps";

/**
 * * Set Or Update cookie using this function
 */
export const setCookie = (cookieName: string, val: string) => {
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
  const cookie = `${cookieName}=${val}; expires=${expires.toUTCString()}; path=/`;
  document.cookie = cookie;
};

/**
 * * Get the value of a cookie using this function
 */
export const getCookie = (cookieName: string) => {
  return Cookies.get(`${cookieName}`);
};
/**
 * * Remove a cookie using this function
 */
export const removeCookie = (cookieName: string) => {
  return Cookies.remove(`${cookieName}`);
};

/**
 * * Remove all cookies using this function
 */
export const removeAllCookies = () => {
  const cookies = Cookies.get();
  for (const cookieName in cookies) {
    Cookies.remove(cookieName);
  }
};

/**
 * * Table Data API Fetcher
 */

export const tableURLWithParams = (
  basePath: string,
  apiPath: string,
  token: string,
) => {
  console.log(basePath + apiPath);
  return {
    apiUrl: `${basePath}${apiPath}`,
    headerOptions: {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: String(token),
      },
    },
  };
};

/**
 * * ALL API Fetcher excluding Tables
 */
export const getAPIResponse = async (
  basePath: string,
  apiPath: string,
  token = "",
  method = "GET",
  body: FormData | string | null = null,
  addMultipartHeader = false,
  revalidationTime = 0, //Cache the data that is fetched for 1 second
  hasCustomHeaders = false,
  customHeaders = {},
) => {
  const headers: Record<string, string> = {
    Authorization: `${token}`,
    "Access-Control-Allow-Origin": "*",
  };

  if (body) {
    if (body instanceof FormData && addMultipartHeader) {
      // If body is a FormData object, set Content-Type to multipart/form-data
      headers["Content-Type"] = "multipart/form-data";
    } else if (typeof body==="string") {
      // If body is a string, assume it's JSON and set Content-Type to application/json
      headers["Content-Type"] = "application/json";
    }
  }

  const apiHeader = {
    method: `${method}`,
    headers: !hasCustomHeaders ? headers : customHeaders,
    body: body!=null ? body:null,
  };

  if (revalidationTime==0) {
    // Adding ts-ignore because the next property is not defined in the type definition file
    /* @ts-ignore */
    apiHeader["next"] = { cache: "no-store" }; //Disable Cache;
  } else {
    /* @ts-ignore */
    apiHeader["next"] = { revalidate: revalidationTime }; //Cache the data that is fetched for 1 second
  }

  // console.log(apiHeader);
  const results = await fetch(`${basePath + apiPath}`, apiHeader);
  return results.json();
};

/**
 * * Download Files via API using this function
 */
export const fileDownloader = async (
  sitePath: string,
  apiPath: string,
  token: string,
  contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  downloadFileName: string,
) => {
  // console.log("The Token>>");
  // console.log(token);
  const headers: Record<string, string> = {
    Authorization: `${token}`,
    "Access-Control-Allow-Origin": "*",
  };
  const apiHeader = {
    method: "GET",
    next: { revalidate: 10 },
    headers: headers,
  };
  const response = await fetch(sitePath + apiPath, apiHeader);
  const data = await response.blob();

  const blob = new Blob([data], {
    type: contentType,
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = downloadFileName;
  a.click();
  URL.revokeObjectURL(url);
  return;
};
/**
 * Convert any Object with nested Objects to Form Data
 */
export const convertObjectToFormData = (
  obj: any,
  formData = new FormData(),
  namespace = "",
): FormData => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const formKey = namespace ? `${namespace}[${key}]`:key;

      if (value instanceof Object && !(value instanceof File)) {
        convertObjectToFormData(value, formData, formKey);
      } else {
        formData.append(formKey, String(value));
      }
    }
  }

  return formData;
};

/**
 * Format DateTime String to the following format: 2:08 AM, Sun 03-03-23
 * or Pass in the options object to format your own Format
 */
export const formatDateTime = (
  datetimeString: string, //ISO date string
  formatString: string | undefined = undefined,
) => {
  // console.log("Parsing Time");
  // console.log(datetimeString);
  const dateObj = parseISO(datetimeString);
  // console.log("The Date Object>>");
  // console.log(dateObj);
  const formattedDate = format(
    dateObj,
    formatString==undefined ? "h:mm a, do MMM, yy":formatString,
  );
  console.log(formatDateTime);
  return formattedDate;
};

/**
 * Handle Back Button Clicks
 */
export const handleBack = (
  window: (Window & typeof globalThis) | undefined,
  router: AppRouterInstance,
  backLink: string,
): void => {
  if (window!==undefined) {
    window.history.back();
  }
  router.push(backLink);
};

export const compressImageFile = async (
  file: File,
  maxSizeMB: number,
  maxWidthOrHeight: number = 1920,
) => {
  const imageFile = file;

  const options = {
    maxSizeMB: maxSizeMB,
    maxWidthOrHeight: maxWidthOrHeight,
    useWebWorker: true,
  };
  try {
    const compressedBlob = await imageCompression(imageFile, options);
    const compressedFile = new File([compressedBlob], imageFile.name, {
      type: imageFile.type,
    });

    return compressedFile;
  } catch (error) {
    console.log(error);
  }
};

// + Function To Fetch Image Data
export const fetchImageData = async (
  imageSrc: string,
  imageName: string,
): Promise<File> => {
  try {
    const response = await fetch(imageSrc);
    const blob = await response.blob();
    const file = new File([blob], imageName, { type: blob.type });
    // return URL.createObjectURL(blob)
    return file;
  } catch (error) {
    const file = new File([], "");
    console.error("Error fetching image data:", error);
    return file;
  }
};

/**
 * @description Parses a date string using the formats defined in `DATE_FORMATS`
 * @param dateString
 * @returns date object if the date string is valid, else null
 * @example
 * ```tsx
 * <SingleDatePicker
 *  value={parseDateStringToDateObject(yourDateStringFromAPI)}
 *  // other props
 * />
 * ```
 */
export const parseDateStringToDateObject = (dateString: string) => {
  for (const format of DATE_FORMATS) {
    const parsedDate = parse(dateString, format, new Date());

    // Check if the parsed date is valid
    if (isValid(parsedDate)) {
      return parsedDate; // Return the parsed date object
    }
  }

  return undefined; // Return null if no valid format matches
};


export const getRevalidationTime = () => {
  // return 0;
  return parseInt(process.env.NEXT_PUBLIC_API_REVALIDATE_TIME ?? '100');
};

// Create an array of string[] from a comma separated string
export const commaSeperatedStringToArray = (str: string) => {
  return str.split(",");
};