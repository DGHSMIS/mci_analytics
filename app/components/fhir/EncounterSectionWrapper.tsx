import { memo } from "react";
import { cn } from "tailwind-cn";

export const EncounterSectionWrapper = memo(function EncounterSectionWrapper({ children, title, wrapperClassNames="", bodyClassNames="" }: { children: any; title?: string; wrapperClassNames?:string, bodyClassNames?:string }) {
  return (
    <section
      className={cn(
        "fhirItems overflow-x-auto cursor-pointer hover:bg-primary-50 hover:bg-opacity-10 rounded-lg border border-slate-200 bg-white dark:border-neutral-700 dark:bg-gray-800 p-16 hover:border-primary-400",
        wrapperClassNames
      )}>
      {title &&
        <div className="flex flex-col justify-start items-start">
          <h6 className={"text-md"}>{title}</h6>
          <hr />
        </div>
      }
      <div className={cn(
        "gap-y-4 h-full w-full",
        bodyClassNames
        )}>
        {children}
      </div>
    </section>);
});