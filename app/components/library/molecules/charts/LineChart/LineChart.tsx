import { ResponsiveLine } from "@nivo/line";
import React from "react";

const data = [
  {
    id: "japan",
    color: "hsl(108, 70%, 50%)",
    data: [
      {
        x: "plane",
        y: 293,
      },
      {
        x: "helicopter",
        y: 61,
      },
      {
        x: "boat",
        y: 6,
      },
      {
        x: "train",
        y: 132,
      },
      {
        x: "subway",
        y: 47,
      },
      {
        x: "bus",
        y: 150,
      },
      {
        x: "car",
        y: 27,
      },
      {
        x: "moto",
        y: 207,
      },
      {
        x: "bicycle",
        y: 259,
      },
      {
        x: "horse",
        y: 245,
      },
      {
        x: "skateboard",
        y: 16,
      },
      {
        x: "others",
        y: 239,
      },
    ],
  },
  {
    id: "france",
    color: "hsl(179, 70%, 50%)",
    data: [
      {
        x: "plane",
        y: 165,
      },
      {
        x: "helicopter",
        y: 90,
      },
      {
        x: "boat",
        y: 254,
      },
      {
        x: "train",
        y: 38,
      },
      {
        x: "subway",
        y: 51,
      },
      {
        x: "bus",
        y: 206,
      },
      {
        x: "car",
        y: 164,
      },
      {
        x: "moto",
        y: 275,
      },
      {
        x: "bicycle",
        y: 110,
      },
      {
        x: "horse",
        y: 120,
      },
      {
        x: "skateboard",
        y: 209,
      },
      {
        x: "others",
        y: 17,
      },
    ],
  },
  {
    id: "us",
    color: "hsl(155, 70%, 50%)",
    data: [
      {
        x: "plane",
        y: 244,
      },
      {
        x: "helicopter",
        y: 214,
      },
      {
        x: "boat",
        y: 183,
      },
      {
        x: "train",
        y: 7,
      },
      {
        x: "subway",
        y: 33,
      },
      {
        x: "bus",
        y: 43,
      },
      {
        x: "car",
        y: 8,
      },
      {
        x: "moto",
        y: 173,
      },
      {
        x: "bicycle",
        y: 177,
      },
      {
        x: "horse",
        y: 179,
      },
      {
        x: "skateboard",
        y: 220,
      },
      {
        x: "others",
        y: 105,
      },
    ],
  },
  {
    id: "germany",
    color: "hsl(111, 70%, 50%)",
    data: [
      {
        x: "plane",
        y: 147,
      },
      {
        x: "helicopter",
        y: 182,
      },
      {
        x: "boat",
        y: 231,
      },
      {
        x: "train",
        y: 233,
      },
      {
        x: "subway",
        y: 126,
      },
      {
        x: "bus",
        y: 238,
      },
      {
        x: "car",
        y: 90,
      },
      {
        x: "moto",
        y: 188,
      },
      {
        x: "bicycle",
        y: 94,
      },
      {
        x: "horse",
        y: 61,
      },
      {
        x: "skateboard",
        y: 58,
      },
      {
        x: "others",
        y: 136,
      },
    ],
  },
  {
    id: "norway",
    color: "hsl(244, 70%, 50%)",
    data: [
      {
        x: "plane",
        y: 186,
      },
      {
        x: "helicopter",
        y: 176,
      },
      {
        x: "boat",
        y: 158,
      },
      {
        x: "train",
        y: 163,
      },
      {
        x: "subway",
        y: 94,
      },
      {
        x: "bus",
        y: 52,
      },
      {
        x: "car",
        y: 233,
      },
      {
        x: "moto",
        y: 16,
      },
      {
        x: "bicycle",
        y: 98,
      },
      {
        x: "horse",
        y: 150,
      },
      {
        x: "skateboard",
        y: 221,
      },
      {
        x: "others",
        y: 165,
      },
    ],
  },
];
export default function LineChart() {
  return (
    <div style={{ height: 700 }}>
      {/* @ts-ignore */}
      <ResponsiveLine
        data={data}
        curve="catmullRom"
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          // orient: "start",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "transportation",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          // orient: "start",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "count",
          legendOffset: -40,
          legendPosition: "middle",
        }}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={true}
        // legends={[
        // 	{
        // 		anchor: "bottom-right",
        // 		direction: "column",
        // 		justify: false,
        // 		translateX: 100,
        // 		translateY: 0,
        // 		itemsSpacing: 0,
        // 		itemDirection: "left-to-right",
        // 		itemWidth: 80,
        // 		itemHeight: 20,
        // 		itemOpacity: 0.75,
        // 		symbolSize: 12,
        // 		symbolShape: "circle",
        // 		symbolBorderColor: "rgba(0, 0, 0, .5)",
        // 		effects: [
        // 			{
        // 				on: "hover",
        // 				style: {
        // 					itemBackground: "rgba(0, 0, 0, .03)",
        // 					itemOpacity: 1,
        // 				},
        // 			},
        // 		],
        // 	},
        // ]}
      />
    </div>
  );
}
