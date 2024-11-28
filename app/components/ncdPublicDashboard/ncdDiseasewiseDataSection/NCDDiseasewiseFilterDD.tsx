"use client";
import { MCISpinner } from "@components/MCISpinner";
import { DropDownSingleItemProps } from "@library/form/DropDownSingle";
import { getAPIResponse, getRevalidationTime } from "@library/utils";
import { useStore } from "@store/store";
import { getBaseUrl, getUrlFromName } from "@utils/lib/apiList";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { cn } from "tailwind-cn";

const SearchDateRangeFilter = dynamic(
    () => import("@components/publicDashboard/sectionFilterSegment/SearchDateRangeFilter"), {
    ssr: true,
})


const DropDownSingle = dynamic(
    () => import("@library/form/DropDownSingle"), {
    ssr: true,
})


export default function NCDDiseasewiseFilterDD() {
    const { ncdDiseaseSelected, ncdDiseaseDDItems, setNcdDiseaseDDItems, setNcdDiseaseSelected } = useStore();

    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

    useEffect(() => {
        const getDiseaseList = async () => {
            const diseaseList: DropDownSingleItemProps[] = await getAPIResponse(
                getBaseUrl(),
                getUrlFromName("get-ncd-disease-list"),
                "",
                "GET",
                null,
                false,
                getRevalidationTime(),
            );
            setNcdDiseaseDDItems(diseaseList);
            if(diseaseList.length > 0){
                setNcdDiseaseSelected(diseaseList[0].name.split(" - ")[0]);
                setSelectedItemIndex(0);
            }
        }
        getDiseaseList();
    }, [])

    useEffect(() => {
        console.log("The ncdDiseaseDDItems UseEffect val");
        console.log(ncdDiseaseDDItems);
    }, [ncdDiseaseDDItems])

    useEffect(() => {
        console.log("The ncdDiseaseSelected UseEffect val");
        console.log(ncdDiseaseSelected);
    }, [ncdDiseaseSelected])


    return (<Suspense fallback={<MCISpinner />} key="diseaseFilter">

        <div className="mx-auto mt-16 grid max-w-7xl gap-20 sm:grid-cols-3 lg:grid-cols-3 lg:gap-40 lg:pb-20 pb-12 shadow-sm border-slate-200 h-min-[200px]">
            <div
                className={cn(
                    "col-span-3 lg:col-span-2"
                )}
            >
                <SearchDateRangeFilter showLabel={true} renderContext={3} />
            </div>
            <div className="col-span-3 lg:col-span-1">
                <DropDownSingle size="sm" label="Filter Disease" items={ncdDiseaseDDItems} index={ncdDiseaseDDItems ? selectedItemIndex ? selectedItemIndex : 0 : null} onChange={(e: any) => {
                    console.log("DD Changed in Component");
                    console.log(e);
                    console.log(e.data);
                    if (e.data) {
                        console.log("Setting Selected Disease Name");
                        console.log(e.data.name.split(" - ")[0]);
                        let isFound = false;
                        ncdDiseaseDDItems.forEach((item, index) => {
                            if (item.name.split(" - ")[0] == e.data.name.split(" - ")[0] && !isFound) {
                                if (selectedItemIndex !== (index)) {
                                    setNcdDiseaseSelected(e.data.name.split(" - ")[0]);
                                    setSelectedItemIndex(index);
                                    isFound = true;
                                }
                            }
                        });
                    }
                }} />
            </div>
        </div>
    </Suspense>)
}
