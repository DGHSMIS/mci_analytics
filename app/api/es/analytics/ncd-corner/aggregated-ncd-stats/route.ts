import { esBaseClient } from "@providers/elasticsearch/ESBase";
import { ncdESIndex } from "@providers/elasticsearch/ncdIndex/ESPediatricNCDIndex";
import { ValidateDateAndFacilityResponseInterface } from "@utils/interfaces/DataModels/ApiRequestQueryParamInterfaces";
import { validateFormDataForNCD } from "@utils/models/Validation";
import { sendErrorMsg } from "@utils/responseHandlers/responseHandler";
import { getDateFromString, ncdDiseases, setDateByYears } from "@utils/utilityFunctions";
import { NextRequest, NextResponse } from "next/server";
import "server-only";

export const dynamic = "force-dynamic";
export const revalidate = true;
export const fetchCache = "force-no-store";
export const dynamicParams = true;

export async function GET(req: NextRequest) {
    // Validate the incoming request parameters
    const { valid, errors, results }: ValidateDateAndFacilityResponseInterface =
        await validateFormDataForNCD(req);

    if (!valid || !results) {
        return sendErrorMsg(String(errors));
    }

    console.log("The results are ");
    console.table(results);
    console.log("Is it valid? ", valid);

    const diseases = ncdDiseases;
    // Extract validated parameters
    const { dateFrom, dateTo, facilityCode } = results;

    // Build the filter clauses based on the optional parameters
    const filterClauses: any[] = [];

    // Apply date filters with defaults if not provided
    filterClauses.push({
        range: {
            date_of_visit: {
                gte: dateFrom || "1971-01-01",
                lte: dateTo || "now",
            },
        },
    });
    const lifeTimeStatsFilterClause = [...filterClauses];
    // Apply facility_code filter if provided
    if (facilityCode) {
        filterClauses.push({
            term: {
                "facility_code.keyword": facilityCode,
            },
        });
    }
    const diseaseByAgeGroup = await getDiseaseByAgeGroup(filterClauses, diseases);
    const ncdPatientsByGender = await getPatientCountByGender(filterClauses);
    const patientCountByFacility = await getPatientCountByFacility(filterClauses, diseases);
    const ncdgetTimeSeriesData = await getTimeSeriesData(filterClauses, diseases, dateFrom ?? "1971-01-01", dateTo ?? "now");
    const referralsAndFollowUpsByFacility = await getReferralsAndFollowUpsByFacility(filterClauses);
    const patientCountByServiceLocation = await getPatientCountByServiceLocation(filterClauses);
    return NextResponse.json({
        patientCountByFacility: patientCountByFacility,
        patientCountByServiceLocation: patientCountByServiceLocation,
        ncdgetTimeSeriesData: ncdgetTimeSeriesData,
        referralsAndFollowUpsByFacility: referralsAndFollowUpsByFacility,
        diseaseByAgeGroup: diseaseByAgeGroup,
        ncdPatientsByGender: ncdPatientsByGender,
    }, {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
        },
    });
}


const getDiseaseByAgeGroup = async (filterClauses: any[], diseases: string[]) => {
    // Build the Elasticsearch query
    const body = {
        size: 0,
        query: {
            bool: {
                filter: filterClauses,
            },
        },
        aggs: {
            age_ranges: {
                range: {
                    script: {
                        source: `
                        if (doc['dob'].size() > 0 && doc['date_of_visit'].size() > 0) {
                            return ChronoUnit.YEARS.between(
                            doc['dob'].value.toInstant().atZone(ZoneId.systemDefault()).toLocalDate(),
                            doc['date_of_visit'].value.toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
                            );
                        } else {
                            return null;
                        }
                        `,
                        lang: "painless",
                    },
                    ranges: [
                        { key: "0-5", from: 0, to: 6 },
                        { key: "6-9", from: 6, to: 10 },
                        { key: "10-14", from: 10, to: 15 },
                        { key: "14-17", from: 14, to: 18 },
                    ],
                },
                aggs: {
                    diseases: {
                        terms: {
                            field: "diseases_on_visit", // Use the correct field name
                            min_doc_count: 0,
                            size: diseases.length,
                            include: diseases,
                        },
                    },
                },
            },
        },
    };
    try {
        const { body: result } = await esBaseClient.search({
            index: ncdESIndex,
            body,
        });
        console.log("The result is ");
        console.table(result.aggregations.age_ranges.buckets);

        const ageGroupBuckets = result.aggregations.age_ranges.buckets;
        console.log("The disease data is ");
        console.table(ageGroupBuckets[0].diseases);
        // Initialize the output array
        const output = [];

        for (const bucket of ageGroupBuckets) {
            const ageRange = bucket.key;
            const diseaseBuckets = bucket.diseases.buckets;

            // Initialize an object for each age range
            const ageRangeData: any = {
                ageRange,
            };

            // Populate disease counts
            for (const diseaseBucket of diseaseBuckets) {
                ageRangeData[diseaseBucket.key] = diseaseBucket.doc_count;
                console.log("The disease data is ");
                console.table(diseaseBucket);
                console.table(ageRangeData);
            }
            output.push(ageRangeData);
        }

        return output;
    } catch (error) {
        console.error(error);
        return [];
    }
}

