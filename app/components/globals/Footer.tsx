import { getYear } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
export default memo(function Footer() {
  const currentYear = getYear(new Date());

  const misDGHSLogoTitle = process.env.NEXT_PUBLIC_DG_MIS_LOGO_TITLE ?? "";
  const footerLead = "Ministry of Health & Family Welfare";
  // const footerLead = "Management Information System, DGHS";
  // const footerTail = "Directorate General of Health Services";
  const footerTail = "Government of the People's Republic of Bangladesh";

  // const misDGHSLogo = '/img/mis_logo.png';
  const misDGHSLogo = "/img/bd-gov-logo.png";
  const titleLabel = "UNICEF";
  const unicefLogo = "/img/unicef.png";
  const unicefLink = "https://www.unicef.org/";
  return (
    <footer className="bg-slate-100 py-12 sm:py-24 shadow-md drop-shadow-md inset-x-0">
      {/* Outer container with max-width */}
      <div className="mx-auto container px-4 py-12 sm:px-6 lg:px-8">
        {/* Responsive grid: 1 column on mobile, 2 columns on small screens and above */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-1">
          {/* Left Column */}
          <div className="flex flex-col space-y-4 justify-center items-center">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-12 space-y-4 sm:space-y-0">
              {/* Logo */}
              <a
                href="https://www.dghs.gov.bd/"
                className="flex items-center justify-center sm:justify-start space-x-4"
                rel="follow"
              >
                <Image
                  src={misDGHSLogo}
                  alt={footerTail}
                  title={footerTail}
                  className=" p-2 sm:p-12 md:w-[100px] sm:w-[75px] sm:max-h-[75px] md:max-h-[100px]"
                  width={100}
                  height={100}
                  blurDataURL={`${process.env.blurDataURL}`}
                  placeholder="blur"
                />
              </a>
              {/* Text content */}
              <div className="text-center sm:text-left flex flex-col space-y-4">
                <p className="text-xl text-slate-600 font-semibold">
                  {footerLead}
                </p>
                <p className="text-lg text-slate-500 font-medium">
                  {footerTail}
                </p>
                {/* <p className="text-base italic text-slate-600 mt-2 font-medium">
                {translation?.("address")}
                </p> */}
                <p className="text-sm text-gray-500">
                  &copy; {currentYear}. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});
