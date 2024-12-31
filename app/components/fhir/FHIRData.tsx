"use client";
import { MCISpinner } from "@components/MCISpinner";
import { EncounterSectionWrapper } from "@components/fhir/EncounterSectionWrapper";
import { ReferenceErrorLog } from "@components/fhir/ReferenceErrorLog";
import { ObservationFormItemProps } from "@components/fhir/stu3/rendering/ObservationFormItem";
import Tabs, { TabItemProps } from "@library/Tabs";
import { useLoggedInStore } from "@store/useLoggedInStore";
import { EncounterListItem } from "@utils/interfaces/DataModels/Encounter";
import { Fhir } from "fhir";
import { ConditionTable } from "fhir-ui";
import { Bundle, BundleEntry, Composition, CompositionSection, Condition, Encounter, Immunization, MedicationRequest, Observation, Resource } from "fhir/r3";
import dynamic from "next/dynamic";
import { memo, useEffect, useState } from "react";

interface FHIRDataProps {
  json: any;
  encounter: EncounterListItem;
}
const CompositionInfo = dynamic(() => import("@components/fhir/stu3/rendering/CompositionInfo"), {
  ssr: true,
});

const ConditionInfo = dynamic(() => import("@components/fhir/stu3/rendering/ConditionInfo"), {
  ssr: true,
});

const ObservationResource = dynamic(() => import("@components/fhir/stu3/rendering/ObservationResource"), {
  ssr: true,
});

const ObservationInfo = dynamic(() => import("@components/fhir/stu3/rendering/ObservationInfo"), {
  ssr: true,
});

const MedicationRequestFormItem = dynamic(() => import("@components/fhir/stu3/rendering/MedicationRequestFormItem"), {
  ssr: true,
});


const ImmunizationItems = dynamic(() => import("@components/fhir/stu3/rendering/ImmunizationItems"), {
  ssr: true,
});

const ProviderAndFacilityInfo = dynamic(() => import("@components/fhir/stu3/rendering/ProviderAndFacilityInfo"), {
  ssr: true,
});

const tabItemsNew: TabItemProps[] = [
  {
    name: "Summary",
    count: "",
    current: false,
    icon: "annotation-info",
    isDisabled: false,
  },
  {
    name: "Observations",
    count: "",
    current: false,
    icon: "alert-triangle",
    isDisabled: false,
  },
  {
    name: "Medications",
    count: "",
    current: false,
    icon: "medical-circle",
    isDisabled: false,
  },
  {
    name: "Immunization",
    count: "",
    current: true,
    icon: "check-heart",
    isDisabled: false,
  },
];

export default memo(function FHIRData({ json, encounter }: FHIRDataProps) {
  const { fhirData, setFhirData } = useLoggedInStore();
  const [fhirResource, setFhirResource] = useState<Bundle>();
  //Lazy STU3 FHIR Imports
  useEffect(() => {
    void getFhirStu3Data();
  }, []);

  const getFhirStu3Data = async (): Promise<void> => {
    if (!fhirData) {
      console.log("FHIR Data Not Found in Store");
      console.log("Getting FHIR Data");
      let [getValuesJSON, profileTypesJSON, profileResourcesJSON, fhirLib] = await Promise.all([
        import("@public/fhir3/definitions.json/valuesets.json"),
        import("@public/fhir3/definitions.json/profiles-types.json"),
        import("@public/fhir3/definitions.json/profiles-resources.json"),
        import("fhir"),
      ]);

      const ParseConformance = fhirLib.ParseConformance;
      const FhirVersionForParser = fhirLib.Versions;
      let Fhir = fhirLib.Fhir;

      let parser = new ParseConformance(false, FhirVersionForParser.STU3);
      parser.parseBundle(getValuesJSON);
      parser.parseBundle(profileTypesJSON);
      parser.parseBundle(profileResourcesJSON);
      let fhir: Fhir = new Fhir(parser);
      setFhirData(fhir);
      const fhirJson: Bundle = JSON.parse(fhir.xmlToJson(json.results));
      setFhirResource(fhirJson);
    } else {
      console.log("FHIR Data Already Exists in Store");
      const fhirJson: Bundle = JSON.parse(fhirData.xmlToJson(json.results));
      setFhirResource(fhirJson);
    }
  };

  return (fhirData != null) ?
    <RenderFhirEncounterUI selectedEncounter={encounter} fhirResource={fhirResource} /> :
    <MCISpinner classNames="max-h-[100vh] min-h-[80vh] h-full w-full flex align-center justify-center" />;
});


interface RenderFhirEncounterUIProps {
  fhirResource: any;
  selectedEncounter: EncounterListItem;
}

