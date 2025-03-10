import { RankListProps } from "@components/globals/RankList/RankListProps";
import { getRevalidationTime } from "@library/utils";
import { getEncountersByFacilities } from "@utils/esQueries/encounterIndex/aggQueriesForEncounterStats";
import { ValidateDateAndDivisionResponseInterface } from "@utils/interfaces/DataModels/ApiRequestQueryParamInterfaces";
import { validateFormData } from "@utils/models/Validation";
import { sendErrorMsg, sendSuccess } from "@utils/responseHandlers/responseHandler";
import { NextRequest } from "next/server";
import "server-only";

// export const dynamic = "force-dynamic";
export const revalidate = process.env.NODE_ENV === "development" ? 0 : getRevalidationTime(true);
export const fetchCache = "auto";
export const dynamicParams = false;



/**
 * Reindex All Data from Cassandra to Elasticsearch
 * @param req
 * @param res
 * @returns
 */
export async function GET(req: NextRequest) {

    const { valid, errors, results }: ValidateDateAndDivisionResponseInterface =
        await validateFormData(req, false, false);
    console.log("The results are ");
    console.table(results);
    console.table(valid);
    if (!valid || !results) {
        console.log("The errors are ");
        console.log(errors);
        return sendErrorMsg(String(errors));
    }

    // Get Stats
    const getEncountersByFacilitiesResult:RankListProps = await getEncountersByFacilities(results.dateFrom, results.dateTo);

    return sendSuccess(getEncountersByFacilitiesResult);
}


