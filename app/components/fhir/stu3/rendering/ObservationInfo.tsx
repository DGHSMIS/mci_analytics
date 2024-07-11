import { EncounterSectionWrapper } from "@components/fhir/EncounterSectionWrapper";
import FHIREmptySection from "@components/fhir/FHIREmptySection";
import { memo } from "react";
import ObservationFormItem, { ObservationFormItemProps } from "./ObservationFormItem";

export interface ObservationInfoProps {
    items: JSX.Element[];
    title?: string;
    obsHeader: ObservationFormItemProps;
}
export default memo(function ObservationInfo({ items, title = "Observations", obsHeader }: ObservationInfoProps) {

    return (
        <EncounterSectionWrapper title={title ?? "Observations"}>
            {items.length == 0 ? <FHIREmptySection textToDisplay="No observations were found"/> :
                <ObservationSectionWrapper header={obsHeader} title={title}>
                    {
                        items.map((item: JSX.Element, index: number) => {
                            return item;
                        })
                    }
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