import { memo } from "react";
import { cn } from "tailwind-cn";

export interface ObservationFormItemProps {
  identifier: string;
  title: string;
  value: string;
  status?: string;
  performer?: string;
  category?: string;
  isBold?: boolean;
  referenceGroup?: string;
}
const ObservationFormItem = memo(function ObservationFormItem(props: ObservationFormItemProps) {
  if(props.title.includes("N/A")){
    return <></>;
  }
  return <>
    <div className={cn('col-span-5 text-sm text-slate-500 font-semibold border-b py-8', { '': props.isBold })}>{props.title}</div>
    <div className={cn('col-span-5 text-sm text-slate-500 border-b py-8', props.value.includes("Values") ? 'font-semibold' : '', { 'font-semibold': props.isBold })}>{props.value}</div>
    <div className={cn('col-span-2 text-sm text-slate-500 border-b py-8', { 'font-semibold': props.isBold })}>{props.status ?? ""}</div>
    {/* <div className={cn('col-span-2 text-sm text-slate-500', { 'font-semibold': props.isBold })}>{props.performer ?? ""}</div> */}
    {/* <div className={cn('col-span-2 text-sm text-slate-500', { 'font-semibold': props.isBold })}>{props.category ?? ""}</div> */}
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
