import { esBaseClient } from "@providers/elasticsearch/ESBase";
import { ncdESIndex } from "@providers/elasticsearch/ncdIndex/ESPediatricNCDIndex";
import { ValidateDateAndFacilityResponseInterface } from "@utils/interfaces/DataModels/ApiRequestQueryParamInterfaces";
import { validateFormDataForNCD } from "@utils/models/Validation";
import { sendErrorMsg } from "@utils/responseHandlers/responseHandler";
import { getDateFromString, ncdDiseases, setDateByYears } from "@utils/utilityFunctions";
import { NextRequest, NextResponse } from "next/server";
import "server-only";

// export const dynamic = "force-dynamic";
export const revalidate = process.env.NODE_ENV === "development" ? 0 : 7200;
export const fetchCache = "auto";
export const dynamicParams = false;

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
    const { dateFrom, dateTo, diseaseCode } = results;

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
    // Apply facility_code filter if provided

    filterClauses.push({
        term: {
            "diseases_on_visit": diseaseCode ?? "Bronchial Asthma",
        },
    });
    // We need to add an age filter for patients under 18 at the time of visit
    const ageFilter = {
        range: {
            dob: {
                gte: setDateByYears(18),
                lte: setDateByYears(0),
            },
        },
    };
    filterClauses.push(ageFilter);
    console.log("The disease code is ", diseaseCode);
    const ageGroup = await getDiseaseDistributionByAgeGroup(filterClauses, diseaseCode ?? "Bronchial Asthma");
    const serviceLocationGroup = await getDiseaseServiceLocationDistribution(filterClauses);
    const facilityGroup = await getDiseaseDistributionByFacility(filterClauses, diseaseCode ?? "Bronchial Asthma");
    const timeSeriesData = await getTimeSeriesData(filterClauses, diseaseCode ?? "Bronchial Asthma", dateFrom || "1971-01-01", dateTo || "now");
    const diseasewiseReferralsAndFollowUps = await getReferralsAndFollowUpsByFacility(filterClauses);
    const totalPatients = await getDiseasewiseAggPatients(filterClauses);
    return NextResponse.json({
        totalPatients: String(totalPatients),
        ageGroup: ageGroup,
        serviceLocationGroup: serviceLocationGroup,
        facilityGroup: facilityGroup,
        timeSeriesData: timeSeriesData,
        referralsAndFollowUps: diseasewiseReferralsAndFollowUps,
    }, {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
        },
    });
}

const getDiseaseDistributionByAgeGroup = async (filterClauses: any[], diseaseCode: string) => {
    const body = {
        size: 0,
        query: {
            bool: {
                filter: [...filterClauses],
            },
        },

        aggs: {
            age_ranges: {
                range: {
                    script: {
                        source: `
                            if (doc['dob'].size() == 0 || doc['date_of_visit'].size() == 0) {
                                return 0;
                            }
                            int birthYear = doc['dob'].value.getYear();
                            int visitYear = doc['date_of_visit'].value.getYear();
                            int birthMonth = doc['dob'].value.getMonthValue();
                            int visitMonth = doc['date_of_visit'].value.getMonthValue();
                            int birthDay = doc['dob'].value.getDayOfMonth();
                            int visitDay = doc['date_of_visit'].value.getDayOfMonth();

                            int age = visitYear - birthYear;
                            if (visitMonth < birthMonth || (visitMonth == birthMonth && visitDay < birthDay)) {
                                age -= 1;
                            }
                            return age;
                        `,
                        lang: "painless",
                    },
                    ranges: [
                        { key: "0-3", from: 0, to: 4 },
                        { key: "4-6", from: 4, to: 7 },
                        { key: "7-10", from: 7, to: 11 },
                        { key: "11-14", from: 11, to: 15 },
                        { key: "15-17", from: 15, to: 18 },
                    ],
                }
            }
        },
    };

    console.log("The body is ");
    console.table(body);
    try {
        const { body: result } = await esBaseClient.search({
            index: ncdESIndex,
            body,
        });

        console.log("The result is ");
        console.table(result.aggregations.age_ranges);
        console.log(result.aggregations.age_ranges.buckets);
        const diseaseName = diseaseCode;
        const ageGroupBuckets = result.aggregations.age_ranges.buckets;
        console.table(ageGroupBuckets);
        // console.log(result);
        // console.table(result.hits);
        console.table(ageGroupBuckets);

        // // Initialize the output array
        const output: any[] = [];

        for (const bucket of ageGroupBuckets) {
            const ageRange = bucket.key;
            // For this specific disease, the doc_count represents the number of documents in this age range
            const docCount = bucket.doc_count;

            // Initialize an object for each age range
            const ageRangeData: any = {
                ageRange,
            };
            ageRangeData[diseaseName] = docCount;

            output.push(ageRangeData);
        }
        return output;
    } catch (error) {
        console.error(error);
        return [];
    }
};


