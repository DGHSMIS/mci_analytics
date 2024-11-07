/**
 * SSR Dashboard Component to load Initial Data
 * Developed by Fahim Hossain
 * Designation: Software Specialist, MIS, DGHS
 * Email: fahim@aritsltd.com
 * website: https://aritsltd.com
 */
//section 2: Demography Stats
//section 1: FacilityTypewiseRegistrationStats
import PublicDbClientWrapper from "@components/publicDashboard/PublicDbClientWrapper";
import { initialStoreStates } from "@store/store";
import StoreInitializer from "@store/StoreInitializer";
import { xDaysAgo } from "@utils/utilityFunctions";
import dynamic from "next/dynamic";
import { Metadata } from "next/types";

/**
 * Dynamic imports
 */
const PageHeader = dynamic(() => import("@library/PageHeader"), { ssr: true });
const pageTitle = "Shared Health Record (SHR) Dashboard";
const desc = "Analytics Platform by MIS, DGHS";
const section1Title = "HID Registrations by Platform";
const section2Title = "Clinical Records by Platform";
const section3Title = "Facilitywise Stats";
const section4Title = "HID Registration Demographic Stats";

export const metadata: Metadata = {
  title: pageTitle + " ",
  description: desc,
};
// const currentDate = xMonthsAgo(0);
//Dashboard Landing Page
export default async function page() {
  return (
    <main className="mt-40 flex w-full flex-col justify-center space-y-48 px-24 2xl:container bg-transparent border-none">
      <StoreInitializer {...initialStoreStates} serviceOverviewMaxDate={xDaysAgo(0)} serviceOverviewMinDate={xDaysAgo(6)} demographyMaxDate={xDaysAgo(0)} demographyMinDate={xDaysAgo(6)}/>
      <PageHeader title={pageTitle} titleSize="sm"></PageHeader>
      <PublicDbClientWrapper section1Title={section1Title} section2Title={section2Title} section3Title={section3Title} section4Title={section4Title}/>
    </main>
  );
}
