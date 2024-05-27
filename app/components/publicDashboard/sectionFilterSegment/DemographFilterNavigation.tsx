"use client";

import { useStore } from "@store/store";
import dynamic from "next/dynamic";
import React, { memo } from "react";

interface DemographFilterNavigationProps {
  onBack?: (event: true) => void;
}

const Button = dynamic(() => import("@library/Button"), { ssr: true });

export default memo(function DemographFilterNavigation({
  onBack,
}: DemographFilterNavigationProps) {
  const { setSelectedDivision } = useStore();
  return (
    <div className="absolute top-0 left-12">
      <div className="flex justify-center items-center">
        <Button
          variant="link"
          btnText="Back to Divisions"
          className="font-bold underline-offset-4"
          iconName="arrow-left"
          iconColor="currentColor"
          size={"sm"}
          outline={false}
          clicked={() => {
            console.log("Back Arrow Clicked");
            setSelectedDivision([]);
            if (onBack) {
              onBack(true);
            }
          }}
        />
      </div>
    </div>
  );
})
