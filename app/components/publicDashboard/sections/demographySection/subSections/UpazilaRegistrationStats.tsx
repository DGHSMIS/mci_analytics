"use client";

import { useState, useMemo, useEffect } from "react";
import { useStore } from "@store/store";
import { useQuery } from "@tanstack/react-query";
import { fetchUpazilaWiseData } from "@utils/providers/pbdClientServiceProvider";
import { MCISpinner } from "@components/MCISpinner";
import Alert from "@library/Alert";

interface UnionStat {
  unionCode: string;
  unionName: string;
  count: number;
}

interface UpazilaStat {
  upazilaCode: string;
  upazilaName: string;
  count: number;
  unions: UnionStat[];
}

interface DistrictStat {
  districtName: string;
  districtCode: string;
  divisionName: string;
  totalCount: number;
  upazilas: UpazilaStat[];
}

const MONTHS = [
  { value: "1", name: "January" },
  { value: "2", name: "February" },
  { value: "3", name: "March" },
  { value: "4", name: "April" },
  { value: "5", name: "May" },
  { value: "6", name: "June" },
  { value: "7", name: "July" },
  { value: "8", name: "August" },
  { value: "9", name: "September" },
  { value: "10", name: "October" },
  { value: "11", name: "November" },
  { value: "12", name: "December" },
];

const YEARS = ["2022", "2023", "2024", "2025", "2026"];