const getDiseaseServiceLocationDistribution = async (filterClauses: any[]) => {

    // Include the age filter in the query
    const query = {
        bool: {
            filter: [...filterClauses],
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

const getDiseaseDistributionByFacility = async (filterClauses: any[], diseaseCode: string) => {

    // Include the age filter in the query
    const query = {
        bool: {
            filter: [...filterClauses],
        },
    };

    // Build the Elasticsearch query
    const body = {
        size: 0,
        query: query,
        aggs: {
            facility_names: {
                terms: {
                    field: "facility_name",
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
        const seriviceLocationBuckets: any = result.aggregations.facility_names.buckets;
        console.table(seriviceLocationBuckets);
        // Map the results to the desired format
        const output: any[] = seriviceLocationBuckets.map((bucket: any) =>
        (
            {
                facility_name: bucket.key,
                [diseaseCode]: bucket.doc_count,
            })
        );
        console.log("output");
        console.table(output);



        // Sort the output to maintain consistent order
        // output.sort((a, b) => facility_names.indexOf(a.id) - facility_names.indexOf(b.id));

        return output;
    } catch (error) {
        console.error(error);
        return [];
    }
};


const getTimeSeriesData = async (
    filterClauses: any[],
    diseaseCode: string,
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
        console.log(result.aggregations.date_buckets.buckets);
        // console.table(result.aggregations.date_buckets.buckets[7].aggregations.diseases.buckets);
        const dateBuckets = result.aggregations.date_buckets.buckets;

        // Initialize the output object
        const diseaseSeriesMap: any = {};
        const diseases = [diseaseCode];
        diseases.forEach((disease) => {
            diseaseSeriesMap[disease] = {
                id: disease,
                data: [],
            };
        });

        // Iterate over date buckets and populate the data
        dateBuckets.forEach((dateBucket: any) => {
            console.log("The dateBucket data is ");
            console.table(dateBucket.doc_count);
            console.log(dateBucket);
            const dateKey = dateBucket.key_as_string;
            const diseaseBuckets = dateBucket.doc_count;
            const diseases = [diseaseCode];
            // Create a map for quick lookup of counts
            const diseaseCounts: any = {};
            // diseaseBuckets.forEach((diseaseBucket: any) => {
            //     diseaseCounts[diseaseBucket.key] = diseaseBucket.doc_count;
            // });
            diseaseCounts[diseaseCode] = dateBucket.doc_count;
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


const getDiseasewiseAggPatients = async (filterClauses: any[]) => {
    const body = {
        size: 0,
        query: {
            bool: {
                filter: [...filterClauses],
            },
        },
        aggs: {
            document_count: {
              cardinality: {
                field: "patient_id.keyword",
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
        console.table(result.aggregations.document_count.value);
        return result.aggregations.document_count.value;
    } catch (error) {
        console.error(error);
        return 0;
    }
}