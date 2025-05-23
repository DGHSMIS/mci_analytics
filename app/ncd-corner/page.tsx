/**
 * SSR Dashboard Component to load Initial Data
 * Developed by Fahim Hossain
 * Designation: Software Specialist, MIS, DGHS
 * Email: fahim@aritsltd.com
 * website: https://aritsltd.com
 */
//section 2: Demography Stats
//section 1: FacilityTypewiseRegistrationStats
import NcdDbClientWrapper from "@components/ncdPublicDashboard/NcdDbClientWrapper";
import { initialStoreStates } from "@store/store";
import StoreInitializer from "@store/StoreInitializer";
import { ncdFacilityListDropdown } from "@utils/constantsInMemory";
import { xDaysAgo, xMonthsAgo } from "@utils/utilityFunctions";
import dynamic from "next/dynamic";
import { Metadata } from "next/types";

/**
 * Dynamic imports
 */
const PageHeader = dynamic(() => import("@library/PageHeader"), { ssr: true });
const pageTitle = "Pediatric Non Communicable Disease (NCD) Dashboard";
const desc = "NCD Analytics Platform by MIS, DGHS";

export const metadata: Metadata = {
  title: pageTitle + " ",
  description: desc,
};
const currentDate = xMonthsAgo(0);
//Dashboard Landing Page
export default async function page() {
  const getFacilityDD = await ncdFacilityListDropdown();
  console.log("The NCD Facility DD");
  console.log(getFacilityDD);
  const updatedStoreState = {
    ...initialStoreStates,
    ncdAggregatedFacilityDDItems: getFacilityDD,
    serviceOverviewMaxDate: xDaysAgo(0),
    serviceOverviewMinDate: xDaysAgo(6),
    demographyMaxDate: xDaysAgo(0),
    demographyMinDate: xDaysAgo(6)
  }
  return (
    <main className="mt-40 flex w-full flex-col justify-center space-y-48 px-24 2xl:container bg-transparent border-none">
      <StoreInitializer {...updatedStoreState} />
      <PageHeader title={pageTitle} titleSize="sm"></PageHeader>
      <NcdDbClientWrapper />
    </main>
  );
}
