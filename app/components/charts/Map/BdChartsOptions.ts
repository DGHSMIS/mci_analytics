import mapDataBangladesh from "@public/map-data/bd-all.topo.json";
import { colorAxisStops, MapDataItem } from "./BangladeshChart";

export interface GenerateBdMapOptionsProps {
  maxDataValue: number;
  dataToPrint: Array<MapDataItem>;
  addToSelectedDivisions: (division: string) => void;
  removeFromSelectedDivisions: (division: string) => void;
}

const generateBdMapOptions = ({
  maxDataValue,
  dataToPrint,
  addToSelectedDivisions,
  removeFromSelectedDivisions,
}: GenerateBdMapOptionsProps): any => ({
  title: {
    text: "",
    floating: false,
    style: {
      align: "left", // or 'center' or 'right'
      fontSize: "1.25rem",
      fontWeight: "600",
      verticalAlign: "top",
    },
  },
  colorAxis: {
    min: 0,
    max: maxDataValue,
    stops: colorAxisStops,
  },
  colors: ["#8CB8AC"],
  credits: {
    enabled: false,
  },
  exporting: {
    enabled: false,
  },
  plotOptions: {
    series: {
      point: {
        events: {
          click: function () {},
          select: function (this: Highcharts.Point) {
            const series = this.series as Highcharts.Series;
            // Unselect all other points
            if (series) {
              console.log("ON Select Event Triggered");
              // console.log(this.name);
              console.log(this);
              addToSelectedDivisions(this.name);
            }
          },
          unselect: function (this: Highcharts.Point) {
            console.log("UNSELECT FIRE");
            console.log(this.name);
            removeFromSelectedDivisions(this.name);
            // Update the dataLabels for the selected point
            this.update(
              {
                dataLabels: {
                  enabled: true,
                  format: `{point.name}`,
                },
              },
              true
            ); // false to disable redraw
          },
        },
      },
      cursor: "pointer",
    },
    map: {
      series: {
        type: "map",
      },
      states: {
        select: {
          borderColor: "#ffffff",
          color: "#B53333",
        },
      },
    },
  },
  mapNavigation: {
    enabled: false,
  },
  tooltip: {
    headerFormat: "",
    pointFormat: "{point.name}",
  },
  legend: {
    enabled: false,
  },
  series: [
    {
      type: "map",
      mapData: mapDataBangladesh,
      name: "Bangladesh",
      data: dataToPrint,
      cursor: "pointer",
      dataLabels: {
        enabled: true, // Enable by default
        format: "{point.name} ",
      },
      states: {
        hover: {
          color: "#cd4c4c",
          borderColor: "#ffffff",
        },
      },
      allowPointSelect: true,
    },
  ],
  chart: {
    height: 600,
    spacingTop: 0,
    spacingBottom: 0,
    // width: 600
  },
});

export default generateBdMapOptions;
