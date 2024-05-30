"use client";
import { MCISpinner } from "@components/MCISpinner";
import { DropDownSingleItemProps } from "@library/form/DropDownSingle";
import FormItemResponseProps from "@library/form/FormItemResponseProps";
import { getAPIResponse, getRevalidationTime } from "@library/utils";
import districts from "@utils/constants/DistrictCodes.json";
import divisions from "@utils/constants/DivisionCodes.json";
import { MRT_ExpandedState } from "material-react-table";
import { signOut } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { memo, useEffect, useState } from "react";
import { getBaseUrl, getUrlFromName } from "utils/lib/apiList";

const TablePagyCustom = dynamic(
  () => import("@components/table/TablePagyCustom"),
  { ssr: true },
);

const Alert = dynamic(() => import("@library/Alert"), { ssr: true });

const Button = dynamic(() => import("@library/Button"), { ssr: true });

const DropDownSingle = dynamic(() => import("@library/form/DropDownSingle"), {
  ssr: true,
});

const TextField = dynamic(() => import("@library/form/TextField"), {
  ssr: true,
});

function PatientList({ session }: any) {
  const router = useRouter();
  // console.log("In Patient Listing");
  // console.log(session);

  const [isDistrictDisabled, setIsDistrictDisabled] = useState(true);
  const [districtList, setDistrictList] = useState<DropDownSingleItemProps[]>(
    [],
  );
  const [hid, setHid] = useState<string>("");
  const [nid, setNid] = useState<string>("");
  const [brn, setBrn] = useState<string>("");
  const [createdFacilityId, setCreatedFacilityId] = useState<string>("");
  const [createdClientId, setCreatedClientId] = useState<string>("");
  const [phoneNo, setPhoneNo] = useState<string>("");
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [selectedDivIndex, setSelectedDivIndex] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedDisIndex, setSelectedDisIndex] = useState<number | null>(null);
  const [patientListData, setPatientListData] = useState<any[]>([]);
  const [renderNow, setRenderNow] = useState<boolean>(false);
  const [groupBy, setGroupedBy] = useState<string[]>([]);
  const [tableExpanded, setTableExpanded] = useState<MRT_ExpandedState>({});

  const convertDivisionList = () => {
    const divisionItems: DropDownSingleItemProps[] = [];
    Object.entries(divisions).forEach((value, index) => {
      divisionItems.push({
        id: Number(value[0]),
        name: value[1],
      });
      // console.log(value, index);
    });
    return divisionItems;
  };

  useEffect(() => {
    const handlePage = async () => {
      if (!session) {
        await signOut().then(() => {
          console.log("Signed Out");
        });
      }
      await getPatientData();
      setRenderNow(true);
    };
    handlePage();
  }, []);

  const divisionList = convertDivisionList();

  const getDistrictItems = (divisionId: any) => {
    const districtItems: DropDownSingleItemProps[] = [];
    Object.entries(districts).forEach((value, index) => {
      if (value[0].startsWith(String(divisionId))) {
        districtItems.push({
          id: Number(value[0].substring(2)),
          name: String(value[1]),
        });
      }
    });
    console.log(districtItems);
    return districtItems;
  };

  const getPatientData = async (
    customHid: string = "",
    customNid: string = "",
    customBrn: string = "",
  ) => {
    const setQueryParams = () => {
      let queryParams = "?";
      if (customHid!=="" && customHid!=hid) {
        queryParams += `healthId=${customHid}&`;
      } else {
        if (hid!=="") {
          queryParams += `healthId=${hid}&`;
        }
      }

      if (customNid!=="" && customNid!=nid) {
        queryParams += `nationalId=${customNid}&`;
      } else {
        if (nid!=="") {
          queryParams += `nationalId=${nid}&`;
        }
      }

      if (customBrn!=="" && customBrn!=brn) {
        queryParams += `brnId=${customBrn}&`;
      } else {
        if (brn!=="") {
          queryParams += `brnId=${brn}&`;
        }
      }

      if (selectedDivision!=="") {
        queryParams += `divisionId=${selectedDivision}&`;
      }
      if (selectedDistrict!=="") {
        queryParams += `districtId=${selectedDistrict}&`;
      }
      if (phoneNo!=="") {
        queryParams += `phoneNo=${phoneNo}&`;
      }

      if (createdFacilityId!=="") {
        queryParams += `createdFacilityId=${createdFacilityId}&`;
      }
      if (createdClientId!=="") {
        queryParams += `createdClientId=${createdClientId}&`;
      }

      return queryParams;
    };
    const patientListingUrl =
      getUrlFromName("get-patient-listing") + setQueryParams();
    // console.log("patientListingUrl");
    // console.log(patientListingUrl);
    const data = await getAPIResponse(
      getBaseUrl(),
      patientListingUrl,
      session ? session.accessToken ?? "":"",
      "GET",
      null,
      false,
      getRevalidationTime(),
    );
    if(data.message){
      console.log("LOGGING OUT")
      await signOut();
    }
    const results: any = [];
    data.forEach((value: any, index: any) => {
      results.push(value._source);
    });
    setPatientListData(results);
  };

  const clearSearchForm = async () => {
    if (
      hid==="" &&
      nid==="" &&
      brn==="" &&
      selectedDivision==="" &&
      selectedDistrict==="" &&
      phoneNo==="" &&
      createdFacilityId==="" &&
      createdClientId===""
    ) {
      return;
    }

    console.log("Form Clearing");
    setHid("");
    setNid("");
    setBrn("");
    setSelectedDivision("");
    setSelectedDistrict("");
    setPhoneNo("");
    setSelectedDivIndex(null);
    setSelectedDisIndex(null);
    setCreatedFacilityId("");
    setCreatedClientId("");
    setIsDistrictDisabled(true);
    setRenderNow(false);
    const data = await getAPIResponse(
      getBaseUrl(),
      getUrlFromName("get-patient-listing"),
      session ? session.accessToken || "":"",
      "GET",
      null,
      false,
      getRevalidationTime(),
    );
    const results: any = [];
    console.log(data);
    if(data.message){
      console.log("LOGGING OUT")
      await signOut();
    }
    data.forEach((value: any, index: any) => {
      results.push(value._source);
    });
    console.log(results);
    setPatientListData(results);
    setRenderNow(true);
    // }
  };

  return (
    <div className="mt-40 h-full h-min-[500px] flex w-full flex-col justify-center space-y-48 px-24 2xl:container">
      <div className="min-h-full h-full items-end gap-16 space-y-16 sm:grid sm:grid-cols-3 sm:space-y-0 md:grid-cols-6 xl:grid-cols-9">
        <TextField
          placeholder="HID"
          label="Search HID"
          value={hid}
          fieldHeight="sm"
          onChange={(e) => {
            const data: any = e.data;
            setHid(data);
          }}
          onKeyDown={async (e: FormItemResponseProps) => {
            const data: any = e.data;
            setHid(data);
            console.log("Calling API");
            setRenderNow(false);
            await getPatientData(String(data));
            setRenderNow(true);
          }}
        />
        <TextField
          placeholder="Facility ID"
          label="Created Facility ID"
          value={createdFacilityId}
          fieldHeight="sm"
          onChange={(e) => {
            const data: any = e.data;
            setCreatedFacilityId(data);
          }}
          onKeyDown={async (e: FormItemResponseProps) => {
            const data: any = e.data;
            setCreatedFacilityId(data);
            console.log("Calling API");
            setRenderNow(false);
            await getPatientData(String(data));
            setRenderNow(true);
          }}
        />
        <TextField
          placeholder="Client ID"
          label="Created Client ID"
          value={createdClientId}
          fieldHeight="sm"
          onChange={(e) => {
            const data: any = e.data;
            setCreatedClientId(data);
          }}
          onKeyDown={async (e: FormItemResponseProps) => {
            const data: any = e.data;
            setCreatedClientId(data);
            console.log("Calling API");
            setRenderNow(false);
            await getPatientData(String(data));
            setRenderNow(true);
          }}
        />
        <TextField
          placeholder="NID"
          label="Search NID"
          fieldHeight="sm"
          value={nid}
          onChange={(e) => {
            const data: any = e.data;
            setNid(data);
          }}
          onKeyDown={async (e: FormItemResponseProps) => {
            const data: any = e.data;
            setNid(data);
            console.log("Calling API");
            setRenderNow(false);
            await getPatientData("", String(data));
            setRenderNow(true);
          }}
        />
        <TextField
          placeholder="BRN"
          label="Search BRN"
          fieldHeight="sm"
          value={brn}
          onChange={(e) => {
            const data: any = e.data;
            setBrn(data);
          }}
          onKeyDown={async (e: FormItemResponseProps) => {
            const data: any = e.data;
            setBrn(data);
            console.log("Calling API");
            setRenderNow(false);
            await getPatientData("", "", String(data));
            setRenderNow(true);
          }}
        />
        <TextField
          placeholder="Phone"
          label="Search Phone"
          fieldHeight="sm"
          value={phoneNo}
          onChange={(e) => {
            console.log(e);
            // setHid(e.target.value)
            const data: any = e.data;
            setPhoneNo(data);
          }}
        />
        <DropDownSingle
          filterPlaceholder="Division"
          isFilterable={true}
          items={divisionList}
          size="sm"
          label={"Select Division"}
          index={selectedDivIndex}
          isDisabled={false}
          isRequired={false}
          onChange={function(value: FormItemResponseProps): void {
            console.log(value.data);
            let data: any = value.data;
            console.log(data.id);
            setSelectedDivision(data.id);
            setSelectedDistrict("");
            divisionList.forEach((value, index) => {
              if (value.id==data.id) {
                setSelectedDivIndex(index);
              }
            });
            setDistrictList(getDistrictItems(data.id ?? 0));
            setIsDistrictDisabled(false);
          }}
        />
        <DropDownSingle
          filterPlaceholder="District"
          isFilterable={true}
          items={districtList}
          size="sm"
          label={"Select District"}
          index={selectedDisIndex}
          isDisabled={isDistrictDisabled}
          isRequired={false}
          onChange={function(value: FormItemResponseProps): void {
            let data: any = value.data;
            setSelectedDistrict(data.id);
            districtList.forEach((value, index) => {
              console.log(value.id);
              console.log(data.id);
              if (value.id==data.id) {
                setSelectedDisIndex(index);
              }
            });
          }}
        />
          <div className="flex items-center">
            <div
              className=" mr-24 text-slate-400 hover:cursor-pointer"
              onClick={() => {
                void clearSearchForm();
              }}
            >
              {renderNow && <span>
              clear
              </span>
              }
            </div>
            <Button
              size="md"
              fullWidth={true}
              btnText="Search"
              isDisabled={
                hid==="" &&
                nid==="" &&
                brn==="" &&
                selectedDivision==="" &&
                selectedDistrict==="" &&
                phoneNo==="" &&
                createdFacilityId==="" &&
                createdClientId===""
              }
              clicked={async () => {
                setRenderNow(false);
                await getPatientData();
                setRenderNow(true);
              }}
            />
          </div>
      </div>

      <div className="relative min-h-[400px] w-full">
        {patientListData.length && renderNow ? (
          <TablePagyCustom
            density="compact"
            grouping={groupBy}
            groupingChange={(e: any) => setGroupedBy(e)}
            rawData={patientListData}
            expandAggregated={tableExpanded}
            setExpandedAggregatedState={(e: MRT_ExpandedState) => {
              setTableExpanded(e);
            }}
            onRowClick={(row: any) => {
              router.push("/admin/patient/" + row.original.health_id);
            }}
            columnHeadersLabel={[
              {
                accessorKey: "health_id", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
                header: "Heath ID",
              },
              {
                accessorKey: "national_id",
                header: "National Id",
              },
              {
                accessorKey: "bin_brn",
                header: "BR Number",
              },
              {
                accessorKey: "given_name",
                header: "Full Name",
                minSize: 100,
                maxSize: 150,
                Cell: ({ row }: any) => {
                  const firstName = row.original.given_name ?? "";
                  const lastName = row.original.sur_name ?? "";
                  return (
                    <div className="">
                      {firstName} {lastName}
                    </div>
                  );
                },
              },
              {
                accessorKey: "division_id",
                header: "Division",
                maxSize: 130,
                Cell: ({ row }) => {
                  const divList: any = divisions;
                  return (
                    <div className="">
                      {divList[String(row.original.division_id)]}
                    </div>
                  );
                },
              },
              {
                accessorKey: "district_id",
                header: "District",
                maxSize: 130,
                Cell: ({ row }: any) => {
                  const disList: any = districts;
                  // console.log(row.original.division_id);
                  const disIdFormat =
                    row.original.district_id < 10
                      ? "0" + String(row.original.district_id)
                      :String(row.original.district_id);
                  const disId = String(row.original.division_id) + disIdFormat;
                  // console.log(disId);
                  // console.log(disList[disId]);
                  return <div className="">{disList[disId]}</div>;
                },
              },
              {
                id: "actions",
                header: "Action",
                columnDefType: "display",
                Cell: ({ row }: any) => (
                  <div className="transition-all">
                    <Button
                      clicked={() => {
                        console.log("Clicked");
                        router.push("/admin/patient/" + row.original.health_id);
                      }}
                      btnText="View"
                      className="mx-auto hover:underline hover:text-primary-700"
                      iconName="arrow-right"
                      iconPos="right"
                      variant="link"
                    />
                  </div>
                ),
              },
            ]}
          />
        ):renderNow ? (
          <Alert
            iconName="alert-triangle"
            className="m-20 w-fit"
            variant="secondary"
            showBtn={true}
            btnText="Clear Filters"
            isBtnClicked={() => {
              void clearSearchForm();
            }}
            isIconClicked={false}
            title="Are you sure about the filters?"
            body="No results were found for the given filters. Please try again with different filters."
            isBtnGhost={true}
            hideCross={true}
          />
        ):(
          <MCISpinner />
        )}
      </div>
    </div>
  );
}

export default memo(PatientList);
