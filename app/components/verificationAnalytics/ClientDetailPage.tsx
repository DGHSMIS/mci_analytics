"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import MaterialReactTable, { type MRT_ColumnDef } from "material-react-table";
import { Serie } from "@nivo/line";
import { MCISpinner } from "@components/MCISpinner";       // ← your chart component
import { VerificationInfoInterface } from "@api/providers/elasticsearch/nidProxyIndex/interfaces/ESNidProxyInterface";
import { useLoggedInStore } from "@store/useLoggedInStore";
import BackNavigator from "@components/globals/BackNavigator";
import LineChartMCI from "@components/charts/LineChart/LineChartMCI";

export default function ClientDetailPage() {
  const clientId = useLoggedInStore((s) => s.clientId);
  const router = useRouter();

  const LIMIT = 25;
  const [items, setItems] = useState<VerificationInfoInterface[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [chartData, setChartData] = useState<Serie[]>([]);
  const [chartLoading, setChartLoading] = useState(false);

  const pageRef = useRef(0);
  const hasMoreRef = useRef(true);
  const loadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // --- infinite scroll fetch for table ---
  const fetchPage = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    try {
      const start = pageRef.current * LIMIT;
      const res = await fetch(
        `/api/es/administer/nid_proxy/client/${clientId}?limit=${LIMIT}&start=${start}`
      );
      if (!res.ok) throw new Error(res.statusText);
      const json: VerificationInfoInterface[] = await res.json();

      setItems((prev) => [...prev, ...json]);

      if (json.length === LIMIT) {
        pageRef.current += 1;
      } else {
        hasMoreRef.current = false;
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load client details", err);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [clientId]);

  // reset + initial table load
  useEffect(() => {
    pageRef.current = 0;
    hasMoreRef.current = true;
    loadingRef.current = false;
    setItems([]);
    setHasMore(true);
    fetchPage();
  }, [clientId, fetchPage]);

  // setup infinite scroll sentinel
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && fetchPage(),
      { rootMargin: "200px" }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [fetchPage]);

  // --- fetch chart data ---
  useEffect(() => {
    if (!clientId) return;

    const fetchChart = async () => {
      setChartLoading(true);
      try {
        // you can wire these to date pickers or props instead
        const startDate = "2024-06-05";
        const endDate   = "2024-06-10";

        const res = await fetch(
          `/api/es/administer/nid_proxy/aggregated-clientwise-verifications/${clientId}`
          //  +
          // `?startdate=${startDate}&enddate=${endDate}`
        );
        if (!res.ok) throw new Error(res.statusText);
        const json: Serie[] = await res.json();
        setChartData(json);
      } catch (err) {
        console.error("Failed to load chart data", err);
      } finally {
        setChartLoading(false);
      }
    };

    fetchChart();
  }, [clientId]);

  // --- table columns ---
  const columns = useMemo<MRT_ColumnDef<VerificationInfoInterface>[]>(
    () => [
      {
        accessorKey: "generated_at",
        header: "Generated At",
        Cell: ({ cell }) => new Date(cell.getValue<string>()).toLocaleString(),
      },
      { accessorKey: "request_doc_type", header: "Doc Type" },
      { accessorKey: "nid_requested",   header: "NID Requested" },
      { accessorKey: "nid_10_digit",    header: "NID 10-digit"   },
      { accessorKey: "nid_17_digit",    header: "NID 17-digit"   },
      { accessorKey: "brn",             header: "BRN"            },
      { accessorKey: "dob",             header: "Date of Birth"  },
    ],
    []
  );

  return (
    <main className="mt-40 flex w-full flex-col justify-center space-y-48 px-8 py-16 2xl:container">
      <div className="flex items-center space-x-4">
        <BackNavigator />
        <h1 className="text-xl font-semibold">
          Client Verifications for {clientId}
        </h1>
      </div>

      {/* ─── Line Chart ─────────────────────────────────────────────── */}
      <section className="h-[600px] w-[80%]">
        {chartLoading ? (
          <div className="flex justify-center py-12">
            <MCISpinner />
          </div>
        ) : (
          <LineChartMCI
            originalData={chartData}
            chartTitle="Verifications Over Time"
          />
        )}
      </section>

      {/* ─── Data Table ─────────────────────────────────────────────── */}
      {items.length === 0 && loading ? (
        <MCISpinner />
      ) : (
        <MaterialReactTable
          columns={columns}
          data={items}
          enablePagination={false}
          enableRowNumbers={false}
          muiTableBodyRowProps={{
            sx: { cursor: "default" },
          }}
        />
      )}

      {/* sentinel for infinite scroll */}
      <div ref={sentinelRef} />

      {/* loading more */}
      {loading && items.length > 0 && (
        <div className="mt-4 text-center">
          <MCISpinner />
        </div>
      )}

      {/* end message */}
      {!hasMore && !loading && (
        <div className="mt-4 text-center text-slate-500">
          No more records
        </div>
      )}
    </main>
  );
}