export default function UpazilaRegistrationStats() {
  const {
    upazilaFilterType,
    upazilaSelectedMonth,
    upazilaSelectedYear,
    setUpazilaFilterType,
    setUpazilaSelectedMonth,
    setUpazilaSelectedYear,
  } = useStore();

  const [selectedDistrictCode, setSelectedDistrictCode] = useState<string | null>(null);
  const [selectedUpazilaCode, setSelectedUpazilaCode] = useState<string | null>(null);
  const [districtSearchQuery, setDistrictSearchQuery] = useState("");
  const [upazilaSearchQuery, setUpazilaSearchQuery] = useState("");

  // Query API using React Query and Zustand states
  const { data = [], isLoading, isError } = useQuery<DistrictStat[]>({
    queryKey: ["getUpazilaWiseDataFiltered", upazilaFilterType, upazilaSelectedMonth, upazilaSelectedYear],
    queryFn: async () => await fetchUpazilaWiseData(
      upazilaFilterType,
      upazilaSelectedMonth || undefined,
      upazilaSelectedYear || undefined
    ),
    refetchOnWindowFocus: false,
  });

  // Reset selected district and upazila if the overall dataset changes
  useEffect(() => {
    setSelectedDistrictCode(null);
    setSelectedUpazilaCode(null);
  }, [data]);

  // Set default values when switching to filters that require month/year
  useEffect(() => {
    if (upazilaFilterType === "by_month") {
      if (!upazilaSelectedMonth) setUpazilaSelectedMonth("1");
      if (!upazilaSelectedYear) setUpazilaSelectedYear("2026");
    } else if (upazilaFilterType === "by_year") {
      if (!upazilaSelectedYear) setUpazilaSelectedYear("2026");
    }
  }, [upazilaFilterType, upazilaSelectedMonth, upazilaSelectedYear, setUpazilaSelectedMonth, setUpazilaSelectedYear]);

  // Find the selected district details
  const selectedDistrict = useMemo(() => {
    if (!selectedDistrictCode) return null;
    return data.find((d) => d.districtCode === selectedDistrictCode) || null;
  }, [data, selectedDistrictCode]);

  // Filter districts based on search query
  const filteredDistricts = useMemo(() => {
    if (!districtSearchQuery.trim()) return data;
    const query = districtSearchQuery.toLowerCase();
    return data.filter(
      (d) =>
        d.districtName.toLowerCase().includes(query) ||
        d.divisionName.toLowerCase().includes(query)
    );
  }, [data, districtSearchQuery]);

  // Filter upazilas within the selected district
  const filteredUpazilas = useMemo(() => {
    if (!selectedDistrict) return [];
    if (!upazilaSearchQuery.trim()) return selectedDistrict.upazilas;
    const query = upazilaSearchQuery.toLowerCase();
    return selectedDistrict.upazilas.filter((u) =>
      u.upazilaName.toLowerCase().includes(query)
    );
  }, [selectedDistrict, upazilaSearchQuery]);

  return (
    <div className="w-full space-y-24 rounded-12 border border-slate-200 bg-white p-24 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Top Header & Range Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-16 border-b border-slate-100 dark:border-slate-800 pb-16">
        <div>
          <h3 className="text-18 font-semibold text-slate-800 dark:text-slate-100">
            District, Upazila & Union HID Breakdown
          </h3>
          <p className="text-14 text-slate-500 dark:text-slate-400">
            Drill down from Districts to Upazilas and Unions to see detailed HID production.
          </p>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-wrap items-center gap-12">
          {/* Main Filter Dropdown */}
          <div className="flex flex-col">
            <span className="text-11 text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold mb-4">
              Time Range
            </span>
            <select
              value={upazilaFilterType}
              onChange={(e) => {
                setUpazilaFilterType(e.target.value);
                setUpazilaSelectedMonth("");
                setUpazilaSelectedYear("");
              }}
              className="px-12 py-8 text-14 rounded-8 border border-slate-200 bg-slate-50 focus:border-primary focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:focus:border-primary text-slate-700 dark:text-slate-200 font-medium"
            >
              <option value="all_time">All Time (So Far)</option>
              <option value="last_7_days">Last 7 Days</option>
              <option value="last_month">Last Month</option>
              <option value="by_month">Month (by Name)</option>
              <option value="by_year">Year</option>
            </select>
          </div>

          {/* Month Sub-selector */}
          {upazilaFilterType === "by_month" && (
            <div className="flex flex-col">
              <span className="text-11 text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold mb-4">
                Select Month
              </span>
              <select
                value={upazilaSelectedMonth}
                onChange={(e) => setUpazilaSelectedMonth(e.target.value)}
                className="px-12 py-8 text-14 rounded-8 border border-slate-200 bg-slate-50 focus:border-primary focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:focus:border-primary text-slate-700 dark:text-slate-200 font-medium"
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Year Sub-selector */}
          {(upazilaFilterType === "by_month" || upazilaFilterType === "by_year") && (
            <div className="flex flex-col">
              <span className="text-11 text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold mb-4">
                Select Year
              </span>
              <select
                value={upazilaSelectedYear}
                onChange={(e) => setUpazilaSelectedYear(e.target.value)}
                className="px-12 py-8 text-14 rounded-8 border border-slate-200 bg-slate-50 focus:border-primary focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:focus:border-primary text-slate-700 dark:text-slate-200 font-medium"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-12 border border-slate-100 bg-slate-50/30 p-24 dark:border-slate-800 dark:bg-slate-900/30">
          <MCISpinner />
        </div>
      ) : isError ? (
        <Alert
          variant="warning"
          iconName="alert-triangle"
          isIconClicked={false}
          title="Error loading upazila-wise stats"
          body="Unable to retrieve district, upazila, and union registration counts at this time."
          isBtnGhost={true}
          hideCross={true}
        />
      ) : (
        /* Main layout split into Left (Districts) and Right (Drill Down) */
        <div className="grid grid-cols-1 gap-24 lg:grid-cols-3">
          {/* District list panel */}
          <div className="lg:col-span-1 flex flex-col space-y-16 border-r border-slate-100 dark:border-slate-800 pr-0 lg:pr-24 max-h-[500px]">
            {/* Search bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search District..."
                value={districtSearchQuery}
                onChange={(e) => setDistrictSearchQuery(e.target.value)}
                className="w-full px-16 py-8 text-14 rounded-8 border border-slate-200 bg-slate-50 focus:border-primary focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:focus:border-primary text-slate-800 dark:text-slate-100"
              />
              {districtSearchQuery && (
                <button
                  onClick={() => setDistrictSearchQuery("")}
                  className="absolute right-12 top-10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  &times;
                </button>
              )}
            </div>

            {/* District items */}
            <div className="flex-1 overflow-y-auto space-y-8 pr-4 custom-scrollbar">
              {filteredDistricts.length === 0 ? (
                <p className="text-14 text-slate-400 dark:text-slate-500 text-center py-16">
                  No districts found matching your query.
                </p>
              ) : (
                filteredDistricts.map((district) => {
                  const isSelected = selectedDistrictCode === district.districtCode;
                  return (
                    <button
                      key={district.districtCode}
                      onClick={() => {
                        setSelectedDistrictCode(isSelected ? null : district.districtCode);
                        setSelectedUpazilaCode(null);
                        setUpazilaSearchQuery("");
                      }}
                      className={`w-full flex items-center justify-between p-12 rounded-8 text-left transition-all ${
                        isSelected
                          ? "bg-slate-100 dark:bg-slate-800 border-l-4 border-l-primary text-slate-900 dark:text-slate-100 font-semibold"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <div>
                        <div className="text-14">{district.districtName}</div>
                        <div className="text-11 text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
                          {district.divisionName}
                        </div>
                      </div>
                      <div className="px-8 py-4 bg-slate-200 dark:bg-slate-700 rounded-full text-12 font-medium text-slate-700 dark:text-slate-300">
                        {district.totalCount.toLocaleString()}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Upazila & Union breakdown panel */}
          <div className="lg:col-span-2 flex flex-col space-y-16">
            {selectedDistrict ? (
              <div className="flex flex-col h-full space-y-16">
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-12 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h4 className="text-16 font-semibold text-slate-800 dark:text-slate-200">
                      {selectedDistrict.districtName} Upazilas & Unions
                    </h4>
                    <p className="text-12 text-slate-400 dark:text-slate-500">
                      Showing breakdowns under {selectedDistrict.divisionName} Division.
                    </p>
                  </div>
                  <div className="mt-8 sm:mt-0 text-14 text-slate-600 dark:text-slate-300 font-medium">
                    Total HIDs: <span className="font-bold text-primary">{selectedDistrict.totalCount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Upazila Search filter */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder={`Search Upazilas under ${selectedDistrict.districtName}...`}
                    value={upazilaSearchQuery}
                    onChange={(e) => setUpazilaSearchQuery(e.target.value)}
                    className="w-full px-16 py-8 text-14 rounded-8 border border-slate-200 bg-slate-50 focus:border-primary focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:focus:border-primary text-slate-800 dark:text-slate-100"
                  />
                  {upazilaSearchQuery && (
                    <button
                      onClick={() => setUpazilaSearchQuery("")}
                      className="absolute right-12 top-10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      &times;
                    </button>
                  )}
                </div>

                {/* Upazila list with nested Union drill-down */}
                <div className="flex-1 overflow-y-auto space-y-16 max-h-[380px] pr-4 custom-scrollbar">
                  {filteredUpazilas.length === 0 ? (
                    <p className="text-14 text-slate-400 dark:text-slate-500 text-center py-24">
                      No upazilas found matching your search.
                    </p>
                  ) : (
                    filteredUpazilas.map((upazila) => {
                      const percentage = selectedDistrict.totalCount > 0 
                        ? (upazila.count / selectedDistrict.totalCount) * 100 
                        : 0;
                      const isUpazilaExpanded = selectedUpazilaCode === upazila.upazilaCode;

                      return (
                        <div key={upazila.upazilaCode} className="space-y-8 rounded-8 border border-slate-100 dark:border-slate-800/80 p-8">
                          {/* Upazila Row Button */}
                          <button
                            onClick={() => setSelectedUpazilaCode(isUpazilaExpanded ? null : upazila.upazilaCode)}
                            className="w-full flex justify-between items-center text-14 text-left p-8 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-6 transition-all"
                          >
                            <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-8">
                              {isUpazilaExpanded ? "📂" : "📁"} {upazila.upazilaName}
                            </span>
                            <span className="text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-6">
                              {upazila.count.toLocaleString()}{" "}
                              <span className="text-12 font-normal text-slate-400 dark:text-slate-500">
                                ({percentage.toFixed(1)}%)
                              </span>
                              <span className="text-12 ml-4 text-slate-300 dark:text-slate-600">
                                {isUpazilaExpanded ? "▲" : "▼"}
                              </span>
                            </span>
                          </button>
                          
                          {/* Progress Bar (Upazila level) */}
                          <div className="px-8">
                            <div className="w-full h-8 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>

                          {/* Nested Level 3: Unions list under this Upazila */}
                          {isUpazilaExpanded && (
                            <div className="mt-8 ml-16 pl-16 pr-8 py-12 bg-slate-50/50 dark:bg-slate-800/30 rounded-8 border-l-2 border-l-secondary space-y-12 transition-all">
                              <h5 className="text-11 font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                Unions under {upazila.upazilaName}
                              </h5>
                              {upazila.unions.length === 0 ? (
                                <p className="text-12 text-slate-400 dark:text-slate-500">No union data recorded.</p>
                              ) : (
                                upazila.unions.map((union) => {
                                  const unionPercentage = upazila.count > 0 
                                    ? (union.count / upazila.count) * 100 
                                    : 0;

                                  return (
                                    <div key={union.unionCode} className="space-y-4">
                                      <div className="flex justify-between items-center text-13">
                                        <span className="text-slate-700 dark:text-slate-300 flex items-center gap-6">
                                          📄 {union.unionName}
                                        </span>
                                        <span className="text-slate-600 dark:text-slate-400 font-semibold">
                                          {union.count.toLocaleString()}{" "}
                                          <span className="text-11 font-normal text-slate-400 dark:text-slate-500 ml-4">
                                            ({unionPercentage.toFixed(1)}%)
                                          </span>
                                        </span>
                                      </div>
                                      {/* Union Progress Bar */}
                                      <div className="w-full h-6 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-secondary rounded-full transition-all duration-500"
                                          style={{ width: `${unionPercentage}%` }}
                                        />
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-12 p-24 text-center">
                <span className="text-32 mb-12">📍</span>
                <h4 className="text-15 font-semibold text-slate-600 dark:text-slate-400">
                  No District Selected
                </h4>
                <p className="text-13 text-slate-400 dark:text-slate-500 max-w-[280px]">
                  Please select a district from the left panel to load upazila and union breakdowns.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
