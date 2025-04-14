"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import MaterialReactTable, { type MRT_ColumnDef } from "material-react-table";
import { MCISpinner } from "@components/MCISpinner";
import { VerificationInfoInterface } from "@api/providers/elasticsearch/nidProxyIndex/interfaces/ESNidProxyInterface";
import { useLoggedInStore } from "@store/useLoggedInStore";
import PageHeader from "@library/PageHeader";
import BackNavigator from "@components/globals/BackNavigator";

export default function ClientDetailPage() {
  const clientId = useLoggedInStore((s) => s.clientId);
  const router = useRouter();

  const LIMIT = 25;
  const [items, setItems] = useState<VerificationInfoInterface[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const pageRef = useRef(0);
  const hasMoreRef = useRef(true);
  const loadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

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

  // Reset and initial load on clientId change
  useEffect(() => {
    pageRef.current = 0;
    hasMoreRef.current = true;
    loadingRef.current = false;
    setItems([]);
    setHasMore(true);
    fetchPage();
  }, [clientId, fetchPage]);

  // Infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchPage();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [fetchPage]);

  // Table columns
  const columns = useMemo<MRT_ColumnDef<VerificationInfoInterface>[]>(
    () => [
      {
        accessorKey: "generated_at",
        header: "Generated At",
        Cell: ({ cell }) => {
          const date = new Date(cell.getValue<string>());
          return date.toLocaleString();
        },
      },
      { accessorKey: "request_doc_type", header: "Doc Type" },
      { accessorKey: "nid_requested", header: "NID Requested" },
      { accessorKey: "nid_10_digit", header: "NID 10-digit" },
      { accessorKey: "nid_17_digit", header: "NID 17-digit" },
      { accessorKey: "brn", header: "BRN" },
      { accessorKey: "dob", header: "Date of Birth" },
    ],
    []
  );

  return (
    <main className="mt-40 flex w-full flex-col justify-center space-y-48 px-8 py-16 2xl:container bg-transparent border-none">
      <div className="flex flex-row">
        <BackNavigator />
        <div className="grid-item">
          <div className="flex gap-x-12">
            <div className="info space-y-4">
              <h6>
                {`Client Verifications for ${clientId}`}
              </h6>
            </div>
          </div>
        </div>
      </div>
      {items.length === 0 && loading ? (
        <MCISpinner />
      ) : (
        <MaterialReactTable
          columns={columns}
          data={items}
          enablePagination={false}
          enableRowNumbers={false}
          muiTableBodyRowProps={{
            onClick: () => {}, // no-op or navigate if desired
            sx: { cursor: "default" },
          }}
        />
      )}

      {/* Sentinel */}
      <div ref={sentinelRef} />

      {/* Loading more */}
      {loading && items.length > 0 && (
        <div className="mt-4 text-center">
          <MCISpinner />
        </div>
      )}

      {/* End message */}
      {!hasMore && !loading && (
        <div className="mt-4 text-center text-slate-500">No more records</div>
      )}
    </main>
  );
}
