"use client";

import Button from "@library/Button";
import DatePicker from "@library/form/DatePicker";
import Label from "@library/form/Label";
import { useStore } from "@store/store";
import { getDaysBetweenDates, xMonthsAgo } from "@utils/utilityFunctions";
import { addMonths } from "date-fns";
import { delay } from "lodash";
import React, { useEffect, useState } from "react";

export interface SearchDateRangeFilterProps {
  filterByDate?: (minDateString?: Date, maxDateString?: Date) => void;
  renderContext: number;
  showLabel?: boolean;
  label?: string;
}

export default function SearchDateRangeFilterv2({
  filterByDate,
  renderContext = 1,
  showLabel = false,
  label = "Filter Date Range",
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
    ncdDataMinDate,
    ncdDataMaxDate,
    setNCDDataMinDate,
    setNCDDataMaxDate,
  } = useStore();

  const getMinDate = (context: number) => {
    if (context === 1) return demographyMinDate;
    if (context === 2) return serviceOverviewMinDate;
    if (context === 3) return ncdDataMinDate;
    return new Date();
  };

  const getMaxDate = (context: number) => {
    if (context === 1) return demographyMaxDate;
    if (context === 2) return serviceOverviewMaxDate;
    if (context === 3) return ncdDataMaxDate;
    return xMonthsAgo(3);
  };

  const [tempMinDate, setTempMinDate] = useState<Date>(getMinDate(renderContext));
  const [tempMaxDate, setTempMaxDate] = useState<Date>(getMaxDate(renderContext));
  const maxRange = renderContext !== 3 ? 90 : 365;

  // Sync temp dates if store updates (for context 3)
  useEffect(() => {
    if (renderContext === 3) {
      setTempMinDate(ncdDataMinDate);
      setTempMaxDate(ncdDataMaxDate);
    }
  }, [ncdDataMinDate, ncdDataMaxDate, renderContext]);

  // Validate and sync date logic when selecting start/end date
  const handleStartDateChange = (date: Date) => {
    if (date > tempMaxDate) {
      setTempMinDate(date);
      setTempMaxDate(addMonths(date, 3));
    } else {
      const days = getDaysBetweenDates(date, tempMaxDate);
      if (days > maxRange) {
        setTempMinDate(date);
        setTempMaxDate(addMonths(date, 3));
      } else {
        setTempMinDate(date);
      }
    }
  };

  const handleEndDateChange = (date: Date) => {
    if (date < tempMinDate) {
      setTempMinDate(addMonths(date, -3));
      setTempMaxDate(date);
    } else {
      const days = getDaysBetweenDates(tempMinDate, date);
      if (days > maxRange) {
        setTempMaxDate(addMonths(tempMinDate, 3));
      } else {
        setTempMaxDate(date);
      }
    }
  };

  return (
    <div className="grid w-full grid-cols-1 items-start md:grid-col-1 lg:grid-cols-3 lg:gap-x-12 space-y-8 lg:space-y-0">
      {showLabel && (
        <Label text={label} isRequired={false} className="col-span-3" />
      )}

      {/* Date Pickers Section */}
      <div className="col-span-2 grid grid-cols-2 gap-8">
        <DatePicker
          label="Start Date"
          className={'col-span-1'}
          value={tempMinDate}
          onChange={(date) => {
            if (date) handleStartDateChange(date as Date);
          }}
          maxDate={new Date()}
          minDate={new Date("2023-01-01")}
          size="md"
        />
        <DatePicker
          label="End Date"
          className={'col-span-1'}
          value={tempMaxDate}
          onChange={(date:any) => {
            if (date) handleEndDateChange(date as Date);
          }}
          maxDate={new Date()}
          minDate={new Date("2023-01-01")}
          size="md"
        />
      </div>

      {/* Filter Button */}
      {(renderContext === 1 || renderContext === 2 || renderContext === 3) && (
        <div className="col-span-1 flex flex-col md:flex-grow justify-start pl-0 lg:pt-24 w-full">
          <Button
            size="sm"
            className="h-36 w-full lg:w-auto"
            btnText="Filter by Date"
            iconStrokeWidth="1.5"
            clicked={async (event) => {
              event.preventDefault();
              if (renderContext === 1) {
                setDemoGraphyMinDate(tempMinDate);
                setDemoGraphyMaxDate(tempMaxDate);
              } else if (renderContext === 2) {
                setServiceOverviewMinDate(tempMinDate);
                setServiceOverviewMaxDate(tempMaxDate);
              } else if (renderContext === 3) {
                setNCDDataMinDate(tempMinDate);
                setNCDDataMaxDate(tempMaxDate);
              }
              if (filterByDate) {
                delay(() => filterByDate(tempMinDate, tempMaxDate), 200);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
