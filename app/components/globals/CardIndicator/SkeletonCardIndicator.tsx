import Skeleton from "react-loading-skeleton";
import { cn } from "tailwind-cn";

export default function SkeletonCardIndicator({  hasTitle = true, className="" }: {
  hasTitle?: boolean;
  className?: string;
}) {
  return (
    <div className={cn( className)}>
      <div
        className="group/card cursor-pointer rounded-lg border border-slate-200 bg-white dark:border-neutral-700 dark:bg-gray-800 p-16 hover:border-primary-400"
      >
        <div className="space-y-8">
          {hasTitle && (
            <div
              className=" items-startflex w-full flex-col justify-center text-sm font-medium !leading-tight tracking-tight text-slate-500 transition dark:text-white md:text-base"
            >
              <Skeleton className="hidden sm:block" width={150} height={24} />
              <Skeleton className="block sm:hidden" width={100} height={18} />
            </div>
          )}
          <div className="flex flex-row items-center justify-between space-x-20">
            <div className="flex w-full flex-row items-center justify-center space-x-20">
              {/*icon start  */}
              <span
                className={cn(
                  "inline-flex h-40 items-center rounded-md px-0 py-0",
                )}
              >
                    <Skeleton containerClassName={'flex-1'} width={40} height={40} />
                  </span>


              {/*icon end  */}
              <div className={"flex w-full flex-col "}>
                <h4 className="tracking-tight text-primary-500 group-hover/card:text-primary-400 dark:text-white">
                  <Skeleton width={60} height={24} />
                </h4>
              </div>
              {/* title & subTitle end */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};