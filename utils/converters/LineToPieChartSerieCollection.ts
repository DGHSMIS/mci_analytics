import { Datum, Serie } from "@nivo/line";

const LineToPieChartSerieCollection = (originalData: Serie[]): Serie[] => {
  const pieData: Serie[] = [];
  console.log("originalData", originalData);
  console.log(originalData);
  originalData.forEach((serie: Serie) => {
    console.log("serie.id");
    console.log(serie.id);
    if (serie.id !== "all") {
      const parentWrapper: Serie = {
        id: serie.id,
        data: [],
        value: dataCounter(serie.data),
        label: serie.label,
        color: serie.color,
      };
      pieData.push(parentWrapper);
    }
  });

  console.table(pieData);
  console.log(pieData);
  return pieData;
};

const dataCounter = (data: readonly Datum[]) => {
  let count = 0;
  data.forEach((item: Datum) => {
    if (item.y && typeof item.y === "number") {
      count += item.y;
    }
  });
  return count;
};

export default LineToPieChartSerieCollection;