const RenderFhirEncounterUI = memo(function RenderFhirEncounterUI({ fhirResource, selectedEncounter }: RenderFhirEncounterUIProps) {

  if (!fhirResource || typeof fhirResource.entry !== "object") {
    return <>Resource not found in Modal</>;
  }
  console.log("isResource(fhirResource)");
  console.log(fhirResource.entry);
  console.log(fhirResource.entry.length);


  const composition: Composition[] = [];
  const encounter: Encounter[] = [];
  const medicationRequest: MedicationRequest[] = [];
  const immunization: Immunization[] = [];
  const condtions: Condition[] = [];

  let title = "";
  //Get All Observations
  const ObservationsItems: JSX.Element[] = [];
  const MedicationRequestItems: JSX.Element[] = [];
  //Get All Conditions
  const conditions: Condition[] = [];
  let otherResources: any[] = [];
  let sections: CompositionSection[] = [];
  const resources: Resource[] = [];
  const renderedUI: JSX.Element[] = [];

  fhirResource.entry.forEach((item: BundleEntry) => {
    if (item.resource) {
      if (item.resource.resourceType === "Composition") {
        composition.push(item.resource);
        title = item.resource.title ?? "No title defined in Bundle Composition";
      }
      console.log("The Resource info  is ");
      console.log(item.resource);
      if (item.resource) {
        resources.push(item.resource);
        if (item.resource.resourceType === "Observation") {
          ObservationsItems.push(<ObservationResource observation={item.resource as Observation} />);
        }
        if (item.resource.resourceType === "Encounter") {
          encounter.push(item.resource);
        }
        if (item.resource.resourceType === "MedicationRequest") {
          medicationRequest.push(item.resource);
        }
        if (item.resource.resourceType === "Condition") {
          conditions.push(item.resource);
        }
        if (item.resource.resourceType === "Immunization") {
          immunization.push(item.resource as Immunization);
        }

      }
    }
    // providerInfo = encounter.participant ? encounter.participant[0].individual?.reference ?? "":"";
  });

  if (composition.length == 1) {
    if (composition[0].section) {
      if (composition[0].section.length > 0) {
        composition[0].section.forEach((section: CompositionSection) => {
          sections.push(section);
        });
      }
    }
  }

  // console.log("resources");
  // console.log(resources);
  // console.log(resources.length);
  // console.log(composition[0].type?.coding?.at(0)?.display ?? "");
  //
  //
  // console.log("The total resources found are -- ");
  // console.log(renderedUI);
  // console.log(renderedUI.length);

  console.log(composition);
  console.log(encounter[0]);

  console.log("resources");
  console.log(resources);
  console.log(medicationRequest);
  console.log(medicationRequest)
  console.log("encounter");
  console.log(encounter[0]);



  const [tabItemToShow, setTabItemToShow] = useState(0);
  const obsHeader: ObservationFormItemProps = {
    identifier: "Identifier",
    title: "Name",
    value: "Values",
    // status: "Status",
    // performer: "Performer",
    // category: "Category",
    // isBold: true
  }
  return (
    <article className="flex flex-col space-y-12 md:space-y-16 w-full h-full">

      <div className="sticky-top top-8 z-50 mb-8 px-24">
        <EncounterSectionWrapper title={title ?? "Visit Information"} wrapperClassNames="!pb-0 mb-24">
          {composition.length == 1 ? <CompositionInfo {...composition[0]} /> : <ReferenceErrorLog error="Composition not found" />}
        </EncounterSectionWrapper>
        <Tabs align="left" tabItems={tabItemsNew} itemChanged={(e) => setTabItemToShow(e)} />
      </div>

      <div className="grid grid-cols-6 gap-4 h-full left-0 w-[100%] px-24">
        <EncounterTabSectionWrapper>
          <>
            {tabItemToShow == 0 && <ConditionInfo conditions={conditions} />}
            {/* Observations */}
            {tabItemToShow == 1 && <ObservationInfo items={ObservationsItems} obsHeader={obsHeader}/>}
            {/* Medications */}
            {tabItemToShow == 2 && <MedicationRequestFormItem medicationRequests={medicationRequest} />}
            {/* Immunization */}
            {tabItemToShow == 3 && <ImmunizationItems immunizationItems={immunization} />}
          </>
        </EncounterTabSectionWrapper>

        <div className="col-span-2 sticky top-0">{composition.length == 1 && encounter.length == 1 &&
          <ProviderAndFacilityInfo composition={composition[0]} encounter={encounter[0]} />}
        </div>
      </div>

      {/* We will print out the encounter in sequence of the sections */}
      {/* {conditions.length ? */}
      {/*   <ConditionComponent conditions={conditions} />:null} */}
      {/* {observations.length ? */}
      {/*   <ObservationComponent observations={observations} />:null} */}
    </article>
  );
});


export const ConditionComponent = memo(function ConditionComponent({ conditions }: {
  conditions: Condition[]
}) {
  return (
    <EncounterSectionWrapper title="Conditions">
      <div className={"overflow-scroll flex flex-col w-[100%]"}>
        <ConditionTable conditions={conditions} hideCode={false} hideCheckboxes={true} hideActionIcons={true} multiline={false}
          hideDevices={true} hideEncounter={true} hideBodySite={true} hideSubject={true} hideVerificationStatus={false}
          hideRecordedDate={true} />
      </div>
    </EncounterSectionWrapper>
  );
});


export const EncounterTabSectionWrapper = memo(function EncounterTabSectionWrapper({ children }: { children: JSX.Element }) {
  return (
    <div className="col-span-4 !h-full mb-[20vh] pb-[20vh]">
      {/* Create padding when on mobile screen using tailwind */}
      <div className="py-8 md:py-0"></div>
      <span className="shadow-sm hover:shadow hover:md:shadow-lg">
        {children}
      </span>
    </div>)
})