import React, { memo } from "react";
import { Condition } from "fhir/r3";
import { EncounterSectionWrapper } from "@components/fhir/EncounterSectionWrapper";
import { ObservationFormItemProps } from "@components/fhir/ObservationFormItem";
import { cn } from "tailwind-cn";

interface ConditionInfoProps {
  conditions: Condition[];
}

export default memo(function ConditionInfo({ conditions }: ConditionInfoProps) {
  console.log("condition");
  console.log(conditions);
  const CondtionHeader: ObservationFormItemProps = {
    identifier: "Identifier",
    title: "Condition",
    value: "Values",
    category: "Category",
    // performer: "Performer",
    // category: "Category",
    isBold: true
  }
  if (conditions.length === 0) return <></>;
  // <EncounterSectionWrapper title={title ?? "Observations"}>
  //   <div className='grid grid-cols-12 gap-x-4 gap-y-12 border-bottom border-slate-300 py-12'>
  //     <ObservationFormItem {...header} />
  //     {children}
  //   </div>
  // </EncounterSectionWrapper>
  return (
    <EncounterSectionWrapper title={"Conditions"}>
      <div className='grid grid-cols-12 gap-x-4 gap-y-12 border-bottom border-slate-300 py-12'>
        {/* <> */}
        {/*   <div className={cn('col-span-2 text-sm text-slate-500 capitalize font-bold')}>Condition</div> */}
        {/*   <div className={cn('col-span-4 text-sm text-slate-500 capitalize font-bold')}>Value</div> */}
        {/*   <div className={cn('col-span-2 text-sm text-slate-500 capitalize font-bold')}>Category</div> */}
        {/* </> */}
     {
       conditions.length == 0 ? <>No Conditions were found</> :
       conditions.map((condition, index) => {
         console.log(condition);
         // console.log(condition.code);
         // console.log(condition.code.coding);
         const conditions: ObservationFormItemProps= {
           identifier: condition.id ?? "",
           title: condition.code?.coding?.at(0)?.display ? condition.code?.coding?.at(0)?.display ?? "" : "N/A",
           value: condition.code?.coding?.[0]?.display ? condition.code?.coding?.[0]?.display ?? "" : "N/A",
           category: condition.category?.[0]?.coding?.at(0)?.code ?? "N/A",
           // performer: renderPerformer(observation),
           // status: renderStatus(observation),
           // category: observation.code?.coding?.[0]?.code || "N/A",
         }
         console.log("Conditions Value");
         console.log(conditions);
          return (
            <>
              <div className={cn('col-span-2 text-sm text-slate-500 capitalize')}>Condition</div>
              <div className={cn('col-span-10 text-sm text-slate-500 capitalize')}>{conditions.value}</div>
              {/* <div className={cn('col-span-2 text-sm text-slate-500 capitalize')}>{conditions.category ?? ""}</div> */}
            </>
          )
       })
     }
      </div>
   </EncounterSectionWrapper>
  );
})