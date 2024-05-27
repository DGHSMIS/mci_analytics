import { ResponsiveBar } from "@nivo/bar";
import variables from "@variables/variables.module.scss";
import React from "react";

//Bar Grapth Values are printed outside the bars using this custom component
const ValueOutside = ({ bars }: any) => {
  return bars.map((bar: any) => {
    const {
      key,
      width,
      height,
      x,
      y,
      data: { value },
    } = bar;
    return (
      <g key={key} transform={`translate(${x}, ${y})`}>
        <text
          className="fw-semiBold"
          transform={`translate(${width + 20}, ${(height + 10) / 2})`}
          textAnchor="middle"
          fontSize="14px"
          fill={variables.tertiary}
        >
          {value}
        </text>
      </g>
    );
  });
};

//X-axis label removed but the axis label is visible
const AxisX = () => {
  return (
    <g key="1">
      <text
        className="fw-semiBold"
        textAnchor="middle"
        fontSize="14px"
        fill={variables.tertiary}
      ></text>
    </g>
  );
};

//Function used to displayed Y-Axis Labels.
//It breaks a long word and print multiple lines
const getTspanGroups = (
  value: string,
  maxLineLength: number,
  maxLines: number = 2
) => {
  const words = value.split(" ");

  type linesAcc = {
    lines: string[];
    currLine: string;
  };

  //reduces the words into lines of maxLineLength
  const assembleLines: linesAcc = words.reduce(
    (acc: linesAcc, word: string) => {
      //if the current line isn't empty and the word + current line is larger than the allowed line size, create a new line and update current line
      if ((word + acc.currLine).length > maxLineLength && acc.currLine !== "") {
        return {
          lines: acc.lines.concat([acc.currLine]),
          currLine: word,
        };
      }
      //otherwise add the word to the current line
      return {
        ...acc,
        currLine: acc.currLine + " " + word,
      };
    },
    { lines: [], currLine: "" }
  );

  //add the ending state of current line (the last line) to lines
  const allLines = assembleLines.lines.concat([assembleLines.currLine]);

  //for now, only take first 2 lines due to tick spacing and possible overflow
  const lines = allLines.slice(0, maxLines);
  let children: JSX.Element[] = [];
  let dy = 0;

  lines.forEach((lineText, i) => {
    children.push(
      <tspan x={0} dy={dy} key={i}>
        {
          // if on the second line, and that line's length is within 3 of the max length, add ellipsis
          1 === i && allLines.length > 2
            ? lineText.slice(0, maxLineLength - 3) + "..."
            : lineText
        }
      </tspan>
    );
    //increment dy to render next line text below
    dy += 15;
  });

  return children;
};

export default function BarChart({
  data = [
    {
      area: "Region 17",
      suppliers: 250,
      suppliersColor: variables.primary,
    },
  ],
}: any) {
  // https://nivo.rocks/bar/
  //https://nivo.rocks/storybook/?path=/story/bar--custom-tooltip
  return (
    <div style={{ height: 700 }}>
      <ResponsiveBar
        data={data}
        keys={["suppliers"]}
        indexBy="area"
        // margin={{ top: 50, right: 160, bottom: 50, left: 160 }}
        padding={0.25}
        groupMode="grouped"
        layout="horizontal"
        valueScale={{ type: "linear" }}
        animate={true}
        indexScale={{ type: "band", round: true }}
        colors={variables.primary}
        layers={[
          "grid",
          "axes",
          "bars",
          "markers",
          "legends",
          "annotations",
          (props: any) => <ValueOutside {...props} />,
        ]}
        fill={[
          {
            match: {
              id: "fries",
            },
            id: "dots",
          },
          {
            match: {
              id: "sandwich",
            },
            id: "lines",
          },
        ]}
        borderRadius={0}
        borderColor={variables.light}
        axisTop={null}
        axisRight={null}
        // axisBottom={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 0,
          tickRotation: 0,
          legend: "Number of Suppliers",
          legendPosition: "middle",
          legendOffset: 0,
          format: (props: any) => <AxisX {...props} />,
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Regions",
          legendPosition: "middle",
          legendOffset: -120,

          renderTick: ({
            opacity,
            textAnchor,
            textBaseline,
            textX,
            textY,
            value,
            x,
            y,
          }: any) => {
            return (
              <g transform={`translate(${x},${y})`} style={{ opacity }}>
                <text
                  textAnchor={textAnchor}
                  transform={`translate(${textX},${textY})`}
                >
                  {getTspanGroups(value, 15, 2)}
                </text>
              </g>
            );
          },
        }}
        enableGridX={false}
        enableGridY={false}
        enableLabel={false}
        labelSkipWidth={10}
        labelTextColor={variables.tertiary}
        tooltip={({ id, value, color }: any) => (
          <div
            style={{
              padding: 12,
              color: variables.gray300,
              background: variables.tertiary,
            }}
          >
            <span>Suppliers for the region - {value}</span>
          </div>
        )}
        motionConfig="gentle"
        role="application"
        isFocusable={true}
        ariaLabel="Bar Chart for regions"
        barAriaLabel={function (e: any) {
          return (
            e.id + ": " + e.formattedValue + " in country: " + e.indexValue
          );
        }}
        onClick={(e: any) => console.log(e)}
      />
    </div>
  );
}
