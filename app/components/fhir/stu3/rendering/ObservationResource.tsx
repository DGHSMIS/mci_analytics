import { ReferenceErrorLog } from "@components/fhir/ReferenceErrorLog";
import ObservationFormItem, { ObservationFormItemProps } from "@components/fhir/stu3/rendering/ObservationFormItem";
import { Observation } from "fhir/r3";
import { memo } from "react";


interface ObservationResourceProps {
  observation: Observation;
  referenceGroup?: string;
}

export default memo(function ObservationResource({ observation, referenceGroup }: ObservationResourceProps) {
  if (!observation) {
    return <ReferenceErrorLog error="No observation found" />;
  }

  const renderValue = (item:Observation) => {
    if (item.valueQuantity) {
      return (item.valueQuantity.value ?? "No Qty Found") + " " + (item.valueQuantity.unit ?? "");

    } else if (item.valueCodeableConcept) {
      return item.valueCodeableConcept.coding?.[0]?.display ?? "N/A";
    }
    else{
      return "N/A";
    }
  };

  const renderPerformer = (item:Observation) => {
    if (item.performer) {
      return item.performer[0]?.display ?? "No Display Found";
    }
    return "N/A";
  };

  const renderStatus = (item:Observation) => {
    if (item.status) {
      return item.status;
    }
    return "N/A";
  }


  const renderTime = (item:Observation) => {
    if (item.effectiveDateTime) {
      return item.effectiveDateTime;
    }
    return "N/A";
  }

  const ObservationObject: ObservationFormItemProps= {
    identifier: observation.identifier?.at(0)?.value|| "N/A",
    title: observation.code?.coding?.[0]?.display || "Observation",
    value: renderValue(observation),
    // performer: renderPerformer(observation),
    // status: renderStatus(observation),
    // category: observation.code?.coding?.[0]?.code || "N/A",
    referenceGroup: referenceGroup
  }
  if(ObservationObject.title == "N/A" || ObservationObject.value == "N/A"){
    return <></>
  }
  return (
      <ObservationFormItem {...ObservationObject} />
  );
});
