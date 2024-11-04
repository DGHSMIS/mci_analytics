/**
 * SSR Dashboard Component to load Initial Data
 * Developed by Fahim Hossain
 * Designation: Software Specialist, MIS, DGHS
 * Email: fahim@aritsltd.com
 * website: https://aritsltd.com
 */
//section 2: Demography Stats
//section 1: FacilityTypewiseRegistrationStats
import NcdDbClientWrapper2 from "@components/ncdPublicDashboard/NcdDbClientWrapper2";
import { initialStoreStates } from "@store/store";
import StoreInitializer from "@store/StoreInitializer";
import { xDaysAgo, xMonthsAgo } from "@utils/utilityFunctions";
import dynamic from "next/dynamic";
import { Metadata } from "next/types";

/**
 * Dynamic imports
 */
const PageHeader = dynamic(() => import("@library/PageHeader"), { ssr: true });
const pageTitle = "Pediatric Non Communicable Disease (NCD) Dashboard";
const desc = "Analytics Platform by MIS, DGHS";

export const metadata: Metadata = {
  title: pageTitle + " ",
  description: desc,
};
const currentDate = xMonthsAgo(0);
//Dashboard Landing Page
export default async function page() {
  return (
    <main className="mt-40 flex w-full flex-col justify-center space-y-48 px-24 2xl:container bg-transparent border-none">
      <StoreInitializer {...initialStoreStates} serviceOverviewMaxDate={xDaysAgo(0)} serviceOverviewMinDate={xDaysAgo(6)} demographyMaxDate={xDaysAgo(0)} demographyMinDate={xDaysAgo(6)}/>
      <PageHeader title={pageTitle} titleSize="sm"></PageHeader>
        <NcdDbClientWrapper2 />
    </main>
  );
}
