
export const ESFacilityMapping = {
  properties: {
    id: { type: "long" },
    name: { type: "text" },
    url: { type: "keyword" },
    createdAt: { type: "date" },
    solutionType: { type: "keyword" },
    code:{
      type: "text",
      analyzer: "autocomplete",
      search_analyzer: "standard",
      fields: {
        keyword: {
          type: "keyword",
        },
      },
    },
    active: { type: "boolean" },
    coordinates: { type: "geo_point" },
    ownership: { type: "keyword" },
    identifierAgency: {type: "keyword"},
    identifierContext: {type: "keyword"},
    identifierId: {type: "keyword"},
    orgType: { type: "keyword" },
    orgTypeId: {type: "keyword"},
    orgLevel: {type: "keyword"},
    services: {type: "text"},
    careLevel: { type: "keyword" },
    catchment: { type: "long" },
    divisionCode: { type: "short" },
    districtCode: { type: "short" },
    upazilaCode: { type: "short" },
    paurasavaCode: {type: "short"},
    unionCode: {type: "short"},
    wardCode: {type: "short"},
    contactName: {type: "text"},
    contactPhone: {
      type: "text",
      analyzer: "autocomplete",
      search_analyzer: "standard",
    },
    contactMobile: {
      type: "text",
      analyzer: "autocomplete",
      search_analyzer: "standard",
    },
    contactEmail: {
      type: "text",
      analyzer: "autocomplete",
      search_analyzer: "standard",
    },
    photo: {type: "text"},
    updatedAt: { type: "date" },
  }
}