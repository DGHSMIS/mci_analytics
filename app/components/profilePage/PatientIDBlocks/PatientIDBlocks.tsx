"use client";

/**
 * Developed by Fahim Hossain
 * Designation: Software Specialist, MIS, DGHS
 * Email: fahim@aritsltd.com
 * website: https://aritsltd.com
 */
import dynamic from "next/dynamic";
import React, { memo } from "react";
import { cn } from "tailwind-cn";

const IdPrintAndClickToCopyBlock = dynamic(
  () => import("@components/profilePage/IdPrintAndClickToCopyBlock"),
  {
    ssr: true,
  }
);

export interface PatientIDProps {
  idName: string;
  idNumber: string | null;
  allowCopy?: boolean;
}

const PatientIDBlocks: React.FC<PatientIDProps> = memo(function PatientIDBlocks(
  patientIdData: PatientIDProps
) {
  return (
      <div className={'grid grid-cols-8 text-sm text-left w-full ml-0 space-x-4'}>
        {patientIdData.idName &&
        <div className="col-span-2 mr-4">
          {patientIdData.idName}
        </div>
        }
        <div className={cn(patientIdData.idName ? "col-span-6" : "col-span-8", "flex justify-end")}>
          <IdPrintAndClickToCopyBlock
            id={patientIdData.idNumber ? patientIdData.idNumber : "Unavailable"}
            allowCopy={patientIdData.allowCopy ?? false}
          />
        </div>
      </div>
  );
});

export default PatientIDBlocks;
