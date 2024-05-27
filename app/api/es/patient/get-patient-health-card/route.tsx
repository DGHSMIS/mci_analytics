// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CDPatientInterface } from "@utils/interfaces/CDPatientInterface";
import { HealthCard } from "@utils/interfaces/HealthCard/HealthCard";
import { NextRequest, NextResponse } from "next/server";
// import textToImage from 'text-to-image';
import { getCSGetPatientByHID } from '@providers/cassandra/cassandra';
import { convertCassandraPatientToESPatientIndexObject } from '@providers/elasticsearch/patientIndex/ESPatientIndex';
import { getBaseUrl } from "@utils/lib/apiList";
import { convertDateToReadableFormat, convertGenderToReadableFormat } from '@utils/utilityFunctions';
import puppeteer from 'puppeteer';
import Sharp from 'sharp';
/**
 * Get Encounter List By Patient Id
 * @param req
 * @param res
 * @returns
 */
export async function GET(req: NextRequest) {

  const params: any = req.nextUrl.searchParams;
  console.log("New request to get patient by id");
  console.log(params);
  let hid = "";
  params.forEach((key: any, value: any) => {
    console.log(value);
    if (value == "hid") {
      hid = key;
    }
  });
  console.log(hid);
  const results: CDPatientInterface[] = await getCSGetPatientByHID(hid);
  if (results.length == 0) {
    return NextResponse.json(
      { error: "No patient found" },
      {
        status: 400,
        headers: {
          "content-type": "application/json",
          "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
        },
      }
    );
  }

  const patientESObject = convertCassandraPatientToESPatientIndexObject(results[0]);
  // const addressItems = getUserAddressesFromInstance(patientESObject);
  const dob = convertDateToReadableFormat(String(results[0].date_of_birth));
  // const qrCode = await QRCode.toDataURL(patientESObject.health_id);


  const healthCardParam: HealthCard = {
    nameEn: results[0].given_name ?? "" + ' ' + results[0].sur_name ?? "",
    health_id: results[0].health_id ?? hid,
    nameBn: results[0].full_name_bangla ?? "",
    address: results[0].address_line ?? "",
    dob: dob ?? "",
    genderBn: results[0].gender ? convertGenderToReadableFormat(results[0].gender, "bn") : "",
    fatherNameBn: results[0].fathers_name_bangla ?? "",
    motherNameBn: results[0].mothers_name_bangla ?? "",
    bloodGroup: results[0].blood_group ?? "",
    dateProvided: convertDateToReadableFormat(patientESObject.created_at),
    nationalId: results[0].national_id ?? "",
  }

  const healthCardParamString = JSON.stringify(healthCardParam);
  const url = getBaseUrl() + '/generateImage';
  const fullUrl = `${url}?healthCardInfo=${healthCardParamString}`;
  console.log("fullUrl");
  console.log(fullUrl);
  try {
    const dataURI = await captureElement(fullUrl, '#templateBuilder');
    return NextResponse.json(
      { imageURI: dataURI },
      {
        status: 200,
        headers: {
          "content-type": "application/json",
          "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
        },
      });
  } catch (e) {
    console.log("Error in taking screenshot of the element")
    console.log(e)
    return NextResponse.json(
      { error: "Error capturing element" },
      {
        status: 400,
        headers: {
          "content-type": "application/json",
          "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
        },
      });
  }
}

async function captureElement(url: any, selector: any) {
  const browser = process.env.NODE_ENV === "development" ? await puppeteer.launch() : await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome', // or the path to the chrome executable
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle0' }); // wait until page load

  // Select the element and take a screenshot
  const element = await page.$(selector); // selector is the CSS selector of the element
  if (element) {
    const screenshot = await element.screenshot();
    await browser.close();

    // Optimize the image using Sharp
    const optimizedBuffer = await Sharp(screenshot)
      .jpeg({
        quality: 98
      }) // Adjust the quality as needed
      .toBuffer();
    // Convert the optimized buffer back to a Base64 string
    const optimizedBase64 = optimizedBuffer.toString('base64');
    // Return the optimized Base64 string
    return `data:image/png;base64,${optimizedBase64}`;
  } else {
    await browser.close();
    throw new Error('Element not found');
  }
}