"use client";

import React, { memo } from "react";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import useWindowSize from "@utils/hooks/useWindowSize";
import dynamic from "next/dynamic";
import tailwindConfig from "tailwind.config.js";
import resolveConfig from "tailwindcss/resolveConfig";
import { EncounterListItem } from "@utils/interfaces/Encounter/Encounter";


const Button = dynamic(() => import("@library/Button"), {
  ssr: true,
});

const Alert = dynamic(() => import("@library/Alert"), {
  ssr: true,
});

const fullTwConfig = resolveConfig(tailwindConfig) as any;
export type TimelineItemsProps =  (EncounterListItem & {
  buttonText: string;
})
interface MedicalHistoyProps {
  encounters: TimelineItemsProps[];
  viewEncounter: (encounterId: EncounterListItem) => void;
}

const MedicalHistory = ({ encounters, viewEncounter }: MedicalHistoyProps) => {
  console.log("Medical History --");
  console.log(encounters);
  const { width, height } = useWindowSize();
  return (
    <div className="max-h-[100vh] md:min-h-[200px] md:max-h-[80vh] h-auto w-full overflow-y-scroll">
      {encounters ? (
        <>
          <VerticalTimeline
            layout="1-column-left"
            lineColor={fullTwConfig.theme.colors.slate[100]}
            className="!w-full m-0 "
          >
            {encounters.map((element, index) => {
              return (
                <VerticalTimelineElement
                  key={String(index + 1)}
                  date={(element.encounter_time).toString()}
                  dateClassName="!opacity-100 absolute -top-28 left-0 block ml-12 w-full !font-bold text-sm text-slate-800"
                  iconStyle={{
                    // boxShadow: "none",
                    background: fullTwConfig.theme.colors.primary[500],
                    margin: "0",
                  }}
                  visible={true}
                  contentStyle={{
                    marginTop: "0",
                    padding: "5px 0 0 0",
                    boxShadow: "none",
                    border: "none",
                    backgroundColor: fullTwConfig.theme.colors.white,
                    width: width < 768 ? "100%" : "80%",
                    position: "relative",
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                    flexDirection: "column",
                    borderRadius: "0",
                  }}
                  contentArrowStyle={{
                    borderRightColor: fullTwConfig.theme.colors.primary[600],
                  }}
                  icon={
                  <div className="shadow bg-primary-500 font-light text-sm text-white rounded-full flex justify-center items-center w-full h-full">
                    <div className={'w-fit h-fit'}>
                    {encounters.length - (index)}
                    </div>
                  </div>
                  }
                >
                  <div className="card space-y-4 border border-slate-200 hover:shadow-sm w-full">
                    <div className="grid grid-cols-6 md:gap-8 text-sm  text-wrap overflow-hidden">
                      <div className="col-span-6 md:col-span-2 flex justify-end md:justify-end items-start text-primary-500 font-semibold">
                        Hospital:
                      </div>
                      <div className="col-span-6 md:col-span-4 flex justify-start items-center">
                        {element.facility_name}
                      </div>
                      <div className="col-span-6 md:col-span-2 flex justify-end md:justify-end items-start text-primary-500 font-semibold">
                        Location:
                      </div>
                      <div className="col-span-6 md:col-span-4 flex justify-start items-center">
                        {element.facility_location}
                      </div>
                      <div className="col-span-6 md:col-span-2 flex justify-end md:justify-end items-start text-primary-500 font-semibold">
                        Type:
                      </div>
                      <div className="col-span-6 md:col-span-4 flex justify-start items-center">
                        {element.facility_type}
                      </div>
                    </div>
                    <div className="flex justify-center pt-12">
                      <Button
                        size="sm"
                        className="text-sm  text-primary-500 hover:bg-primary-500 hover:text-white hover:shadow rounded"
                        iconPos={"right"}
                        iconName={"eye"}
                        fullWidth={true}
                        btnText={element.buttonText}
                        outline={true}
                        variant="primary"
                        clicked={() => {
                          console.log("Button cLicked");
                          if (viewEncounter) {
                            viewEncounter(element);
                          }
                        }}
                      />
                    </div>
                  </div>
                  <hr className="visible md:hidden flex w-full my-16 bg-slate-200" />
                </VerticalTimelineElement>
              );
            })}
          </VerticalTimeline>
          {/* <Button */}
          {/*   size={"lg"} */}
          {/*   fullWidth={true} */}
          {/*   clicked={() => console.log("Clicked")} */}
          {/*   btnText={"Loading ..."} */}
          {/*   variant="neutral" */}
          {/* /> */}
        </>
      ) : (
        <div className="flex w-full flex-col justify-start space-y-48 2xl:container ">
          <Alert
            iconName="alert-triangle"
            className="w-full"
            variant="warning"
            isIconClicked={() => null}
            showBtn={false}
            title="No medical history was found"
            body="Our database records indicate that you don't have any medical history with us."
            isBtnGhost={true}
            hideCross={true}
          />
        </div>
      )}
    </div>
  );
};

export default memo(MedicalHistory);