const getPatientCountByGender = async (filterClauses: any[]) => {

    // We need to add an age filter for patients under 18 at the time of visit
    const ageFilter = {
        range: {
            dob: {
                gte: setDateByYears(18),
                lte: setDateByYears(0),
            },
        },
    };

    // Include the age filter in the query
    const query = {
        bool: {
            filter: [...filterClauses, ageFilter],
        },
    };

    // Build the Elasticsearch query
    const body = {
        size: 0,
        query: query,
        aggs: {
            genders: {
                terms: {
                    field: "gender",
                    size: 10,
                    min_doc_count: 0,
                },
            },
        },
    };

    try {
        const { body: result } = await esBaseClient.search({
            index: ncdESIndex,
            body,
        });

        console.log("The results are ");
        console.table(result);
        const genderBuckets: any = result.aggregations.genders.buckets;

        // Map the results to the desired format
        const output: any[] = genderBuckets.map((bucket: any) => ({
            id: bucket.key,
            label: bucket.key,
            value: bucket.doc_count,
        }));
        console.log("output");
        console.table(result.aggregations);

        // Ensure all genders are included, even if counts are zero
        const genderList = ["Male", "Female", "Others"];
        genderList.forEach((gender) => {
            if (!output.find((item) => item.id === gender)) {
                output.push({
                    id: gender,
                    label: gender,
                    value: 0,
                });
            }
        });

        // Sort the output to maintain consistent order
        output.sort((a, b) => genderList.indexOf(a.id) - genderList.indexOf(b.id));

        return output;
    } catch (error) {
        console.error(error);
        return [];
    }
};

const getPatientCountByFacility = async (filterClauses: any[], diseases: string[]) => {

    // We need to add an age filter for patients under 18 at the time of visit
    const ageFilter = {
        range: {
            dob: {
                gte: setDateByYears(18),
                lte: setDateByYears(0),
            },
        },
    };

    // Include the age filter in the query
    const query = {
        bool: {
            filter: [...filterClauses, ageFilter],
        },
    };

    // Build the Elasticsearch query
    const body = {
        size: 0,
        query: query,
        aggs: {
            facility: {
                terms: {
                    field: "facility_name", // Use the correct field name
                },
                aggs: {
                    diseases: {
                        terms: {
                            field: "diseases_on_visit", // Use the correct field name
                            min_doc_count: 0,
                            size: diseases.length,
                            include: diseases,
                        },
                    },
                },
            },
        },
    };
    try {
        const { body: result } = await esBaseClient.search({
            index: ncdESIndex,
            body,
        });
        console.log("The result is ");
        console.table(result.aggregations.facility.buckets);

        const facilityBuckets = result.aggregations.facility.buckets;
        console.log("The facilityBuckets data is ");
        console.table(facilityBuckets[0].diseases);
        // Map the results to the desired format

        console.log("facilityBuckets output");
        console.log("The disease data is ");
        console.table(facilityBuckets[0].diseases);
        // Initialize the output array
        const output = [];

        for (const bucket of facilityBuckets) {
            const facilityItems = bucket.key;
            const diseaseBuckets = bucket.diseases.buckets;

            // Initialize an object for each age range
            const facilityItemsData: any = {
                facilityItems,
            };

            // Populate disease counts
            for (const diseaseBucket of diseaseBuckets) {
                facilityItemsData[diseaseBucket.key] = diseaseBucket.doc_count;
                console.log("The disease data is ");
                console.table(diseaseBucket);
                console.table(facilityItemsData);
            }
            output.push(facilityItemsData);
        }

        return output;
    } catch (error) {
        console.error(error);
        return [];
    }
};


