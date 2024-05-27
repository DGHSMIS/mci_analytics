import Link from "next/link";
import React, { memo } from "react";
import dynamic from "next/dynamic";

const PageHeader = dynamic(() => import("@library/PageHeader"), {
  ssr: true,
});

const Icon = dynamic(() => import("@library/Icon"), {
  ssr: true,
});

export default memo(function NotFound() {
  return (
    <main className="mt-[25vh] flex w-full flex-col items-center justify-center space-y-24 px-24 2xl:container">
      <Icon
        iconName="alert-triangle"
        iconSize="96"
        className="text-red-500"
        iconStrokeWidth="2"
      />
      <PageHeader title="Error 404: Page Not Found" titleSize="sm" />
      <div className="h-fit">
        <h3
          className={`mb - 12 text-base font-semibold uppercase text-slate-600`}
        >
          Unfortunately, we were unable to find the page you were looking for.
        </h3>
        <Link href="/">Back to Home</Link>
      </div>
    </main>
  );
});
