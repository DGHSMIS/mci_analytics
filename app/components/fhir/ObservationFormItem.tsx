import React, { memo } from "react";
import { EncounterSectionWrapper } from "@components/fhir/EncounterSectionWrapper";
import { cn } from "tailwind-cn";

export interface ObservationFormItemProps {
  identifier: string;
  title: string;
  value: string;
  status?: string;
  performer?: string;
  category?: string;
  isBold?: boolean;
}
const ObservationFormItem = memo(function ObservationFormItem(props: ObservationFormItemProps) {

  return <>
    <div className={cn('col-span-5 text-sm text-slate-500 font-bold', { '': props.isBold })}>{props.title}</div>
    <div className={cn('col-span-5 text-sm text-slate-500', { 'font-bold': props.isBold })}>{props.value}</div>
    <div className={cn('col-span-2 text-sm text-slate-500', { 'font-bold': props.isBold })}>{props.status ?? ""}</div>
    {/* <div className={cn('col-span-2 text-sm text-slate-500', { 'font-bold': props.isBold })}>{props.performer ?? ""}</div> */}
    {/* <div className={cn('col-span-2 text-sm text-slate-500', { 'font-bold': props.isBold })}>{props.category ?? ""}</div> */}
  </>
})
export default ObservationFormItem;

export const observationHeader: ObservationFormItemProps = {
  identifier: "Identifier",
  title: "Name",
  value: "Values",
  status: "Status",
  performer: "Performer",
  category: "Category",
  isBold: true
}
export const ObservationSectionWrapper = memo(function ObservationSectionWrapper({header, title, children}: { header:ObservationFormItemProps, title?:string, children: any }) {
  return (<EncounterSectionWrapper title={title ?? "Observations"}>
    <div className='grid grid-cols-12 gap-x-4 gap-y-12 border-bottom border-slate-300 py-12'>
      <ObservationFormItem {...header} />
      {children}
    </div>
  </EncounterSectionWrapper>)
});