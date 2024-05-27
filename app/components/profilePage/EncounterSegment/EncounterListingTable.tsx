"use client";
import React, { memo } from "react";
import { EncounterListProps } from "@utils/interfaces/Encounter/Encounter";
import { convertDateToReadableFormat } from "@utils/utilityFunctions";
import { useLoggedInStore } from "@store/useLoggedInStore";
import twcolors from "tailwindcss/colors";
import dynamic from "next/dynamic";


const Icon = dynamic(() => import("@library/Icon"), { ssr: true });

const EncounterListingTable = memo(function EncounterListingTable({ encounters } : EncounterListProps) {
  console.log("Encounter Table is - ");
  console.log(encounters);

  return(
    <>
      {encounters.map((encounter, index) => (
        <div onClick={ () => {
          useLoggedInStore.setState({
            selectedEncounter: encounter,
            showEncounterData: true,
            patient: useLoggedInStore.getState().patient
          });
        }} key={index} className="cursor-pointer hover:bg-primary-50 hover:bg-opacity-10 grid grid-cols-12 align-items-stretch rounded-lg border border-slate-200 bg-white dark:border-neutral-700 dark:bg-gray-800 p-16 hover:border-primary-400 mb-12">
          <div className="col-span max-w-100 flex justify-center items-center">
            <div className="font-bold text-primary">{index+1}</div>
          </div>
          <div className="col-span-11 self-stretch">
            <div className="mb-4 text-xs font-medium capitalize text-slate-500">
              Submitted on: {convertDateToReadableFormat(String(encounter.encounter_time),"2-digit","long", "numeric")}
            </div>
            <div>
                <h6 className="text-sm mb-2 font-semibold capitalize">{encounter.facility_name}</h6>
                <p className="mb-3 text-xs text-gray-700 dark:text-gray-400">{encounter.facility_location}</p>
            </div>
            {/* Add Confidentiality Status using a Icon component and text*/}
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-400">
                  Confidentiality:
                  <div className='inline-flex px-4 '>{!encounter.encounter_confidentiality ? <Icon iconSize='16px' iconColor={twcolors.green[600]} iconName='lock-unlocked-01' title="Visible" /> : <Icon iconSize='16px' iconName='lock-01' iconColor={twcolors.slate[600]} title="Private" />}</div>
                </div>
              </div>
            </div>
            <div>
            </div>
          </div>
        </div>
      ))}
  {/*     <div className="grid grid-cols-6 border rounded shadow-sm min-w-[500px] gap-1"> */}
  {/*   <div className="text-slate-500 text-sm tracking-tighter font-semibold p-8 bg-slate-200 w-full break-all">#id</div> */}
  {/*   <div className="text-slate-500 text-sm tracking-tighter font-semibold p-8 bg-slate-200 w-full break-all">Visit Date</div> */}
  {/*   <div className="text-slate-500 text-sm tracking-tighter font-semibold p-8 bg-slate-200 w-full break-all">Facility Name</div> */}
  {/*   <div className="text-slate-500 text-sm tracking-tighter font-semibold p-8 bg-slate-200 w-full break-all">Location</div> */}
  {/*   <div className="text-slate-500 text-sm tracking-tighter font-semibold p-8 bg-slate-200 w-full break-all">Type</div> */}
  {/*   <div className="text-slate-500 text-sm tracking-tighter font-semibold p-8 bg-slate-200 w-full break-all">View</div> */}
  {/*   {encounters.map((encounter, index) => ( */}
  {/*     <React.Fragment key={encounter.id} > */}
  {/*       <div className={`text-slate-500 text-sm tracking-tighter p-8 w-full break-all ${index % 2 === 0 ? 'bg-gray-100' : ''}`}><PatientIDBlocks idNumber={encounter.id ?? ""} idName={""} allowCopy={true}/></div> */}
  {/*       <div className={`text-slate-500 text-sm tracking-tighter p-8 w-full break-all ${index % 2 === 0 ? 'bg-gray-100' : ''}`}>{convertDateToReadableFormat(String(encounter.encounter_time))}</div> */}
  {/*       <div className={`hover:underline hover:cursor-pointer hover:text-primary-500 text-slate-500 text-sm tracking-tighter p-8 w-full break-all ${index % 2 === 0 ? 'bg-gray-100' : ''}`} onClick={()=>console.log(encounter.facility_id)}>{encounter.facility_name}</div> */}
  {/*       <div className={`text-slate-500 text-sm tracking-tighter p-8 w-full break-all ${index % 2 === 0 ? 'bg-gray-100' : ''}`}>{encounter.facility_location}</div> */}
  {/*       <div className={`text-slate-500 text-sm tracking-tighter p-8 w-full break-all ${index % 2 === 0 ? 'bg-gray-100' : ''}`}>{encounter.facility_type}</div> */}
  {/*       <div className={`text-slate-500 text-sm tracking-tighter p-8 w-full  break-all ${index % 2 === 0 ? 'bg-gray-100' : ''}`}> */}
  {/*         <Button */}
  {/*           variant='link' */}
  {/*           clicked={ () => { */}
  {/*           useLoggedInStore.setState({ */}
  {/*             selectedEncounter: encounter, */}
  {/*             showEncounterData: true, */}
  {/*             patient: useLoggedInStore.getState().patient */}
  {/*           }); */}
  {/*         }} iconName="arrow-narrow-right" iconPos={'right'} btnText={"View"} className='hover:text-primary-500'/> */}
  {/*       </div> */}
  {/*     </React.Fragment> */}
  {/*   ))} */}
  {/* </div> */}
    </>)
})

export default EncounterListingTable;