export interface ESPatientMappingFacilityObjectSummaryInterface {
    type: string;
    properties: ESFacilitySummaryInterface;
  }
  
  export interface ESFacilitySummaryInterface {
    id: { type: "long" };
    name: { type: "keyword" };
    solutionType: { type: "keyword" };
    divisionCode: { type: "keyword" };
    districtCode: { type: "keyword" };
    upazilaCode: { type: "keyword" };
    catchment: { type: "long" };
    careLevel: { type: "keyword" };
    ownership: { type: "keyword" };
    orgType: { type: "keyword" };
  }
  