"use client";
import { useState, useMemo, Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useSuspenseQuery } from "@tanstack/react-query";
import { signOut } from "next-auth/react";

import { MCISpinner } from "@components/MCISpinner";
import { CardIndicatorsProps } from "@components/globals/CardIndicator/CardIndicator";
import { DropDownSingleItemProps } from "@library/form/DropDownSingle";

const PageHeader = dynamic(() => import("@library/PageHeader"), { ssr: true });
const Alert = dynamic(() => import("@library/Alert"), { ssr: true });
const MultipleDatePicker = dynamic(
  () => import("@library/form/DatePicker/MultipleDatePicker"),
  { ssr: true }
);
const TablePagyCustom = dynamic(
  () => import("@components/table/TablePagyCustom"),
  { ssr: true }
);
const CardIndicator = dynamic(
  () => import("@components/globals/CardIndicator/CardIndicator"),
  { ssr: true }
);
const DropDownSingle = dynamic(() => import("@library/form/DropDownSingle"), {
  ssr: true,
});
const LineChartMCI = dynamic(
  () => import("@components/charts/LineChart/LineChartMCI"),
  { ssr: false, loading: () => <MCISpinner /> }
);

interface TopClient {
  client_id: number | string;
  count: number;
  client_name: string;
}

const verificationIndicatorProps: CardIndicatorsProps = {
  className: "h-fit hover:shadow-lg hover:cursor-pointer",
  iconBgVariant: "light",
  variant: "success",
  hasIcon: true,
  hasCategoryTitle: false,
  hasTitle: true,
  titleAlign: "center",
};

// --- Small fetch helper
async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

// --- Suspense hooks
function useAggregatedCounts(start: string, end: string) {
  return useSuspenseQuery({
    queryKey: ["aggregatedCounts", start, end],
    queryFn: () =>
      fetchJSON<{ nid: number; brn: number }>(
        `/api/es/administer/nid_proxy/aggregated-count?startdate=${start}&enddate=${end}`
      ),
    staleTime: 60_000, // tune as needed
    refetchOnWindowFocus: false,
  });
}

