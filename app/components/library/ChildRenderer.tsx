import React, { memo } from "react";

//Simple component to render children items
const ChildRenderer = memo(function ChildRendererComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
});

export default ChildRenderer;
