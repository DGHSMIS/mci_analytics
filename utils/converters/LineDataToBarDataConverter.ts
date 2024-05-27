import { BarDatum } from "@nivo/bar/dist/types/types";
import { Datum } from "@nivo/line";

type Serie = {
  id: string | number;
  data: { x: string; y: number }[];
  [key: string]: any;
};

type MyLineData = {
  [category: string]: { key: string; doc_count: number }[];
};

const LineDataToBarDataConverter = (series: any): BarDatum[] => {
  const myLineData: MyLineData = {};

  series.forEach((serie: any) => {
    myLineData[serie.id as string] = serie.data.map((d: any) => ({
      key: d.x,
      doc_count: d.y,
    }));
  });

  return convertSerieToMyLineData(myLineData);
};

const convertSerieToMyLineData = (lineData: MyLineData): BarDatum[] => {
  const barData: BarDatum[] = [];

  // Iterate through each category like 'all', 'male', etc.
  Object.keys(lineData).forEach((category) => {
    lineData[category].forEach((datum: Datum) => {
      // Find or create the BarDatum for this key
      let barDatum = barData.find((d) => d.key === datum.key);
      if (!barDatum) {
        barDatum = { key: datum.key };
        barData.push(barDatum);
      }

      // Set the value for this category
      barDatum[category] = datum.doc_count;
    });
  });

  return barData;
};

export default LineDataToBarDataConverter;
