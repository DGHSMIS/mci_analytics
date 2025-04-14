import { DropDownSingleItemProps } from "@library/form/DropDownSingle";
import prismaPostGresClient from '@api/providers/prisma/postgres/prismaPostGresClient';
import { sendSuccess } from "@utils/responseHandlers/responseHandler";
import { NextRequest } from "next/server";

// export const dynamic = "force-dynamic";

export const revalidate = process.env.NODE_ENV === "development" ? 0 : 7200;
export const fetchCache = "auto";
export const dynamicParams = false;

export async function GET(req: NextRequest) {
    const diseaseFromDB = await prismaPostGresClient.disease.findMany({
        where: {
            id: {
                gt: 0
            }
        },
        select: {
            id: true,
            conceptName: true
        }
    });


    const diseaseDD: DropDownSingleItemProps[] = [];

    diseaseFromDB.forEach((disease) => {
        diseaseDD.push({
            id: disease.id,
            name: disease.conceptName
        })
    });
    return sendSuccess(diseaseDD);
}