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
import { xMonthsAgo } from "@utils/utilityFunctions";
import dynamic from "next/dynamic";
import { Metadata } from "next/types";

/**
 * Dynamic imports
 */
const PageHeader = dynamic(() => import("@library/PageHeader"), { ssr: true });
const pageTitle = "Shared Health Record (SHR) Dashboard";
const desc = "Analytics Platform by MIS, DGHS";
const section1Title = "SHR Lifetime Stats - Registrations Per Platform";
const section2Title = "SHR Registration Demographics Analytics";
const section3Title = "Facility Service Registration Overview";

export const metadata: Metadata = {
  title: pageTitle + " ",
  description: desc,
};
const currentDate = xMonthsAgo(0);
//Dashboard Landing Page
export default async function page() {
  //Demography Stat Filter Set
  let demoMaxDate = currentDate;
  let demoMinDate = xMonthsAgo(1);
  // Service Overview Filter Set
  let serviceOvMaxDate = currentDate;
  let serviceOvMinDate = xMonthsAgo(1);
  
  return (
    <main className="mt-40 flex w-full flex-col justify-center space-y-48 px-24 2xl:container bg-transparent border-none">
      <StoreInitializer {...initialStoreStates} serviceOverviewMaxDate={serviceOvMaxDate} serviceOverviewMinDate={serviceOvMinDate} demographyMaxDate={demoMaxDate} demographyMinDate={demoMinDate}/>
      <PageHeader title={pageTitle} titleSize="sm"></PageHeader>
      <PublicDbClientWrapper section1Title={section1Title} section2Title={section2Title} section3Title={section3Title} />
    </main>
  );
}
