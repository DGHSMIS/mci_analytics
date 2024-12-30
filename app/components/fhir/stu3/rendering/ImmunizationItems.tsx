import { EncounterSectionWrapper } from "@components/fhir/EncounterSectionWrapper";
import { Immunization } from "fhir/r3";
import { memo } from "react";
import { cn } from "tailwind-cn";
import FHIREmptySection from "../../FHIREmptySection";


interface ImmunizationProps {
  immunizationItems: Immunization[];
}

const ImmunizationItems = memo(function ImmunizationItems({ immunizationItems }: ImmunizationProps) {
  console.log("immunization requests");
  console.log(immunizationItems);

  return (
    <EncounterSectionWrapper title={"Immunizations"}>
      <>

        {/* <> */}
        {/*   <div className={cn('col-span-2 text-sm text-slate-500 capitalize font-bold')}>Condition</div> */}
        {/*   <div className={cn('col-span-4 text-sm text-slate-500 capitalize font-bold')}>Value</div> */}
        {/*   <div className={cn('col-span-2 text-sm text-slate-500 capitalize font-bold')}>Category</div> */}
        {/* </> */}
        {
          immunizationItems.length == 0 ? <FHIREmptySection textToDisplay="No medications were found" /> :
            <div className='grid grid-cols-12 border-bottom border-slate-300 py-12'>
              {immunizationItems.map((immunization, index) => {
                console.log(immunization);
                console.log(immunization.vaccineCode.text);
                // console.log(medicationReqs.code.coding);

                let doseQuantity = "";
                let doseCode = "";
                if(immunization.doseQuantity){
                    if(immunization.doseQuantity.value){
                        doseQuantity = String(immunization.doseQuantity.value);
                    } 
                    if(immunization.doseQuantity.code){
                        doseCode = immunization.doseQuantity.code;
                    }
                }
                return (
                  <>
                  <div className={cn('col-span-12 text-sm text-slate-500 capitalize border-b py-8')}><span className={cn('inline-block font-semibold mr-4')}>{index+1}.</span>
                  Vaccine Code:  {immunization.vaccineCode.text ?? immunization.vaccineCode.text} <br />
                  Dose Quantity:  {doseQuantity} {doseCode} <br />
                  Date:  {immunization.date ? immunization.date : "Not found"} <br />
                  Status:  {immunization.status} <br /> 
                  </div>
                  </>
                )
              })}
            </div>
        }

      </>
    </EncounterSectionWrapper>
  );
})

export default ImmunizationItems;