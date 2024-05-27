import React, { memo } from "react";
import Skeleton from "react-loading-skeleton";

export default memo(function SkeletonPatientIDBlock() {
  return (
    <div className="card space-y-4">
      <div className="flex items-center gap-x-8">
        <h6>
          <Skeleton width={48} height={16} containerClassName="flex-1" />
        </h6>
      </div>
      <p className="truncate w-[50%]">
        <Skeleton containerClassName="flex-1" />
      </p>
    </div>
  );
});
