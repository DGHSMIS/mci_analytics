import { EncounterSectionWrapper } from "@components/fhir/EncounterSectionWrapper";
import FHIREmptySection from "@components/fhir/FHIREmptySection";
import { ObservationFormItemProps } from "@components/fhir/stu3/rendering/ObservationFormItem";
import { Condition } from "fhir/r3";
import { memo } from "react";
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

  return (
    <EncounterSectionWrapper title={"Conditions"}>
      <>
        {
          conditions.length == 0 ? <FHIREmptySection textToDisplay="No conditions were found"/> :
            <div className='grid grid-cols-12 border-bottom border-slate-300 py-12'>
              {conditions.map((condition, index) => {
                console.log(condition);
                // console.log(condition.code);
                // console.log(condition.code.coding);
                const conditions: ObservationFormItemProps = {
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
                    <div className={cn('col-span-12 text-sm text-slate-500 capitalize border-b py-8')}><span className={cn('inline-block font-semibold mr-4')}>{index+1}.</span> {conditions.value}</div>
                    {/* <div className={cn('col-span-2 text-sm text-slate-500 capitalize')}>{conditions.category ?? ""}</div> */}
                  </>
                )
              })}
            </div>

        }
      </>
    </EncounterSectionWrapper>
  );
})