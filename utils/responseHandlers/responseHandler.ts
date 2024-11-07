import { NextResponse } from "next/server";
import { getResponseHeaders } from '../utilityFunctions';

export const noCacheHeaderes: HeadersInit = getResponseHeaders(0);
export const cacheHeaderes: HeadersInit = getResponseHeaders(1800);

/**
 * Send the error response with either the given message+status or the default message+status
 * @param msg
 * @param status
 */
export const sendErrorMsg = (msg: String = "Invalid Request", status = 400) =>
  NextResponse.json(
    {
      message: msg,
      status: status,
    },
    {
      status: status,
      headers:
        process.env.NODE_ENV === "development"
          ? noCacheHeaderes
          : cacheHeaderes,
    }
  );

export const sendSuccess = (data: object, status = 200) =>
  NextResponse.json(data, {
    status: status,
    headers:
      process.env.NODE_ENV === "development" ? noCacheHeaderes : cacheHeaderes,
  });
