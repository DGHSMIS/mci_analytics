import process from "process";
import { useStore } from "@store/store";
import React, { memo } from "react";
import { cn } from "tailwind-cn";

const DEBUG = process.env.NEXT_COMPONENT_TYPE_CHECKER || false;

export const VisualWrapper = ({
  children,
  name,
}: {
  children: React.ReactNode;
  name: string;
}) => {
  if (!DEBUG) {
    return <>{children}</>;
  }
  const { setRenderType, renderType } = useStore.getState();

  if (typeof window === "undefined") {
    //We know that the component is being rendered in the server.
    // Now we need to check if its SSR or RSC
    console.log("<<<self");
    setRenderType("SSR");
  } else {
    setRenderType("Client");
  }
  let borderColor, bgColor, text;
  switch (renderType) {
    case "RSC":
      borderColor = "border-primary-500";
      bgColor = "bg-primary-100";
      text = "RSC";
      break;
    case "SSR":
      borderColor = "border-secondary-500";
      bgColor = "bg-secondary-100";
      text = "SSR";
      break;
    case "Client":
      borderColor = "border-rose-500";
      bgColor = "bg-rose-100";
      text = "Client";
      break;
  }

  return (
    <div className={cn("mt-2 border-2 rounded-lg", borderColor)}>
      <div className={cn(`flex rounded-t-sm font-semibold`, bgColor)}>
        <div className="bg-primary-500 px-4 py-2 text-white">{text}</div>
        <div className="ml-2 py-2 text-black">{name}</div>
      </div>
      <div className="p-1">{children}</div>
    </div>
  );
};

export default memo(VisualWrapper);
