"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { CardIndicatorsProps } from "@components/globals/CardIndicator/CardIndicator";
import { DropDownSingleItemProps } from "@library/form/DropDownSingle";
import { MCISpinner } from "@components/MCISpinner";

// keep this as client-only; provide a loading fallback for the heavy chart
const LineChartMCI = dynamic(
  () => import("@components/charts/LineChart/LineChartMCI"),
  { ssr: false, loading: () => <MCISpinner /> }
);

const PageHeader = dynamic(() => import("@library/PageHeader"), { ssr: true });
const Alert = dynamic(() => import("@library/Alert"), { ssr: true });
const MultipleDatePicker = dynamic(() => import("@library/form/DatePicker/MultipleDatePicker"), { ssr: true });
const TablePagyCustom = dynamic(() => import("@components/table/TablePagyCustom"), { ssr: true });
const CardIndicator = dynamic(() => import("@components/globals/CardIndicator/CardIndicator"), { ssr: true });
const DropDownSingle = dynamic(() => import("@library/form/DropDownSingle"), { ssr: true });

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

const docTypeOptions: DropDownSingleItemProps[] = [
  { id: 0, name: "NID" },
  { id: 1, name: "BRN" },
];

export default function VerificationAnalytics() {
  const router = useRouter();

  // compute defaults once
  const todayRef = useRef(new Date());
  const defaultEnd = useMemo(() => todayRef.current.toISOString().split("T")[0], []);
  const defaultStart = useMemo(() => {
    const t = new Date(todayRef.current.getTime() - 5 * 24 * 60 * 60 * 1000);
    return t.toISOString().split("T")[0];
  }, []);

  const [dateRange, setDateRange] = useState<[string, string]>([defaultStart, defaultEnd]);
  const memoDateRangeDates = useMemo(
    () => [new Date(dateRange[0]), new Date(dateRange[1])],
    [dateRange[0], dateRange[1]]
  );

  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const selectedDocType = useMemo(
    () => docTypeOptions[selectedDocIndex].name,
    [selectedDocIndex]
  );

  const [chartData, setChartData] = useState<any[]>([]);
  const [loadingChart, setLoadingChart] = useState(false);

  const [aggregated, setAggregated] = useState<{ nid: number; brn: number }>({ nid: 0, brn: 0 });

  const [topClients, setTopClients] = useState<TopClient[]>([]);
  const [loadingTop, setLoadingTop] = useState(false);

  const [tableExpanded, setTableExpanded] = useState({});

  // keep setState only when values actually change
  const handleDateChange = (dates: string[] | null) => {
    if (!dates || dates.length !== 2) return;
    const [s, e] = [dates[0]?.trim(), dates[1]?.trim()];
    if (!s || !e) return;
    setDateRange((prev) => (prev[0] === s && prev[1] === e ? prev : [s, e]));
  };

  const handleDocTypeChange = (e: any) => {
    const newIndex = e?.data?.id ?? 0;
    setSelectedDocIndex((prev) => (prev === newIndex ? prev : newIndex));
    setTopClients([]);
    setChartData([]);
  };

  // Fetch aggregated counts on dateRange change
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await fetch(
          `/api/es/administer/nid_proxy/aggregated-count?startdate=${dateRange[0]}&enddate=${dateRange[1]}`,
          { signal: ac.signal }
        );
        if (!res.ok) throw new Error(res.statusText);
        const json = await res.json();
        setAggregated({ nid: json?.nid ?? 0, brn: json?.brn ?? 0 });
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          console.error("Failed to load aggregated counts", err);
        }
      }
    })();
    return () => ac.abort();
  }, [dateRange[0], dateRange[1]]);

  // Fetch top clients & chart on dateRange or docType change
  useEffect(() => {
    const ac1 = new AbortController();
    const ac2 = new AbortController();

    (async () => {
      setLoadingTop(true);
      try {
        const res = await fetch(
          `/api/es/administer/nid_proxy/top_id_verifications?startdate=${dateRange[0]}&enddate=${dateRange[1]}&limit=50&doc_type=${selectedDocType}`,
          { signal: ac1.signal }
        );
        if (!res.ok) throw new Error(res.statusText);
        const json: TopClient[] = await res.json();
        setTopClients(Array.isArray(json) ? json : []);
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          console.error("Failed to load top clients", err);
          setTopClients([]);
        }
      } finally {
        setLoadingTop(false);
      }
    })();

    (async () => {
      setLoadingChart(true);
      try {
        const res = await fetch(
          `/api/es/administer/nid_proxy/aggregated-top-10-verifiers?startdate=${dateRange[0]}&enddate=${dateRange[1]}&doc_type=${selectedDocType}`,
          { signal: ac2.signal }
        );
        if (!res.ok) throw new Error(res.statusText);
        const json = await res.json();
        // defensive slice in case API returns more than 10
        setChartData(Array.isArray(json) ? json.slice(0, 10) : []);
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          console.error("Failed to load chart data", err);
          setChartData([]);
        }
      } finally {
        setLoadingChart(false);
      }
    })();

    return () => {
      ac1.abort();
      ac2.abort();
    };
  }, [dateRange[0], dateRange[1], selectedDocType]);

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
            toDate={todayRef.current}                // ✅ stable
            mode="range"
            dateBetweenConnector="to"
            value={memoDateRangeDates}               // ✅ stable
            dateReturnFormat="yyyy-MM-dd"
            onChange={handleDateChange}              // ✅ guarded
          />
        </div>

        {/* Segment 2: Aggregated counts */}
        <h3 className="mb-12 text-base font-semibold uppercase text-slate-600">
          Aggregated Verification Stats
        </h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-16">
          <CardIndicator {...verificationIndicatorProps} variant="success" iconName="activity" title="Total NID Verified" subTitle={aggregated.nid.toLocaleString()} />
          <CardIndicator {...verificationIndicatorProps} variant="success" iconName="activity" title="Total BRN Verified" subTitle={aggregated.brn.toLocaleString()} />
        </div>

        {/* Segment 3: Doc-type selector + header */}
        <div className="flex items-center justify-between">
          <h3 className="mb-12 text-base font-semibold uppercase text-slate-600">
           Top {docTypeOptions[selectedDocIndex].name} Verifications
          </h3>
          <div className="w-[150px]">
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
          {loadingChart ? (
            <MCISpinner />
          ) : chartData.length ? (
            <div className="h-[400px] w-full rounded-lg">
              <LineChartMCI
                originalData={chartData}
                chartTitle={`Top 10 ${selectedDocType} Verifiers (${dateRange[0]} → ${dateRange[1]})`}
                useToolTip
              />
            </div>
          ) : (
            <div>No results in the given time range</div>
          )}
        </div>

        {/* Segment 5: Top clients table */}
        <div className="relative min-h-[300px]">
          {loadingTop ? (
            <MCISpinner />
          ) : topClients.length > 0 ? (
            <TablePagyCustom
              rawData={topClients}
              grouping={[]}
              groupingChange={() => {}}
              expandAggregated={tableExpanded}
              setExpandedAggregatedState={setTableExpanded}
              onRowClick={(row: any) =>
                router.push(`/admin/verification-analytics/client/${row.original.client_id}`)
              }
              columnHeadersLabel={[
                { accessorKey: "client_name", header: "Facility" },
                { accessorKey: "client_id", header: "Client ID" },
                { accessorKey: "count", header: "Verification Count" },
              ]}
            />
          ) : (
            <Alert
              iconName="alert-triangle"
              variant="secondary"
              showBtn
              btnText="Reset Date Range"
              isIconClicked={false}
              isBtnClicked={() => setDateRange([defaultStart, defaultEnd])}
              hideCross
              title="No Results"
              body={`No ${docTypeOptions[selectedDocIndex].name} verifications found for that date range.`}
            />
          )}
        </div>
      </div>
    </main>
  );
}
