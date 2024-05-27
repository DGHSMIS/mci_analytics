"use client";

// Error components must be Client Components
import PageHeader from "@library/PageHeader";
import React from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mt-40 flex w-full flex-col justify-center space-y-48 px-24 2xl:container ">
      <PageHeader title="Error Encountered" titleSize="sm"></PageHeader>
      <div className="h-fit">
        <h3 className="mb-12 text-base font-semibold uppercase text-slate-600">
          Unfortunately, an error has occurred. Please try again later.
        </h3>
      </div>
    </main>
  );
}
