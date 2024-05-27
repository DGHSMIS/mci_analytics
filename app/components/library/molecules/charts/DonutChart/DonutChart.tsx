import { ResponsivePie } from "@nivo/pie";
import React from "react";
import styles from "./DonutChart.module.scss";

const data = [
  {
    id: "Region 1",
    label: "Region 1",
    value: 392,
    color: "hsl(140, 70%, 50%)",
  },
  {
    id: "Region 2",
    label: "Region 2",
    value: 410,
    color: "hsl(179, 70%, 50%)",
  },
  {
    id: "Region 3",
    label: "Region 3",
    value: 95,
    color: "hsl(130, 70%, 50%)",
  },
  {
    id: "Region 4",
    label: "Region 4",
    value: 47,
    color: "hsl(195, 70%, 50%)",
  },
  {
    id: "Others",
    label: "Others",
    value: 32,
    color: "hsl(152, 70%, 50%)",
  },
];
export default function DonutChart() {
  return (
    <div className="position-relative" style={{ height: 700 }}>
      <div className={styles.summmaryBlock}>500,000</div>
      <ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 120, left: 80 }}
        innerRadius={0.6}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        colors={{ scheme: "category10" }}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
        defs={[
          {
            id: "dots",
            // type: "patternDots",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: "lines",
            // type: "patternLines",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        fill={[
          {
            match: {
              id: "region1",
            },
            id: "dots",
          },
          {
            match: {
              id: "region2",
            },
            id: "dots",
          },
          {
            match: {
              id: "region3",
            },
            id: "dots",
          },
          {
            match: {
              id: "region4",
            },
            id: "dots",
          },
          {
            match: {
              id: "others",
            },
            id: "lines",
          },
        ]}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
}