const getTimeSeriesData = async (
    filterClauses: any[],
    diseases: string[],
    dateFrom: string,
    dateTo: string
) => {
    // Function to determine the appropriate interval
    const getDateInterval = (dateFrom: string, dateTo: string) => {
        const from = getDateFromString(dateFrom);

        const to = getDateFromString(dateTo);
        const diff = to.getTime() - from.getTime();
        const diffDays = diff / (1000 * 60 * 60 * 24);
        const diffMonths = diffDays / 30;
        const diffYears = diffDays / 365;

        let interval;
        if (diffMonths < 3) {
            interval = "week";
        } else if (diffYears <= 2) {
            interval = "month";
        } else {
            interval = "year";
        }
        return interval;
    };

    const interval = getDateInterval(dateFrom, dateTo);

    // Build the Elasticsearch query
    const body = {
        size: 0,
        query: {
            bool: {
                filter: filterClauses,
            },
        },
        aggs: {

            date_buckets: {
                date_histogram: {
                    field: "date_of_visit",
                    calendar_interval: interval,
                    format: "yyyy-MM-dd",
                    min_doc_count: 0,
                    extended_bounds: {
                        min: getDateFromString(dateFrom).toISOString().split('T')[0],
                        max: getDateFromString(dateTo).toISOString().split('T')[0],
                    },
                },
                aggs: {
                    diseases: {
                        terms: {
                            field: "diseases_on_visit", // Use the correct field name
                            min_doc_count: 0,
                            size: diseases.length,
                            include: diseases,
                        },
                    },
                }
            },
        },
    };

    try {
        const { body: result } = await esBaseClient.search({
            index: ncdESIndex,
            body,
        });
        console.log("The time series data is ");
        console.table(result.aggregations);
        console.log(result.aggregations.date_buckets.buckets[7].diseases.buckets);
        // console.table(result.aggregations.date_buckets.buckets[7].aggregations.diseases.buckets);
        const dateBuckets = result.aggregations.date_buckets.buckets;

        // Initialize the output object
        const diseaseSeriesMap: any = {};
        diseases.forEach((disease) => {
            diseaseSeriesMap[disease] = {
                id: disease,
                data: [],
            };
        });

        // Iterate over date buckets and populate the data
        dateBuckets.forEach((dateBucket: any) => {
            console.log("The dateBucket data is ");
            console.table(dateBucket);
            console.table(dateBucket.diseases.buckets);
            const dateKey = dateBucket.key_as_string;
            const diseaseBuckets = dateBucket.diseases.buckets;

            // Create a map for quick lookup of counts
            const diseaseCounts: any = {};
            diseaseBuckets.forEach((diseaseBucket: any) => {
                diseaseCounts[diseaseBucket.key] = diseaseBucket.doc_count;
            });

            // For each disease, add the data point
            diseases.forEach((disease) => {
                const count = diseaseCounts[disease] || 0;
                diseaseSeriesMap[disease].data.push({ x: dateKey, y: count });
            });
        });

        // Convert the diseaseSeriesMap to an array
        const output = Object.values(diseaseSeriesMap);

        return output;
    } catch (error) {
        console.error(error);
        return [];
    }
};

const getReferralsAndFollowUpsByFacility = async (filterClauses: any[]) => {
    // Build the Elasticsearch query
    const body = {
        size: 0,
        query: {
            bool: {
                filter: filterClauses,
            },
        },
        aggs: {
            facility_names: {
                terms: {
                    field: "facility_name", // Corrected field
                    size: 1000, // Adjust as needed
                },
                aggs: {
                    Referrals: {
                        filter: {
                            term: {
                                is_referred_to_higher_facility: true,
                            },
                        },
                    },
                    FollowUps: {
                        filter: {
                            term: {
                                is_follow_up: true,
                            },
                        },
                    },
                },
            },
        },
    };

    try {
        const { body: result } = await esBaseClient.search({
            index: ncdESIndex,
            body,
        });

        const facilityBuckets = result.aggregations.facility_names.buckets;
        console.log("facility data is ");
        console.log(result)
        console.log("facility aggregations are ");
        console.log(result.aggregations.facility_names.buckets);
        // Map the results to the desired format
        const output = facilityBuckets.map((bucket: any) => ({
            facility_name: bucket.key,
            Referrals: bucket.Referrals.doc_count,
            "Follow Ups": bucket.FollowUps.doc_count,
        }));

        return output;
    } catch (error) {
        console.error(error);
        return [];
    }
};


const getPatientCountByServiceLocation = async (filterClauses: any[]) => {

    // We need to add an age filter for patients under 18 at the time of visit
    const ageFilter = {
        range: {
            dob: {
                gte: setDateByYears(18),
                lte: setDateByYears(0),
            },
        },
    };

    // Include the age filter in the query
    const query = {
        bool: {
            filter: [...filterClauses, ageFilter],
        },
    };

    // Build the Elasticsearch query
    const body = {
        size: 0,
        query: query,
        aggs: {
            serviceLocation: {
                terms: {
                    field: "service_location",
                    size: 10,
                    min_doc_count: 0,
                },
            },
        },
    };

    try {
        const { body: result } = await esBaseClient.search({
            index: ncdESIndex,
            body,
        });

        console.log("The results are ");
        console.table(result);
        const seriviceLocationBuckets: any = result.aggregations.serviceLocation.buckets;

        // Map the results to the desired format
        const output: any[] = seriviceLocationBuckets.map((bucket: any) => ({
            id: bucket.key,
            label: bucket.key,
            value: bucket.doc_count,
        }));
        console.log("output");
        console.table(result.aggregations);

        // Ensure all serviceLocation are included, even if counts are zero
        const serviceLocations = ["IPD", "OPD", "Emergency"];
        serviceLocations.forEach((serviceLocation) => {
            if (!output.find((item) => item.id === serviceLocation)) {
                output.push({
                    id: serviceLocation,
                    label: serviceLocation,
                    value: 0,
                });
            }
        });

        // Sort the output to maintain consistent order
        output.sort((a, b) => serviceLocations.indexOf(a.id) - serviceLocations.indexOf(b.id));

        return output;
    } catch (error) {
        console.error(error);
        return [];
    }
};