function useTopClients(start: string, end: string, docType: string) {
  return useSuspenseQuery({
    queryKey: ["topClients", start, end, docType],
    queryFn: () =>
      fetchJSON<TopClient[]>(
        `/api/es/administer/nid_proxy/top_id_verifications?startdate=${start}&enddate=${end}&limit=50&doc_type=${docType}`
      ),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

function useChartData(start: string, end: string, docType: string) {
  return useSuspenseQuery({
    queryKey: ["chartTop10", start, end, docType],
    queryFn: () =>
      fetchJSON<any[]>(
        `/api/es/administer/nid_proxy/aggregated-top-10-verifiers?startdate=${start}&enddate=${end}&doc_type=${docType}`
      ),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export default function VerificationAnalytics({ session }: any) {
  const router = useRouter();

  // Auth guard (kept from your original)
  useEffect(() => {
    const handleAuth = async () => {
      if (!session) {
        await signOut();
      }
    };
    handleAuth();
  }, [session]);

  // Default last 5 days
  const today = new Date();
  const defaultEnd = today.toISOString().split("T")[0];
  const defaultStart = new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  // Date range + doc type UI state
  const [dateRange, setDateRange] = useState<[string, string]>([
    defaultStart,
    defaultEnd,
  ]);

  const docTypeOptions: DropDownSingleItemProps[] = [
    { id: 0, name: "NID" },
    { id: 1, name: "BRN" },
  ];
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);

  const start = dateRange[0];
  const end = dateRange[1];
  const docType = useMemo(
    () => docTypeOptions[selectedDocIndex].name,
    [selectedDocIndex]
  );

  const [tableExpanded, setTableExpanded] = useState({});

  const handleDateChange = (dates: string[] | null) => {
    if (
      dates &&
      dates.length === 2 &&
      dates[0].trim() !== "" &&
      dates[1].trim() !== ""
    ) {
      setDateRange([dates[0], dates[1]]);
    }
  };

  const handleDocTypeChange = (e: any) => {
    setSelectedDocIndex(e.data.id);
    // no manual clears needed — queries are keyed by params
  };

  return (
    <main className="mt-40 flex w-full flex-col justify-center space-y-48 px-24 2xl:container bg-transparent border-none">
      <div className="space-y-24 p-8">
        <PageHeader title="Verification Analytics" titleSize="sm" />

        {/* Segment 1: Date range picker */}
        <h4 className="mb-12 text-sm font-semibold uppercase text-slate-600 flex justify-end">
          Filter by Date Range
        </h4>
        <div className="flex justify-end">
          <MultipleDatePicker
            dateField={{ className: "h-44 pl-8 pr-36" }}
            toDate={new Date()}
            mode="range"
            dateBetweenConnector="to"
            value={dateRange.map((d) => new Date(d))}
            dateReturnFormat="yyyy-MM-dd"
            onChange={handleDateChange}
          />
        </div>

        {/* Segment 2: Aggregated counts */}
        <h3 className="mb-12 text-base font-semibold uppercase text-slate-600">
          Aggregated Verification Stats
        </h3>
        <Suspense fallback={<MCISpinner />}>
          <AggregatedCounts start={start} end={end} />
        </Suspense>

        {/* Segment 3: Doc-type selector + header */}
        <div className="flex items-center justify-between">
          <h3 className="mb-12 text-base font-semibold uppercase text-slate-600">
            Top {docType} Verifications
          </h3>
          <div className="w-auto">
            <h4 className="mb-12 text-sm font-semibold uppercase text-slate-600 flex justify-end">
              Filter by Date Range
            </h4>
            <DropDownSingle
              label=""
              items={docTypeOptions}
              index={selectedDocIndex}
              onChange={handleDocTypeChange}
              isFilterable={false}
            />
          </div>
        </div>

        {/* Segment 4: Line chart */}
        <div className="my-8 flex w-full flex-col items-center space-y-8 md:flex-row md:space-x-8">
          <Suspense fallback={<MCISpinner />}>
            <ChartSection start={start} end={end} docType={docType} />
          </Suspense>
        </div>

        {/* Segment 5: Top clients table */}
        <div className="relative min-h-[300px]">
          <Suspense fallback={<MCISpinner />}>
            <TopClientsTable
              start={start}
              end={end}
              docType={docType}
              onReset={() => setDateRange([defaultStart, defaultEnd])}
              tableExpanded={tableExpanded}
              setTableExpanded={setTableExpanded}
              onRowClick={(row) =>
                router.push(
                  `/admin/verification-analytics/client/${row.original.client_id}`
                )
              }
            />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

/* ---------------- Sections (Suspense boundaries) ---------------- */

function AggregatedCounts({ start, end }: { start: string; end: string }) {
  const { data } = useAggregatedCounts(start, end);
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-16">
      <CardIndicator
        {...verificationIndicatorProps}
        variant="success"
        iconName="activity"
        title="Total NID Verified"
        subTitle={data.nid.toLocaleString()}
      />
      <CardIndicator
        {...verificationIndicatorProps}
        variant="success"
        iconName="activity"
        title="Total BRN Verified"
        subTitle={data.brn.toLocaleString()}
      />
    </div>
  );
}

function ChartSection({
  start,
  end,
  docType,
}: {
  start: string;
  end: string;
  docType: string;
}) {
  const { data } = useChartData(start, end, docType);
  if (!data || data.length === 0) {
    return <div>No results in the given time range</div>;
  }
  return (
    <div className="h-[400px] w-full rounded-lg">
      <LineChartMCI
        originalData={data}
        chartTitle={`Top 10 ${docType} Verifiers (${start} → ${end})`}
        useToolTip
      />
    </div>
  );
}

function TopClientsTable({
  start,
  end,
  docType,
  onReset,
  tableExpanded,
  setTableExpanded,
  onRowClick,
}: {
  start: string;
  end: string;
  docType: string;
  onReset: () => void;
  tableExpanded: any;
  setTableExpanded: (s: any) => void;
  onRowClick: (row: any) => void;
}) {
  const { data } = useTopClients(start, end, docType);

  if (!data || data.length === 0) {
    return (
      <Alert
        iconName="alert-triangle"
        variant="secondary"
        showBtn
        btnText="Reset Date Range"
        isIconClicked={false}
        isBtnClicked={onReset}
        hideCross
        title="No Results"
        body={`No ${docType} verifications found for that date range.`}
      />
    );
  }

  return (
    <TablePagyCustom
      rawData={data}
      grouping={[]}
      groupingChange={() => {}}
      expandAggregated={tableExpanded}
      setExpandedAggregatedState={setTableExpanded}
      onRowClick={onRowClick}
      columnHeadersLabel={[
        { accessorKey: "client_name", header: "Facility" },
        { accessorKey: "client_id", header: "Client ID" },
        { accessorKey: "count", header: "Verification Count" },
      ]}
    />
  );
}
