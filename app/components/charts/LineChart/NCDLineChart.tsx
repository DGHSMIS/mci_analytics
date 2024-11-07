import { LegendProps } from "@nivo/legends";
import { ResponsiveLine, Serie } from "@nivo/line";
import { timeFormat } from "d3-time-format";
import { memo, useState } from "react";
import ChartTitle from "../ChartTitle";

export interface NCDLineGraphProps {
    data: any;
}
function NCDLineGraph({ data }: NCDLineGraphProps) {

    const timeSeriesData: Serie[] = data;
    const [filteredData, setFilteredData] = useState(timeSeriesData);
    // const handleLegendClick = (legend: Datum) => {

    //     // Toggle visibility of the clicked legend's data
    //     console.log("The Full data");
    //     console.log(filteredData);

    //     //Check if any legend is already hidden & if so, make it visible
    //     let isAnyHidden = false;
    //     filteredData.forEach((dataset: Serie) => {
    //         let data = dataset;
    //         if (data.hidden) {
    //             isAnyHidden = true;
    //         }
    //     });
    //     console.log("Is any hidden", isAnyHidden);
    //     let isFound = false;

    //     let considerMakingAllItemsVisible = false;
    //     let currentVisibleItemId: String | Number | null = null;
    //     if (isAnyHidden) {
    //         filteredData.forEach((dataset: Serie) => {
    //             console.log("Checking if all items should be visible");
    //             console.log("The legend ID", legend.id);
    //             console.log("The dataset ID", dataset.id);
    //             console.log("The dataset", dataset);
    //             console.log("The dataset is hidden", dataset.hidden);
    //             if (dataset.id === legend.id && !dataset.hidden && !considerMakingAllItemsVisible) {
    //                 console.log("Making all items visible");
    //                 considerMakingAllItemsVisible = true
    //                 currentVisibleItemId = dataset.id;
    //             }
    //         });
    //     }

    //     //If we are making all items visible, we need to make all items visible
    //     //clicking on the same legend should not hide the data
    //     if (considerMakingAllItemsVisible) {
    //         console.log("Here 0");

    //         if (currentVisibleItemId == legend.id) {
    //             console.log("Here 1");
    //             const updatedData = filteredData.map((dataset: Serie) => {
    //                 return { ...dataset, hidden: false };
    //             });
    //             setFilteredData(updatedData);
    //         } else {
    //             const updatedData = filteredData.map((dataset: Serie) => {
    //                 console.log("Here 2");
    //                 if (currentVisibleItemId == legend.id) {
    //                     return { ...dataset, hidden: false };
    //                 } else {
    //                     return { ...dataset, hidden: true };
    //                 }
    //             });
    //             setFilteredData(updatedData);
    //         }
    //     }
    //     else {
    //         console.log("Here 3");

    //         const updatedData = filteredData.map((dataset: Serie) => {
    //             console.log("The clicked legend");
    //             console.log(legend);
    //             console.log("The dataset");
    //             console.log(dataset);
    //             let data = dataset;
    //             console.log("Filtering, checking if any data is hidden", isAnyHidden);
    //             console.log("Filtering - Some items are hidden but we need to check if all items should be visible");
    //             if (data.id === legend.id) {
    //                 isFound = true;
    //                 return { ...data, hidden: false };
    //             }
    //             return { ...data, hidden: true };

    //         });

    //         // console.log("The updated data");
    //         // console.log(updatedData);
    //         setFilteredData(updatedData);
    //     }





    // };
    const visibleData = filteredData.filter((dataset) => {
        if (dataset.hidden) {
            dataset.data = []
        } else {
            timeSeriesData.filter((data) => {
                if (data.id == dataset.id) {
                    dataset.data = data.data;
                }
            });
        }

        console.log("The dataset being rendered");
        console.log(dataset);
        return dataset;
    });


    // const defaultBarLegend: BarLegendProps[] = [
    //     {
    //         dataFrom: "keys",
    //         anchor: "bottom-right",
    //         direction: "column",
    //         justify: false,
    //         translateX: 120,
    //         translateY: 0,
    //         itemsSpacing: 2,
    //         itemWidth: 100,
    //         itemHeight: 20,
    //         itemDirection: "left-to-right",
    //         itemOpacity: 0.85,
    //         symbolSize: 20,
    //     },
    // ];

    const formatTime = timeFormat("%Y-%m-%d");
    // const axisBottom: AxisProps = {
    //     tickSize: 4,
    //     tickPadding: 20,
    //     tickRotation: 0,
    //     format: (value) => formatTime(new Date(value)),
    //     legendOffset: 72,
    //     legendPosition: "middle",
    // }
    const legendProps: LegendProps[] = [{
        toggleSerie: true,
        anchor: "bottom",
        direction: "column",
        justify: false,
        translateX: 0,
        translateY: 160,
        itemsSpacing: 2,
        itemDirection: "left-to-right",
        itemWidth: 300,
        itemHeight: 20,
        symbolSize: 12,
        symbolShape: "square",
        symbolBorderColor: "rgba(0, 0, 0, .15)",
        symbolBorderWidth: 1,
        // onClick: (datatum) => handleLegendClick(datatum),
        itemOpacity: 1,
        effects: [
            {
                on: "hover",
                style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                },
            },
        ],
    }]
    return (
        <>
            <ChartTitle
                title={"Datewise Disease Detection"}
                // size="lg"
                align="left"
                classNames="mb-12 text-slate-600 text-sm uppercase"
            />
            {visibleData.length == 0 ?
                <div className="text-center text-primary-900">No data to display</div> :
                <ResponsiveLine animate
                    margin={{ top: 20, right: 20, bottom: 200, left: 60 }}
                    legends={legendProps}
                    axisBottom={{
                        format: '%b %d',
                        legend: 'time scale',
                        legendOffset: -12,
                        tickRotation: -45,
                    }}
                    // axisBottom={axisBottom}
                    axisLeft={{
                        legend: 'Diseasewise Count',
                        legendOffset: -40
                    }}
                    // curve="cardinal"
                    data={visibleData}
                    enablePointLabel
                    enableTouchCrosshair
                    //   height={400}
                    //   initialHiddenIds={[
                    //     'cognac'
                    //   ]}
                    isInteractive={true}
                    pointBorderColor={{
                        from: 'color',
                        modifiers: [
                            [
                                'darker',
                                0.3
                            ]
                        ]
                    }}
                    pointBorderWidth={1}
                    pointSize={8}
                    pointSymbol={function noRefCheck() { return <></> }}
                    useMesh={true}
                    //   width={900}
                    xFormat="time:%Y-%m-%d"
                    xScale={{
                        format: '%Y-%m-%d',
                        precision: 'day',
                        type: 'time',
                        useUTC: false
                    }}
                    onClick={(point) => {
                        console.log("Point Clicked");
                        console.log(point);
                    }}
                    tooltip={({ point }) => {
                        return (
                            <div
                                className={"rounded bg-slate-100 p-12 text-primary-900 backdrop:rounded"}
                            >
                                <div className="text-base">
                                    <strong className="font-bold">Disease: &nbsp;</strong>
                                    {point.id.split(".")[0]}
                                    <div className="capitalize">
                                        <strong className="font-bold">Count: &nbsp;</strong>
                                        {point.data.yFormatted}
                                    </div>
                                </div>
                            </div>
                        )
                    }}
                    yScale={{
                        type: 'linear'
                    }} />}
        </>
    )
}

export default memo(NCDLineGraph);