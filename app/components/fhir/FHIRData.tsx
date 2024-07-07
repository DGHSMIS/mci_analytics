"use client";
import { MCISpinner } from "@components/MCISpinner";
// import ConditionInfo from "@components/fhir/ConditionInfo";
import { EncounterSectionWrapper } from "@components/fhir/EncounterSectionWrapper";
import { MedicationRequestFormItem } from "@components/fhir/MedicationRequestFormItem";
import { ObservationFormItemProps, ObservationSectionWrapper } from "@components/fhir/ObservationFormItem";
import { ReferenceErrorLog } from "@components/fhir/ReferenceErrorLog";
import ObservationResource from "@components/fhir/stu3/rendering/ObservationResource";
import ProviderAndFacilityInfo from "@components/fhir/stu3/rendering/ProviderAndFacilityInfo";
import Tabs, { TabItemProps } from "@library/Tabs";
import { useStore } from "@store/store";
import { EncounterListItem } from "@utils/interfaces/Encounter/Encounter";
import { ConditionTable } from "fhir-ui";
import { Bundle, BundleEntry, Composition, CompositionSection, Condition, Encounter, MedicationRequest, Observation, Resource } from "fhir/r3";
import dynamic from "next/dynamic";
import { memo, useEffect, useState } from "react";

interface FHIRDataProps {
  json: any;
  encounter: EncounterListItem;
}
const CompositionInfo = dynamic(() => import("@components/fhir/CompositionInfo"), {
  ssr: true,
});

const ConditionInfo = dynamic(() => import("@components/fhir/ConditionInfo"), {
  ssr: true,
});


// Development-only imports
let devImports: any = null;
if (process.env.NODE_ENV==="development") {
  devImports = Promise.all([
    import("@public/fhir3/definitions.json/valuesets.json"),
    import("@public/fhir3/definitions.json/profiles-types.json"),
    import("@public/fhir3/definitions.json/profiles-resources.json"),
    import("fhir"),
  ]);
}

export default memo(function FHIRData({ json, encounter }: FHIRDataProps) {
  // const [fhirItem, setFhirItem] = useState<Bundle>();
  const { fhirData, setFhirData } = useStore();
  //Lazy STU3 FHIR Imports
  useEffect(() => {
    if (!fhirData) {
      console.log("FHIR Data Not Found in Store");
      void getFhirStu3Data();
    } else{
      console.log("FHIR Data Already Exists in Store");
    }
  }, []);

  const getFhirStu3Data = async (): Promise<void> => {
    console.log("Getting FHIR Data");
    let [getValuesJSON, profileTypesJSON, profileResourcesJSON, fhirLib] = process.env.NODE_ENV==="development"
      ? await devImports
      :await Promise.all([
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
    let fhir = new Fhir(parser);
    const fhirJson: Bundle = JSON.parse(fhir.xmlToJson(json.results));
    setFhirData(fhirJson);
  };

  return (fhirData!=null) ?
    <RenderFhirEncounterUI selectedEncounter={encounter} fhirResource={fhirData} />:
    <MCISpinner classNames="max-h-[100vh] min-h-[80vh] h-full w-full flex align-center justify-center" />;
});


interface RenderFhirEncounterUIProps {
  fhirResource: any;
  selectedEncounter: EncounterListItem;
}

const RenderFhirEncounterUI = memo(function RenderFhirEncounterUI({ fhirResource, selectedEncounter }: RenderFhirEncounterUIProps) {

  if (!fhirResource || typeof fhirResource.entry!=="object") {
    return <>Resource not found in Modal</>;
  }
  console.log("isResource(fhirResource)");
  console.log(fhirResource.entry);
  console.log(fhirResource.entry.length);


  const composition: Composition[] = [];
  const encounter: Encounter[] = [];
  const medicationRequest: MedicationRequest[] = [];
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
      if (item.resource.resourceType==="Composition") {
        composition.push(item.resource);
        title = item.resource.title ?? "No title defined in Bundle Composition";
      }
      console.log("The Resource info  is ");
      console.log(item.resource);
      if (item.resource) {
        resources.push(item.resource);
        if (item.resource.resourceType==="Observation") {
          ObservationsItems.push(<ObservationResource observation={item.resource as Observation} />);
        }
        if (item.resource.resourceType==="Encounter") {
          encounter.push(item.resource);
        }
        if(item.resource.resourceType==="MedicationRequest"){
          medicationRequest.push(item.resource);
        }
        if(item.resource.resourceType==="Condition"){
          conditions.push(item.resource);
        }
      }
    }
    // providerInfo = encounter.participant ? encounter.participant[0].individual?.reference ?? "":"";
  });

  if (composition.length==1) {
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

    const tabItemsNew: TabItemProps[] = [
      {
        name: "Summary",
        count: "",
        current: false,
        icon: "medical-circle",
        isDisabled: false,
      },
      {
        name: "Diagnosis",
        count: "",
        current: true,
        icon: "info-circle",
        isDisabled: false,
      },
      {
        name: "Medications",
        count: "",
        current: false,
        icon: "map-01",
        isDisabled: false,
      },
      // {
      //   name: "Care Plan",
      //   count: "",
      //   current: false,
      //   icon: "map-01",
      //   isDisabled: false,
      // },
    ];

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
      <article className="flex flex-col space-y-12 md:space-y-16">
        <div className="sticky-top top-8 h-[25vh] z-50">
          <h4 className="capitalize flex space-y-8 w-full">{title}</h4> <p
          className="flex text-sm text-gray-500">{composition[0]?.type?.coding?.at(0)?.display ? composition[0].type.coding.at(0)?.display:""}</p>
          <hr />
          {composition.length==1 ? <CompositionInfo {...composition[0]} />:<ReferenceErrorLog error="Composition not found" />}

          <Tabs align="left" tabItems={tabItemsNew} itemChanged={(e) => setTabItemToShow(e)} />
        </div>

        <div className="grid grid-cols-6 gap-4 h-full top-[30vh] absolute left-0 w-[100%] px-24">
          <div className="col-span-4 !overflow-y-scroll !h-full mb-[20vh] pb-[20vh]">

            {/* Create padding when on mobile screen using tailwind */}
            <div className="py-8 md:py-0"></div>
            <span className=" shadow-sm hover:shadow hover:md:shadow-lg">
              {tabItemToShow==0 && <ConditionInfo conditions={conditions}/>}
              {tabItemToShow==1 && <>

                <ObservationSectionWrapper header={obsHeader}>
                {
                  ObservationsItems.map((item: JSX.Element, index: number) => {
                    return item;
                  })
                }
                </ObservationSectionWrapper>
              </>}
              {tabItemToShow==2 && <>{medicationRequest.length >0 && <MedicationRequestFormItem medicationRequests={medicationRequest} />}</>}
            </span>
          </div>

          <div className="col-span-2 sticky top-0">{composition.length==1 && encounter.length==1 &&
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
        {conditions.length ?
          <ConditionTable conditions={conditions} hideCode={false} hideCheckboxes={true} hideActionIcons={true} multiline={false}
                          hideDevices={true} hideEncounter={true} hideBodySite={true} hideSubject={true} hideVerificationStatus={false}
                          hideRecordedDate={true} />:
          <SectionNoItems />
        }
      </div>
    </EncounterSectionWrapper>
  );
});


const SectionNoItems = memo(function SectionNoItems() {
  return (
    <div className="flex flex-col space-y-4">
      <h6>No Items Found</h6>
      <hr />
    </div>
  );
});