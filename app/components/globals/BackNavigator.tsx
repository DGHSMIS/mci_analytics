"use client";
import React, { memo } from "react";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useLoggedInStore } from "@store/useLoggedInStore";


const Button = dynamic(() => import("@library/Button"), {
  ssr: true,
});

function BackNavigator ()  {
  if (typeof window === "undefined") return null;
  const router = useRouter()
  const pathName = usePathname()
  // Check if the current path is a Patient Detail page by checking if it has a patient ID segment
  const isPatientDetailPage = /^\/admin\/patient\/[0-9]+$/.test(pathName);
  const {setPatient, setPatientId} = useLoggedInStore();

  // Function to handle going back to the previous page
  const goBack = () => {
    setPatient(null);
    setPatientId(null);
    if(isPatientDetailPage){
      router.replace("/admin/patient")
    }
  };

  if(!isPatientDetailPage ) return null;
  return (
    <div className="flex bg-transparent text-left  hover:bg-transparent hover:shadow-none transition-all transition-duration-250 transform-gpu">
      <Button
        outline={true}
        variant='neutral'
        size='sm'
        iconName="arrow-narrow-left"
        iconPos={'left'}
        iconClassName=' transform-gpu hover:translate-y-[-0.5rem]'
        textClassName='text-md md:text-[0.7rem]'
        clicked={goBack} btnText={"Back to Search"} className=' hover:font-semibold hover:md:text-[0.75rem] transform-gpu hover:-translate-x-4 rounded hover:transform-scale-125 bg-transparent border-none hover:shadow-sm hover:drop-shadow-xl  hover:text-primary-500 hover:bg-transparent'/>
    </div>
  );
};

export default memo(BackNavigator);