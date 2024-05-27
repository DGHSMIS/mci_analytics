import React, { memo } from "react";


export const ReferenceErrorLog = memo(function ReferenceErrorLog({ error }: { error: string }) {
  return <div className="text-red-600 text-xs font-semibold py-4">{error}</div>;
  ;
});