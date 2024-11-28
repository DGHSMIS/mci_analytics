
import { getYear } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
export default memo(function Footer() {
  const currentYear = getYear(new Date());

  const misDGHSLogoTitle = process.env.NEXT_PUBLIC_DG_MIS_LOGO_TITLE ?? "";
  const footerLead = "Management Information System,";
  const footerTail = "Directorate General of Health Services";
  const misDGHSLogo = '/img/mis_logo.png';
  const titleLabel = "UNICEF";
  const unicefLogo = '/img/unicef.png';
  const unicefLink = "https://www.unicef.org/";
  return (
    <div className="border-t border-slate-100 py-16 text-center sm:py-32">
      {/* //! Desktop View */}
      <div className="mobile hidden sm:flex sm:justify-center sm:items-center flex-col">
        <div className="text-start text-xs leading-none text-slate-500">
          <div className="text-center text-xs leading-none text-slate-500">
            <div className="flex justify-center items-center flex-col">
              <img
                src={`${misDGHSLogo}`}
                alt={misDGHSLogoTitle}
                aria-label={misDGHSLogoTitle}
                title={misDGHSLogoTitle}
                className="mx-6 h-[50px] hidden:sm visible:md inline-block"
              />
            </div>
          </div>
          <div className="flex justify-center items-center flex-col pt-2">
            <p className="ml-0  text-xs leading-5 text-slate-500">
              &copy; {currentYear}. All rights reserved.
            </p>
            <p className="ml-0  text-xs leading-5 text-slate-500">
              {footerLead}
            </p>
            <p className="ml-0 text-xs leading-5 text-slate-500">{footerTail}</p>
          </div>
        </div>
        <p className="inline-block text-center text-xs leading-none text-slate-500">
          <div className="flex justify-center space-x-4 w-100 max-h-48 items-center mt-16">
            <span className="text-xs">
              Supported by &nbsp;
            </span>
          </div>
          <div className="flex justify-center space-x-4 max-h-96 items-center mt-8">
            <Link
              href={`${unicefLink}`}
              rel="nofollow"
              target="_blank"
              title={titleLabel}
              aria-label={titleLabel}
              // className="bg-[#189cfe]"
            >
              <Image src={unicefLogo} alt={titleLabel} title={titleLabel}
                className="block md:ml-0 p-12 w-[10rem] m-h-96 border-[2px] border-[#1cabe2] border-opacity-10 hover:transition-opacity hover:border-opacity-30 hover:shadow-sm rounded"
                width={200}
                height={108}
                blurDataURL={`${process.env.blurDataURL}`}
                placeholder="blur"
              />
            </Link>
          </div>
        </p>
      </div>
      {/* //! Mobile View */}
      <div className="sm:hidden flex justify-center items-center flex-col">
        <div className="text-center text-xs leading-none text-slate-500">
          <div className="flex justify-center items-center flex-col">
            <img
              src={`${misDGHSLogo}`}
              alt={misDGHSLogoTitle}
              aria-label={misDGHSLogoTitle}
              title={misDGHSLogoTitle}
              className="mx-6 h-[50px] hidden:sm visible:md inline-block"
            />
          </div>
        </div>
        <div className="text-start text-xs leading-none text-slate-500">
          <div className="flex justify-center items-center flex-col">
            <p className="ml-0  text-xs leading-5 text-slate-500">
              &copy; {currentYear}. All rights reserved.
            </p>
            <p className="ml-0  text-xs leading-5 text-slate-500">
              {footerLead}
            </p>
            <p className="ml-0 text-xs leading-5 text-slate-500">{footerTail}</p>
          </div>
        </div>

        <p className="inline-block text-center text-xs text-slate-500 px-24">
          {/* &copy; {currentYear}
          <img
            src="/img/dghs.png"
            alt={misDGHSLogoTitle}
            aria-label={misDGHSLogoTitle}
            title={misDGHSLogoTitle}

            className="ml-28 mr-12 block w-40 md:ml-0 md:hidden"
          /> {footerLead} */}
          <div className="flex justify-center space-x-4 w-100 max-h-48 items-center mt-12">
            <div className="text-xs">
              Supported by &nbsp;
            </div>
          </div>
          <div className="flex justify-center space-x-4 w-100 max-h-48 items-center my-20">
            <Link
              href={`${unicefLink}`}
              rel="nofollow"
              target="_blank"
              title={titleLabel}
              aria-label={titleLabel}
              // className="bg-[#189cfe]"
            >
              <Image src={unicefLogo} alt={titleLabel} title={titleLabel}
                className="hover:cursor-pointer hover:opacity-90 transition-opacity block md:ml-0 p-8 w-[8rem] m-h-40 border-[1px] border-[#1cabe2] border-opacity-10 hover:transition-opacity hover:border-opacity-30 hover:shadow-sm rounded"
                width={100}
                height={54}
                blurDataURL={`${process.env.blurDataURL}`}
                placeholder="blur"
              />
            </Link>
          </div>
        </p>
      </div>
    </div>
  );
})
