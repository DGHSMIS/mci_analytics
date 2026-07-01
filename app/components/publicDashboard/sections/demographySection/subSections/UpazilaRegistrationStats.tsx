"use client";

import { useState, useMemo } from "react";
import { useStore } from "@store/store";
import { MCISpinner } from "@components/MCISpinner";
import Alert from "@library/Alert";

interface UpazilaStat {
  upazilaCode: string;
  upazilaName: string;
  count: number;
}

interface DistrictStat {
  districtName: string;
  districtCode: string;
  divisionName: string;
  totalCount: number;
  upazilas: UpazilaStat[];
}

interface UpazilaRegistrationStatsProps {
  data: DistrictStat[];
  isLoading?: boolean;
  isError?: boolean;
}

export default function UpazilaRegistrationStats({
  data = [],
  isLoading = false,
  isError = false,
}: UpazilaRegistrationStatsProps) {
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<string | null>(null);
  const [districtSearchQuery, setDistrictSearchQuery] = useState("");
  const [upazilaSearchQuery, setUpazilaSearchQuery] = useState("");

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

  if (isLoading) {
    return (
      <div className="flex min-h-[250px] items-center justify-center rounded-12 border border-slate-200 bg-white p-24 dark:border-slate-800 dark:bg-slate-900">
        <MCISpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        variant="warning"
        iconName="alert-triangle"
        isIconClicked={false}
        title="Error loading upazila-wise stats"
        body="Unable to retrieve district and upazila registration counts at this time."
        isBtnGhost={true}
        hideCross={true}
      />
    );
  }

  return (
    <div className="w-full space-y-24 rounded-12 border border-slate-200 bg-white p-24 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h3 className="text-18 font-semibold text-slate-800 dark:text-slate-100">
          District & Upazila-wise HID Distribution
        </h3>
        <p className="text-14 text-slate-500 dark:text-slate-400">
          Click on any district to explore the registration counts for each of its upazilas.
        </p>
      </div>

      {/* Main layout */}
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
              className="w-full px-16 py-8 text-14 rounded-8 border border-slate-200 bg-slate-50 focus:border-primary focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:focus:border-primary"
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

        {/* Upazila breakdown panel */}
        <div className="lg:col-span-2 flex flex-col space-y-16">
          {selectedDistrict ? (
            <div className="flex flex-col h-full space-y-16">
              {/* Header info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-12 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="text-16 font-semibold text-slate-800 dark:text-slate-200">
                    {selectedDistrict.districtName} Upazilas
                  </h4>
                  <p className="text-12 text-slate-400 dark:text-slate-500">
                    Showing registration stats under {selectedDistrict.divisionName} Division.
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
                  className="w-full px-16 py-8 text-14 rounded-8 border border-slate-200 bg-slate-50 focus:border-primary focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:focus:border-primary"
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

              {/* Upazila list */}
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

                    return (
                      <div key={upazila.upazilaCode} className="space-y-6">
                        <div className="flex justify-between items-center text-14">
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {upazila.upazilaName}
                          </span>
                          <span className="text-slate-600 dark:text-slate-300 font-semibold">
                            {upazila.count.toLocaleString()}{" "}
                            <span className="text-12 font-normal text-slate-400 dark:text-slate-500 ml-4">
                              ({percentage.toFixed(1)}%)
                            </span>
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-8 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
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
                Please select a district from the left panel to load upazila breakdowns and details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
