import { EncounterSectionWrapper } from "@components/fhir/EncounterSectionWrapper";
import FHIREmptySection from "@components/fhir/FHIREmptySection";
import { memo } from "react";
import ObservationFormItem, { ObservationFormItemProps } from "./ObservationFormItem";

export interface GroupedObservations {
    groupName: string;
    items: JSX.Element[];
}

export interface ObservationInfoProps {
    items: JSX.Element[];
    groupedItems?: GroupedObservations[];
    title?: string;
    obsHeader: ObservationFormItemProps;
}

export default memo(function ObservationInfo({ 
    items, 
    groupedItems, 
    title = "Observations", 
    obsHeader 
}: ObservationInfoProps) {
    console.log("Rendering ObservationInfo with items:", items);
    console.log("Rendering ObservationInfo with grouped items:", groupedItems);
    
    // If we have grouped items, render them by group
    if (groupedItems && groupedItems.length > 0) {
        return (
            <EncounterSectionWrapper title={title ?? "Observations"}>
                {groupedItems.map((group, groupIndex) => (
                    <div key={groupIndex} className="mb-6">
                        <h4 className="text-md font-medium mb-2">{group.groupName}</h4>
                        {group.items.length === 0 ? (
                            <FHIREmptySection textToDisplay={`No observations found in ${group.groupName}`}/>
                        ) : (
                            <ObservationSectionWrapper header={obsHeader} title={group.groupName}>
                                {group.items.map((item: JSX.Element, index: number) => item)}
                            </ObservationSectionWrapper>
                        )}
                    </div>
                ))}
            </EncounterSectionWrapper>
        );
    }
    
    // Otherwise, render the flat list as before
    return (
        <EncounterSectionWrapper title={title ?? "Observations"}>
            {items.length == 0 ? <FHIREmptySection textToDisplay="No observations were found"/> :
                <ObservationSectionWrapper header={obsHeader} title={title}>
                    {items.map((item: JSX.Element, index: number) => item)}
                </ObservationSectionWrapper>
            }
        </EncounterSectionWrapper>
    );
});

export const ObservationSectionWrapper = memo(function ObservationSectionWrapper({ header, title, children }: { header: ObservationFormItemProps, title?: string, children: any }) {
    return (
        <div className='grid grid-cols-12 border-bottom border-slate-300 py-12'>
            <ObservationFormItem {...header} />
            {children}
        </div>
    )
});