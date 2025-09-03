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
  const observations: Observation[] = [];
  let otherResources: any[] = [];
  let sections: CompositionSection[] = [];
  const resources: Resource[] = [];
  const renderedUI: JSX.Element[] = [];
  
  // For grouping observations by reference
  const groupedObservations: { [key: string]: Observation[] } = {};

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
          let obs = item.resource as Observation;
          observations.push(obs);
          // We'll add ObservationItems after grouping them
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


  // Process composition sections to identify observation groups
  let observationGroups: { [key: string]: string } = {};
  
  if (composition.length > 0 && composition[0].section) {
    composition[0].section.forEach((section: CompositionSection) => {
      if (section.entry) {
        section.entry.forEach(entry => {
          // Extract the resource ID from the reference
          const refParts = entry.reference?.split('/');
          if (refParts && refParts.length > 1) {
            const resourceType = refParts[0];
            const resourceId = refParts[1];
            
            if (resourceType === 'Observation') {
              // Store the section title for this observation ID
              observationGroups[resourceId] = section.title || 'Other Observations';
            }
          }
        });
      }
    });
  }
  
  // Create a map of observation IDs to their full URIs for reference lookup
  const observationIdMap: { [key: string]: string } = {};
  // Create a map to track parent-child relationships between observations
  const parentChildMap: { [key: string]: string[] } = {};
  
  // First pass: build the ID maps
  observations.forEach((obs: Observation) => {
    // Get the observation identifier (URI)
    const obsIdentifier = obs.identifier?.[0]?.value;
    const obsId = obs.id;
    
    if (obsIdentifier) {
      // Map the ID to the full identifier URI
      if (obsId) {
        observationIdMap[obsId] = obsIdentifier;
      }
      
      // Check if this observation has related observations (parent)
      if (obs.related && obs.related.length > 0) {
        // This is a parent observation that references other observations
        parentChildMap[obsIdentifier] = [];
        
        // Add all child references
        obs.related.forEach(related => {
          if (related.type === 'has-member' && related.target && related.target.reference) {
            parentChildMap[obsIdentifier].push(related.target.reference);
          }
        });
      }
    }
  });
  
  // Second pass: group observations based on parent-child relationships
  observations.forEach((obs: Observation) => {
    // Get the observation identifier (URI)
    const obsIdentifier = obs.identifier?.[0]?.value;
    const obsId = obs.id;
    
    // Determine which group this observation belongs to
    let groupName = 'Other Observations';
    let isChildObservation = false;
    
    // Check if this observation is a child of another observation
    if (obsIdentifier) {
      for (const parentId in parentChildMap) {
        if (parentChildMap[parentId].includes(obsIdentifier)) {
          // This observation is a child - find the parent observation
          const parentObs = observations.find(o => o.identifier?.[0]?.value === parentId);
          if (parentObs && parentObs.code?.coding?.[0]?.display) {
            groupName = parentObs.code.coding[0].display;
            isChildObservation = true;
            break;
          }
        }
      }
    }
    
    // If not a child, check if it's in a section or has a category
    if (!isChildObservation) {
      if (obsId && observationGroups[obsId]) {
        groupName = observationGroups[obsId];
      } else if (obs.category && obs.category.length > 0 && obs.category[0].coding && obs.category[0].coding.length > 0) {
        // If not found in sections, try to use the category
        groupName = obs.category[0].coding[0].display || 'Other Observations';
      } else if (obs.code?.coding?.[0]?.display && obsIdentifier && parentChildMap[obsIdentifier]) {
        // This is a parent observation with children, use its display name
        groupName = obs.code.coding[0].display;
      }
    }
    
    // Skip parent observations in the main list if they don't have their own values
    // They'll be represented by their group name instead
    if (obsIdentifier && parentChildMap[obsIdentifier] && !obs.valueQuantity && !obs.valueCodeableConcept) {
      return;
    }
    
    // Initialize the group if it doesn't exist
    if (!groupedObservations[groupName]) {
      groupedObservations[groupName] = [];
    }
    
    // Add the observation to its group
    groupedObservations[groupName].push(obs);
    
    // Create the ObservationResource element with the reference group
    ObservationsItems.push(<ObservationResource observation={obs} referenceGroup={groupName} />);
  });
  
  // Create grouped observation items for the ObservationInfo component
  const groupedObservationItems = Object.keys(groupedObservations).map(groupName => {
    const groupItems = groupedObservations[groupName].map(obs => 
      <ObservationResource observation={obs} referenceGroup={groupName} />
    );
    
    return {
      groupName,
      items: groupItems
    };
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
            {tabItemToShow == 1 && <ObservationInfo items={ObservationsItems} groupedItems={groupedObservationItems} obsHeader={obsHeader}/>}
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