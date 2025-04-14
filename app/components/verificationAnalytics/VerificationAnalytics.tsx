"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CardIndicatorsProps } from "@components/globals/CardIndicator/CardIndicator";
import { DropDownSingleItemProps } from "@library/form/DropDownSingle";
import { MCISpinner } from "@components/MCISpinner";
import dynamic from "next/dynamic";

const PageHeader = dynamic(() => import("@library/PageHeader"), {
  ssr: true,
});

const Alert = dynamic(() => import("@library/Alert"), {
  ssr: true,
});

const MultipleDatePicker = dynamic(
  () => import("@library/form/DatePicker/MultipleDatePicker"),
  {
    ssr: true,
  }
);

const TablePagyCustom = dynamic(
  () => import("@components/table/TablePagyCustom"),
  {
    ssr: true,
  }
);

const CardIndicator = dynamic(
  () => import("@components/globals/CardIndicator/CardIndicator"),
  {
    ssr: true,
  }
);

const DropDownSingle = dynamic(() => import("@library/form/DropDownSingle"), {
  ssr: true,
});

interface TopClient {
  client_id: number | string;
  count: number;
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

export default function VerificationAnalytics() {
  const router = useRouter();

  // Default to last 5 days
  const today = new Date();
  const defaultEnd = today.toISOString().split("T")[0];
  const defaultStart = new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  // Date range state
  const [dateRange, setDateRange] = useState<[string, string]>([
    defaultStart,
    defaultEnd,
  ]);

  // Aggregated counts
  const [aggregated, setAggregated] = useState<{ nid: number; brn: number }>({
    nid: 0,
    brn: 0,
  });

  // Document‐type dropdown
  const docTypeOptions: DropDownSingleItemProps[] = [
    { id: 0, name: "NID" },
    { id: 1, name: "BRN" },
  ];
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  //   const docType = docTypeOptions[selectedDocIndex].name;

  // Top‐clients state
  const [topClients, setTopClients] = useState<TopClient[]>([]);
  const [loadingTop, setLoadingTop] = useState(false);
  const [renderTop, setRenderTop] = useState(false);

  // Table expansion state
  const [tableExpanded, setTableExpanded] = useState({});

  // Handle date‐picker changes
  const handleDateChange = (dates: string[] | null) => {
    if (
      dates &&
      dates.length === 2 &&
      dates[0].trim() !== "" &&
      dates[1].trim() !== ""
    ) {
      setDateRange([dates[0], dates[1]]);
      setRenderTop(false);
    }
  };

  // Handle dropdown changes
  const handleDocTypeChange = (e: any) => {
    console.log("Selected doc type:", e.data);
    setSelectedDocIndex(e.data.id);
    setRenderTop(false);
  };

  // Fetch aggregated counts on dateRange change
  useEffect(() => {
    async function fetchAggregated() {
      try {
        const res = await fetch(
          `/api/es/administer/nid_proxy/aggregated-count?startdate=${dateRange[0]}&enddate=${dateRange[1]}`
        );
        if (!res.ok) throw new Error(res.statusText);
        const json = await res.json();
        setAggregated({ nid: json.nid, brn: json.brn });
      } catch (err) {
        console.error("Failed to load aggregated counts", err);
      }
    }
    fetchAggregated();
  }, [dateRange]);

  // Fetch top clients on dateRange or docType change
  useEffect(() => {
    async function fetchTopClients() {
      setLoadingTop(true);
      try {
        const res = await fetch(
          `/api/es/administer/nid_proxy/top_id_verifications?` +
            `startdate=${dateRange[0]}&enddate=${dateRange[1]}` +
            `&limit=50&doc_type=${
              docTypeOptions[selectedDocIndex ?? 0].name ?? "NID"
            }`
        );
        if (!res.ok) throw new Error(res.statusText);
        const json: TopClient[] = await res.json();
        setTopClients(json);
      } catch (err) {
        console.error("Failed to load top clients", err);
        setTopClients([]);
      } finally {
        setLoadingTop(false);
        setRenderTop(true);
      }
    }
    fetchTopClients();
  }, [dateRange, selectedDocIndex]);

  return (
    <main className="mt-40 flex w-full flex-col justify-center space-y-48 px-24 2xl:container bg-transparent border-none">
      <div className="space-y-24 p-8">
        <PageHeader
          title={`Verification Analytics`}
          titleSize="sm"
        ></PageHeader>
        {/* Segment 1: Date range picker */}
        <h4 className="mb-12 text-sm font-semibold uppercase text-slate-600 flex justify-end">
          Filter by Date Range
        </h4>
        <div className="flex justify-end">
          <MultipleDatePicker
            dateField={{
              className: "h-44 pl-8 pr-36",
            }}
            toDate={new Date()}
            mode="range"
            dateBetweenConnector="to"
            value={dateRange.map((d) => new Date(d))}
            dateReturnFormat="yyyy-MM-dd"
            onChange={handleDateChange}
          />
        </div>
        <h3 className="mb-12 text-base font-semibold uppercase text-slate-600">
          Aggregated Verification Stats
        </h3>
        {/* Segment 2: Aggregated counts */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:grid-cols-4 md:gap-16">
          <CardIndicator
            {...verificationIndicatorProps}
            key={1}
            variant="success"
            iconName="activity"
            className="col-span-1 lg:col-span-1"
            title={"Total NID Verified"}
            subTitle={
              aggregated.nid !== null
                ? String(aggregated.nid).toLocaleString()
                : ""
            }
          />
          <CardIndicator
            {...verificationIndicatorProps}
            key={1}
            variant="success"
            iconName="activity"
            className="col-span-1 lg:col-span-1"
            title={"Total BRN Verified"}
            subTitle={
              aggregated.brn !== null
                ? String(aggregated.brn).toLocaleString()
                : ""
            }
          />
        </div>

        {/* Segment 3: Doc‐type selector + header */}
        <div className="flex items-center justify-between">
          <h3 className="mb-12 text-base font-semibold uppercase text-slate-600">
            Top {docTypeOptions[selectedDocIndex ?? 0].name} Verifications
          </h3>
          <div className="w-auto">
            <h4 className="mb-12 text-sm font-semibold uppercase text-slate-600 flex justify-end">
              Filter by Date Range
            </h4>
            <DropDownSingle
              label=""
              items={docTypeOptions}
              index={selectedDocIndex}
              onChange={(e) => handleDocTypeChange(e)}
              isFilterable={false}
            />
          </div>
        </div>

        {/* Segment 4: Top clients table */}
        <div className="relative min-h-[300px]">
          {loadingTop ? (
            <MCISpinner />
          ) : renderTop && topClients.length > 0 ? (
            <TablePagyCustom
              rawData={topClients}
              grouping={[]}
              groupingChange={() => {}}
              expandAggregated={tableExpanded}
              setExpandedAggregatedState={setTableExpanded}
              onRowClick={(row) =>
                router.push(
                  `/admin/verification-analytics/client/${row.original.client_id}`
                )
              }
              columnHeadersLabel={[
                { accessorKey: "client_id", header: "Client ID" },
                { accessorKey: "count", header: "Verification Count" },
              ]}
            />
          ) : renderTop ? (
            <Alert
              iconName="alert-triangle"
              variant="secondary"
              showBtn
              btnText="Reset Date Range"
              isIconClicked={false}
              isBtnClicked={() => {
                setDateRange([defaultStart, defaultEnd]);
                setRenderTop(false);
              }}
              hideCross
              title="No Results"
              body={`No ${
                docTypeOptions[selectedDocIndex ?? 0].name
              } verifications found for that date range.`}
            />
          ) : null}
        </div>
      </div>
    </main>
  );
}
