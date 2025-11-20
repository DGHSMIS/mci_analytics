"use client";

import Button from "@library/Button";
import DatePicker from "@library/form/DatePicker";
import Label from "@library/form/Label";
import { useStore } from "@store/store";
import { getDaysBetweenDates, xMonthsAgo } from "@utils/utilityFunctions";
import { addMonths, startOfDay, endOfDay } from "date-fns";
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

  // Utility functions to normalize dates in local timezone
  const normalizeStartDate = (date: Date): Date => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0); // Sets time to 12:00:00 AM local time
    return normalized;
  };

  const normalizeEndDate = (date: Date): Date => {
    const normalized = new Date(date);
    normalized.setHours(23, 59, 59, 999); // Sets time to 11:59:59.999 PM local time
    return normalized;
  };

  // Validate and sync date logic when selecting start/end date
  const handleStartDateChange = (date: Date) => {
    const normalizedDate = normalizeStartDate(date);
    if (normalizedDate > tempMaxDate) {
      setTempMinDate(normalizedDate);
      setTempMaxDate(normalizeEndDate(addMonths(normalizedDate, 3)));
    } else {
      const days = getDaysBetweenDates(normalizedDate, tempMaxDate);
      if (days > maxRange) {
        setTempMinDate(normalizedDate);
        setTempMaxDate(normalizeEndDate(addMonths(normalizedDate, 3)));
      } else {
        setTempMinDate(normalizedDate);
      }
    }
  };

  const handleEndDateChange = (date: Date) => {
    const normalizedDate = normalizeEndDate(date);
    if (normalizedDate < tempMinDate) {
      setTempMinDate(normalizeStartDate(addMonths(normalizedDate, -3)));
      setTempMaxDate(normalizedDate);
    } else {
      const days = getDaysBetweenDates(tempMinDate, normalizedDate);
      if (days > maxRange) {
        setTempMaxDate(normalizeEndDate(addMonths(tempMinDate, 3)));
      } else {
        setTempMaxDate(normalizedDate);
      }
    }
  };

  return (
    <div className="grid w-full grid-cols-1 items-start lg:grid-cols-3 gap-4 lg:gap-x-12">
      {showLabel && (
        <Label text={label} isRequired={false} className="col-span-full" />
      )}

      {/* Date Pickers Section */}
      <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
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
          onChange={(date: any) => {
            if (date) handleEndDateChange(date as Date);
          }}
          maxDate={new Date()}
          minDate={new Date("2023-01-01")}
          size="md"
        />
      </div>

      {/* Filter Button */}
      {(renderContext === 1 || renderContext === 2 || renderContext === 3) && (
        <div className="col-span-1 flex flex-col justify-start lg:pt-24 w-full">
          <Button
            size="sm"
            className="h-36 w-full lg:w-auto"
            btnText="Filter by Date"
            iconStrokeWidth="1.5"
            clicked={async (event) => {
              event.preventDefault();
              // Ensure dates are normalized before saving
              const finalMinDate = normalizeStartDate(tempMinDate);
              const finalMaxDate = normalizeEndDate(tempMaxDate);

              if (renderContext === 1) {
                setDemoGraphyMinDate(finalMinDate);
                setDemoGraphyMaxDate(finalMaxDate);
              } else if (renderContext === 2) {
                setServiceOverviewMinDate(finalMinDate);
                setServiceOverviewMaxDate(finalMaxDate);
              } else if (renderContext === 3) {
                setNCDDataMinDate(finalMinDate);
                setNCDDataMaxDate(finalMaxDate);
              }
              if (filterByDate) {
                delay(() => filterByDate(finalMinDate, finalMaxDate), 200);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
