"use client";

import { useStore } from "@store/store";
import * as Highcharts from "highcharts";
import HighchartsReact, {
  HighchartsReactRefObject,
} from "highcharts-react-official";
import highchartsBellCurve from "highcharts/modules/histogram-bellcurve";
import MapModule from "highcharts/modules/map";
import React, { memo, useEffect, useMemo, useRef } from "react";
import { cn } from "tailwind-cn";
import ChartTitle from "../ChartTitle";
import generateBdMapOptions, {
  GenerateBdMapOptionsProps,
} from "./BdChartsOptions";

export type MapDataItem = [string, number];

if (typeof Highcharts === "object") {
  highchartsBellCurve(Highcharts); // Execute the bell curve module
  MapModule(Highcharts);
}
export interface BangladeshChartProps {
  dataToPrint: Array<MapDataItem>; // You can replace 'any' with the actual type of your data
  mapTitle?: string;
  size?: "sm" | "md" | "lg";
  align?: "left" | "center" | "right";
  classNames?: string;
}
export const colorAxisStops: any = [
  [0, "#8CB8AC"],
  [1, "#004432"],
];

const mapMaxValueFinder = (data: Array<MapDataItem>) => {
  let currentMax = 0;
  data.forEach((item: MapDataItem) => {
    if (item[1] > currentMax) {
      currentMax = item[1];
    }
  });
  return currentMax;
};

const BangladeshChart = ({
  dataToPrint,
  mapTitle,
  size = "lg",
  align = "left",
  classNames = "",
}: BangladeshChartProps) => {
  const { selectedDivision, setSelectedDivision } = useStore();
  // Declare a ref to store the chart instance
  const chartRef = useRef<HighchartsReactRefObject | null>(null);
  const isInitialRender = useRef(true);
  const programmaticChangeRef = useRef(false);

  const addToSelectedDivisions = (name: string) => {
    const currentList = [...useStore.getState().selectedDivision];
    if (!currentList.includes(name)) {
      currentList.push(name);
      programmaticChangeRef.current = true;
      setSelectedDivision(currentList);
    }
  };

  const removeFromSelectedDivisions = (name: string) => {
    const newList = [...useStore.getState().selectedDivision].filter(
      (item: any) => item !== name
    );
    if (newList.length !== useStore.getState().selectedDivision.length) {
      programmaticChangeRef.current = true;
      setSelectedDivision(newList);
    }
  };

  const maxDataValue: number = useMemo(() => {
    return mapMaxValueFinder(dataToPrint);
  }, [dataToPrint]);

  const mapGeneratorProps: GenerateBdMapOptionsProps = {
    maxDataValue: maxDataValue,
    dataToPrint: dataToPrint,
    addToSelectedDivisions: addToSelectedDivisions,
    removeFromSelectedDivisions: removeFromSelectedDivisions,
  };

  const mapOptions: any = useMemo(() => {
    return generateBdMapOptions(mapGeneratorProps);
  }, [maxDataValue, dataToPrint]);

  const ensureColorAxis = (chart: Highcharts.Chart, maxVal: number) => {
    chart.update(
      {
        colorAxis: {
          min: 0,
          max: maxVal,
          stops: colorAxisStops,
        },
      },
      false
    ); // Update the chart configuration without redrawing
  };

  useEffect(() => {
    // Check for initial render
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    // If the change was triggered programmatically, exit without doing anything
    if (programmaticChangeRef.current) {
      programmaticChangeRef.current = false; // reset the ref for future changes
      return;
    }

    const chart = chartRef.current?.chart;
    if (!chart) return;

    // Deselect all points and reset labels
    chart.series[0].points.forEach((point) => {
      point.select(false, false); // Deselect the point
      point.update(
        {
          dataLabels: {
            enabled: true, // Keep labels enabled
            format: `{point.name}`,
          },
        },
        false
      ); // Skip redraw for better performance
    });

    // If selectedDivision is blank, refresh the chart and exit
    if (selectedDivision.length === 0) {
      chart.redraw(); // Now redraw the chart once
      return;
    }

    // Select corresponding points for selectedDivision
    selectedDivision.forEach((divisionName) => {
      const pointToSelect = chart.series[0].points.find(
        (point) => point.name === divisionName
      );
      if (pointToSelect) {
        pointToSelect.select(true, false);
        pointToSelect.update(
          {
            dataLabels: {
              enabled: true,
              format: `${divisionName}`,
            },
          },
          false
        ); // Skip redraw for better performance
      }
    });

    // Ensure colorAxis remains consistent
    if (chartRef.current?.chart) {
      ensureColorAxis(chartRef.current.chart, maxDataValue);
    }

    chart.redraw(); // Now redraw the chart once

    // Cleanup (If any required in future)
    return () => {
      // Cleanup code here if needed
    };
  }, [selectedDivision]);

  return (
    <div className="grid-item">
      <div className="w-full">
        {mapTitle && (
          <ChartTitle
            title={mapTitle}
            size={size}
            align={align}
            classNames={cn(
              "mb-12 text-slate-600 text-sm uppercase",
              classNames
            )}
          />
        )}
        <HighchartsReact
          ref={chartRef}
          options={mapOptions}
          constructorType={"mapChart"}
          highcharts={Highcharts}
        />
      </div>
    </div>
  );
};

export default memo(BangladeshChart);
