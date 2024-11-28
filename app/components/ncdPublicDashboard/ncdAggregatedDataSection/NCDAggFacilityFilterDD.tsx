"use client";
import { MCISpinner } from "@components/MCISpinner";
import SearchDateRangeFilter from "@components/publicDashboard/sectionFilterSegment/SearchDateRangeFilter";
import Button from "@library/Button";
import DropDownSingle from "@library/form/DropDownSingle";
import { useStore } from "@store/store";
import { memo, Suspense, useState } from "react";
import { cn } from "tailwind-cn";



function NCDAggFacilityFilterDD() {
    const { ncdAggregatedFacilityDDItems, ncdAggregatedSelectedFacility, setNcdAggregatedSelectedFacility } = useStore();

    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
    // useEffect(() => {
    //     console.log("The NCDAggFacilityFilterDD UseEffect val");
    //     console.log(ncdAggregatedSelectedFacility);
    //     console.log("selectedItemIndex");
    //     console.log(selectedItemIndex);

    // }, [ncdAggregatedSelectedFacility])


    return (<Suspense fallback={<MCISpinner />} key="ada">
        <div className="mx-auto mt-16 grid max-w-7xl gap-20 sm:grid-cols-6 lg:grid-cols-6 lg:gap-40 lg:pb-20 pb-12 shadow-sm">
            <div
                className={cn(
                    "col-span-6 lg:col-span-3"
                )}
            >
                <SearchDateRangeFilter showLabel={true} renderContext={3} />
            </div>
            <div className="col-span-6 lg:col-span-3">
                <div className="grid grid-cols-5 items-center">
                    <div className="col-span-4">
                        <DropDownSingle size="sm" fontSize="text-sm" label="Filter by Facilities" items={ncdAggregatedFacilityDDItems} onChange={(e: any) => {
                            console.log("DD Changed in Component");
                            console.log(e);
                            console.log(e.data);
                            if (e.data) {
                                console.log("Setting Facility Name");
                                console.log(e.data.name.split(" - ")[0]);
                                let isFound = false;
                                ncdAggregatedFacilityDDItems.forEach((item) => {
                                    if (item.name.split(" - ")[0] == e.data.name.split(" - ")[0] && !isFound) {
                                        if (selectedItemIndex !== (item.id - 1)) {
                                            setNcdAggregatedSelectedFacility(e.data.name.split(" - ")[0]);
                                            setSelectedItemIndex(item.id - 1);
                                            isFound = true;
                                        }
                                    }
                                });
                            }
                        }} index={selectedItemIndex} />
                    </div>
                    {ncdAggregatedSelectedFacility && <Button size="sm" outline={false} variant="link" className="col-span-1 mt-20" btnText="Clear" clicked={() => {
                        console.log("Clearing facility filter");
                        setNcdAggregatedSelectedFacility("");
                        setSelectedItemIndex(null);
                    }} />
                    }
                </div>
            </div>
        </div>
    </Suspense>)
}

export default memo(NCDAggFacilityFilterDD);