"use client";

import Button from "@library/Button";
import MultipleDatePicker from "@library/form/DatePicker/MultipleDatePicker";
import { useStore } from "@store/store";
import { getDaysBetweenDates, xMonthsAgo } from "@utils/utilityFunctions";
import { addMonths } from "date-fns";
import { delay } from "lodash";
import React, { useEffect } from "react";

// renderContext
// 1 - Demography
// 2 - Service Overview

export interface SearchDateRangeFilterProps {
  filterByDate?: (minDateString?: Date, maxDateString?: Date) => void;
  renderContext: number;
}

export default function SearchDateRangeFilter({
                                                     filterByDate,
                                                     renderContext = 1,
                                                   }: SearchDateRangeFilterProps) {
  const {
    demographyMinDate,
    demographyMaxDate,
    setDemoGraphyMinDate,
    setDemoGraphyMaxDate,
    serviceOverviewMinDate,
    serviceOverviewMaxDate,
    setServiceOverviewMinDate,
    setServiceOverviewMaxDate,
  } = useStore();

  const getMinDate = (context: number) => {
    if (context===1) {
      console.log("Demo Min Date");
      console.log(demographyMinDate.toISOString());
      return demographyMinDate;
    }
    if (context===2) {
      console.log("Service Overview Min Date");
      console.log(serviceOverviewMinDate.toISOString());
      return serviceOverviewMinDate;
    }
    return new Date();
  };

  const getMaxDate = (context: number) => {
    if (context===1) {
      return demographyMaxDate;
    }
    if (context===2) {
      return serviceOverviewMaxDate;
    }
    return xMonthsAgo(3);
  };

  const [tempMinDate, setTempMinDate] = React.useState<Date>(
    getMinDate(renderContext),
  );
  const [tempMaxDate, setTempMaxDate] = React.useState<Date>(
    getMaxDate(renderContext),
  );

  const [allDates, setAllDates] = React.useState<Date[]>([]);
  const dateReturnFormat = "yyyy-MM-dd";
  const maxRange = 90;
  useEffect(() => {
    if(allDates.length==2) {
      if (allDates[0]!==tempMinDate || allDates[1]!==tempMaxDate) {
        // setAllDates(getAllDatesBetween(tempMinDate, tempMaxDate));
        setAllDates([tempMinDate, tempMaxDate]);
      }
    }
    else{
      setAllDates([getMinDate(renderContext), getMaxDate(renderContext)]);
    }
  }, [[tempMinDate, tempMaxDate]]);
  return (
    
<div className="grid w-full grid-cols-1 items-start md:grid-cols-3 lg:gap-x-12 space-y-8 lg:space-y-0">
<div className="lg:mb-0 text-sm col-span-1 md:col-span-2 w-full">
{/* <div className="grid w-full grid-cols-3 items-start  md:grid-cols-3  lg:gap-x-12 lg:space-y-0">
<div className={'lg:mb-0 text-sm col-span-2 w-full'}> */}
      <MultipleDatePicker
        mode={"range"}
        dateField={
          {
            className: "h-36 pr-24",
          }
        }
        footerCaption={"Select Date Range"}
        fromDate={new Date("2023-01-01")}
        toDate={new Date()}
        dateBetweenConnector={"<=>"}
        value={allDates}
        dateReturnFormat={dateReturnFormat}
        max={Infinity}
        min={2}
        showResetButton={false}
        onChange={(e: string[] | null) => {
          if (e) {
            console.log("The date is not null");
            console.log(e);
            const dates: Date[] = [];
            e.forEach((date: string | undefined) => {
              if (date) {
                dates.push(new Date(date));
              }
            });
            if (dates.length==2) {
              const days = getDaysBetweenDates(dates[0], dates[1]);
              if (days > maxRange) {
                setTempMinDate(dates[0]);
                setTempMaxDate(addMonths(dates[0], 3));
              } else {
                setTempMinDate(dates[0]);
                setTempMaxDate(dates[1]);
              }
            }
          } else {
            console.log("The date is null");
            setTempMinDate(getMinDate(renderContext));
            setTempMaxDate(getMaxDate(renderContext));
          }
        }}
      />
      </div>
      {/* <div className="col-span-1 flex flex-grow flex-col justify-start pl-8"> */}
      <div className="col-span-1 flex flex-col md:flex-grow justify-start pl-0 md:pl-8">
        <Button
          size={"sm"}
          className={"h-36 w-full lg:w-auto"}
          btnText="Filter by Date"
          iconStrokeWidth={"1.5"}
          clicked={async (event) => {
            event.preventDefault();
            if (renderContext==1) {
              console.log("The render context is 1");
              setDemoGraphyMinDate(tempMinDate);
              setDemoGraphyMaxDate(tempMaxDate);
              if (filterByDate) {
                delay(() => {
                  filterByDate(tempMinDate, tempMaxDate);
                }, 200);
              }
            } else if (renderContext==2) {
              console.log("The render context is 2");
              setServiceOverviewMinDate(tempMinDate);
              setServiceOverviewMaxDate(tempMaxDate);
              if (filterByDate) {
                delay(() => {
                  filterByDate(tempMinDate, tempMaxDate);
                }, 200);
              }
            }
          }}
        />
      </div>
    </div>
  );
};
