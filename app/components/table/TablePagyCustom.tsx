"use client";

// If using TypeScript (optional, but recommended)
import Button from "@library/Button";
import ButtonIcon from "@library/ButtonIcon";
import Flyout from "@library/Flyout";
import Icon from "@library/Icon";
import { ModelObjectProps } from "@library/interfaces/ApiResponseProps";
import { createTheme, PaletteColorOptions, ThemeProvider, useTheme } from "@mui/material";
import type { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import variables from "@variables/variables.module.scss";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ceil } from "lodash";
import type { MRT_ColumnDef } from "material-react-table";
import MaterialReactTable from "material-react-table";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { utils, writeFile } from "xlsx";
import { PrintProps, TableComponentProps } from "./TablePropsCustom"; // ! Example of API Params to send to this Component

// ! Example of API Params to send to this Component
// const tableURLWithParams: TableUrlParameterProps = {
//   apiUrl: 'https://megafeedapi.aritsltd.com/api/auth/user/data/list',
//   headerOptions: {
//     headers: {
//       Authorization: 'Bearer 22|zqci67kT20mewc3xkjDlc6LacBGa6nX9zswSluPz',
//       'Access-Control-Allow-Origin': '*',
//     }
//   },
// };

/*
  ! Example of Column Header to send to this Component
  Ref: https://www.material-react-table.com/docs/api/column-options#accessorKey-column-option
*/
// const headerColumn: MRT_ColumnDef<ModelObjectProps>[] = [
//   {
//     accessorKey: 'name', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
//     header: 'Name',
//   },
//   {
//     accessorKey: 'id', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
//     header: '# of submissions',
//   },
//   {
//     accessorKey: 'role_id', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
//     header: 'Due Date',
//   },
//   {
//     id: 'actions',
//     header: 'Actions',
//     columnDefType: 'display',
//     Cell: ({ row }) => (
//       <div className='space-x-10'>
//         <ButtonIcon
//           key='1'
//           iconName='edit-05'
//           // title={item.title}
//           className=''
//           isDisabled={false}
//           btnId={parseInt(row.id)}
//           clicked={() => {
//             console.log(row.original.id);
//             console.log(1);
//           }}
//         />
//         <ButtonIcon
//           key='2'
//           iconName='download-01'
//           // title={item.title}
//           className=''
//           isDisabled={false}
//           btnId={parseInt(row.id)}
//           clicked={() => {
//             console.log(row.original.id);
//             console.log(2);
//           }}
//         />
//         <ButtonIcon
//           key='3'
//           iconName='trash-01'
//           // title={item.title}
//           className=''
//           isDisabled={false}
//           btnId={parseInt(row.id)}
//           clicked={() => {
//             console.log(row.original.id);
//             console.log(3);
//           }}
//         />
//       </div>
//     ),
//   },
// ];

export const printDefaultConfig: PrintProps = {
  enablePrint: true,
  enablePdf: true,
  enableCsv: false,
  enableExcel: true,
  fileName: "table",
};

//############### mock data - strongly typed if you are using TypeScript (optional, but recommended) ##################
const TablePagyCustom = memo(function TablePagy({
  columnHeadersLabel,
  url,
  method = "GET",
  body = null,
  enableRowSelection = false,
  enableRowNumbers = false,
  revalidationTime = 5,
  addPaginationIndexToUrl = false,
  manualSorting = false,
  enableGlobalFilter = false,
  enablePagination = true,
  pageSize = 20,
  rawData = [],
  sizeName = "size",
  startName = "start",
  totalRowName = "total_row",
  rowPerPageOptions = [50, 100, 150, 200, 250],
  onRowClick,
  onRowSelectionChange,
  printOptions = { ...printDefaultConfig },
  onLoading,
  grouping = [],
  groupingChange,
  expandAggregated = {},
  setExpandedAggregatedState,
  density = "comfortable",
}: TableComponentProps) {
  const componentRef = useRef(null);
  //data and fetching state
  const [data, setData] = useState<any>(rawData);
  const [isError, setIsError] = useState(false);
  const [isDownloadFlyoutOpen, setIsDownloadFlyoutOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRowArray, setSelectedRowArray] = useState<any>([]);

  //table state
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const [paginationOld, setPaginationOld] = useState<PaginationState>();
  const [selectedData, setSelectedData] = useState<
    { row: never[] | {}; data: never[]; pageIndex: number }[]
  >([]);
  const [pageNumber, setPageNumber] = useState(0);

  useEffect(() => {
    //*setting the total page number
    setPageNumber(ceil(rowCount / pageSize));
  }, [rowCount]);

  useEffect(() => {
    //*defining array length as per to total page number to store each page selected row index

    if (pageNumber > 0) {
      for (let index = 0; index < pageNumber; index++) {
        setSelectedData((prev) => {
          return [...prev, { row: [], data: [], pageIndex: index }];
        });
      }
    }
  }, [pageNumber]);

  useEffect(() => {
    //*storing selected row id

    if (onRowSelectionChange) {
      onRowSelectionChange(rowSelection, data, selectedRowArray);
    }
    if (selectedData.length > 0) {
      selectedData.map((dataSelected, index) => {
        if (index == pagination.pageIndex) {
          if (rowSelection) {
            selectedData[index]["row"] = rowSelection;
            selectedData[index]["data"] = rowData2;
          }
        }
      });
    }
  }, [rowSelection]);

  var arrayData: any = [];
  const [rowData2, setRowData2] = useState<any>([]);

  useEffect(() => {
    //*storing row data to data array

    if (rowSelection) {
      Object.keys(rowSelection).map((row, index) => {
        data.filter((dataObj: any, id: any) => {
          if (id == parseInt(row)) {
            setRowData2((prev: any) => {
              return [...prev];
            });
            arrayData.push(dataObj);
            if (arrayData.length > 0) {
              setRowData2(arrayData);
            }
          }
        });
      });
    }
  }, [rowSelection]);

  useEffect(() => {
    //*appending stored row data to main array

    if (selectedData.length > 0) {
      selectedData.map((dataSelected, index) => {
        if (index == pagination.pageIndex) {
          if (rowSelection) {
            selectedData[index]["data"] = rowData2;
          }
        }
      });
    }
  }, [rowData2]);

  useEffect(() => {
    if (selectedData && selectedData.length > 0) {
      setSelectedRowArray([]);

      selectedData.map((data, index) => {
        data["data"].map((element) => {
          setSelectedRowArray((prev: any) => {
            return [...prev, element];
          });
        });
      });
    }
  }, [rowData2]);

  useEffect(() => {
    //*while page changing,getting a specific page selected row id and data from the page specific index

    if (selectedData && rowSelection && pagination) {
      selectedData.map((data, index) => {
        if (selectedData[index]["pageIndex"] == pagination.pageIndex) {
          setRowSelection(selectedData[index]["row"]);
          setRowData2(selectedData[index]["data"]);
        }
      });
    }
  }, [pagination]);

  useEffect(() => {
    //*returning rowSelection(selected row's index),data(full dataset),selectedRowArray(selected rows data) to the parent

    if (onRowSelectionChange) {
      let indexes = Object.keys(rowSelection);
      onRowSelectionChange(rowSelection, data, selectedRowArray);
    }
  }, [selectedRowArray]);

  useEffect(() => {
    onLoading?.(isLoading);
  }, [isLoading, onLoading]);

  useEffect(() => {
    if (typeof window !== undefined) {
      // browser code
      window.addEventListener("click", handleOutsideClick);
    }
  }, [isDownloadFlyoutOpen]);

  function handleOutsideClick() {
    if (isDownloadFlyoutOpen) {
      setIsDownloadFlyoutOpen(false);
    }
  }

  const globalTheme = useTheme(); //(optional) if you already have a theme defined in your app root, you can import here
  //################ Table Hader Column Loaded with model object #################
  const columnHeaders = useMemo<MRT_ColumnDef<ModelObjectProps>[]>(
    () => columnHeadersLabel,
    [columnHeadersLabel]
  );

  const fetchData = async () => {
    if (!data.length) {
      setIsLoading(true);
    } else {
      setIsRefetching(true);
    }
    if (!url) {
      return;
    }
    //   API URL is Requesting && Add Pagination Index to URL if requested
    const apiUrl = new URL(
      url.apiUrl + `/${addPaginationIndexToUrl ? pagination.pageIndex + 1 : ""}`
    );
    //   const apiUrl = new URL(url.apiUrl, process.env.NODE_ENV === 'production'? url.baseUrl: url.baseUrl, );

    apiUrl.searchParams.set(
      startName,
      `${pagination.pageIndex * pagination.pageSize}`
    );
    apiUrl.searchParams.set(sizeName, `${pagination.pageSize}`);
    try {
      // Api Calling from here
      // console.log(url.headerOptions);
      // console.log(url.apiUrl);
      //add no cache property inside options
      console.log("URL Headers Found");
      console.log(url);
      const options: RequestInit = {
        ...url.headerOptions,
        method: method,
        next: { revalidate: revalidationTime },
        body: body ? JSON.stringify(body) : null,
      };

      const response = await fetch(apiUrl.href, options);
      const json = await response.json();
      console.log("Here is data");
      console.log(json);

      //If response is successfully but the response returns no data then set the data to empty array
      if (json.results !== undefined) {
        setData(json.results);
        console.log("Total Row:", json[totalRowName]);
        setRowCount(json[totalRowName]);
      } else {
        setData([]);
        setRowCount(0);
      }
    } catch (error) {
      setIsError(true);
      console.error(error);
      return;
    }
    setIsError(false);
    setIsLoading(false);
    setIsRefetching(false);
  };

  useEffect(() => {
    // ! Use this useEffects to handle globalFilter via the API using fetch method. TBD
    console.log(globalFilter);
  }, [globalFilter]);

  //if you want to avoid useEffect, look at the React Query example instead
  useEffect(() => {
    console.log(pagination.pageIndex);
    if (!rawData.length && url) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex, pagination.pageSize]);
  const primaryColor: PaletteColorOptions = {
    light: variables.primary100,
    main: variables.primary500,
    dark: variables.primary700,
    contrastText: variables.gray200,
  };
  //Sorting Via API (TBD)
  useEffect(() => {
    if (manualSorting && !rawData.length) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting]);
  ///############### Table Theme #########################
  const tableTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: globalTheme.palette.mode, //let's use the same dark/light mode as the global theme
          primary: primaryColor, //swap in the secondary color as the primary for the table
          info: {
            main: "rgb(255,122,0)", //add in a custom color for the toolbar alert background stuff
          },
          background: {
            default:
              globalTheme.palette.mode === "light"
                ? "#fff" //random light yellow color for the background in light mode
                : "#000", //pure black table in dark mode for fun
          },
        },
        typography: {
          fontFamily: "inherit",
          allVariants: {
            color: `${variables.gray500}`,
          },
          button: {
            textTransform: "none",
            fontSize: ".875rem",
          },
        },
        components: {
          MuiToolbar: {
            styleOverrides: {
              root: {
                backgroundColor: `${variables.gray100} !important`,
                overflow: "initial !important",
                zIndex: "initial !important",
              },
            },
          },

          // * Main Table [Parent]
          MuiPaper: {
            styleOverrides: {
              elevation: {
                boxShadow: "none !important",
                borderRadius: "8px !important",
                border: `1px solid ${variables.gray200} !important`,
                overflow: "hidden",
              },
            },
          },

          MuiTableRow: {
            styleOverrides: {
              root: {
                boxShadow: "none !important",
              },
            },
          },
          // MuiTableHead: {
          // 	styleOverrides: {
          // 		root: {
          // 			fontWeight: '500',
          // 			backgroundColor: 'red !important',
          // 		},
          // 	},
          // },
          MuiTableCell: {
            styleOverrides: {
              stickyHeader: {
                fontWeight: "400 !important",
                fontSize: ".75rem",
                textTransform: "uppercase",
                color: `${variables.gray500}`,
                letterSpacing: "2px",
              },
              head: {
                backgroundColor: `${variables.gray100} !important`,
              },
              body: {
                color: `${variables.gray700}`,
                borderColor: `${variables.gray200}`,
                boxShadow: "none",
                fontSize: "1rem",
                fontWeight: "400",
              },
            },
          },

          // * FORMS //
          MuiFormControl: {
            styleOverrides: {
              root: {
                fontFamily: "inherit",
                color: `${variables.gray400}`,
                letterSpacing: "0",
              },
            },
          },
          //  - Input //
          MuiInputBase: {
            styleOverrides: {
              root: {
                ":hover": {
                  ":before": {
                    // borderColor: `${variables.primary500} !important`,
                    borderBottom: `1px solid ${variables.primary500} !important`,
                  },
                },
                ":after": {
                  // borderColor: `${variables.primary500} !important`,
                  borderBottom: `1px solid ${variables.primary500} !important`,
                },
              },
            },
          },
          MuiInput: {
            styleOverrides: {
              input: {
                ":focus": {
                  borderColor: "transparent !important",
                  outline: "none !important",
                  boxShadow: "none !important",
                },
                ":hover": {
                  borderColor: `${variables.primary500} !important`,
                },
              },
            },
          },

          MuiDivider: {
            styleOverrides: {
              fullWidth: {
                borderColor: `{variables.primary500} !important`,
              },
              root: {
                borderColor: `{variables.primary500} !important`,
              },
            },
          },

          MuiButton: {
            styleOverrides: {
              root: {
                color: `${variables.primary500}`,
                backgroundColor: `${variables.gray200}`,
                outline: "none",
              },
            },
          },
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                fontSize: ".875rem", //override to make tooltip font size larger
              },
            },
          },
          MuiSwitch: {
            styleOverrides: {
              track: {
                backgroundColor: `${variables.primary300} !important`,
              },
              thumb: {
                color: `${variables.primary500}`,
              },
            },
          },
        },
      }),
    [globalTheme]
  );
  //column definitions - strongly typed if you are using TypeScript (optional, but recommended)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const defaultColumn = { minSize: 40, maxSize: 1000, size: 180 };

  /**
   * This function exports Material Table data in the specified format (CSV or PDF).
   * It takes into account various print options for better customization.
   *
   * @param {("excel" | "csv" | "pdf")} format - The desired export format, either "csv" or "pdf". Defaults to "csv".
   */
  const exportData = (format: "excel" | "csv" | "pdf" = "excel") => {
    if (format === "excel") {
      // Create a new workbook object
      const workbook = utils.book_new();

      // Convert the data array to an array of arrays, including headers
      const dataWithHeaders = [
        columnHeaders.map((col) => col.header ?? col.accessorKey),
        ...data.map((row: any) =>
          columnHeaders.map((col) => row[col.accessorKey ?? col.header] ?? "")
        ),
      ];

      // Create a new worksheet from the data with headers
      const worksheet = utils.aoa_to_sheet(dataWithHeaders);

      // Append the worksheet to the workbook
      utils.book_append_sheet(workbook, worksheet, "Sheet1");

      // Write the workbook to an XLS file and trigger a download

      writeFile(workbook, printOptions.fileName + ".xls" ?? "table-data.xls", {
        bookType: "xls",
      });
    } else if (format === "csv") {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,
      const csvContent: ModelObjectProps[] = data
        .map((row: any) =>
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          columnHeaders
            .map((col: any) => {
              // escape comma if it is in the value
              console.log(col.accessorKey);
              console.log(row);

              console.log(row[col.accessorKey ?? col.header]);
              const headerItem = row[col.accessorKey ?? col.header]
                ? String(row[col.accessorKey ?? col.header]).replace(/,/g, " ")
                : "";

              console.log(headerItem);
              return headerItem;
            })
            .join(",")
        )
        .join("\n");
      console.log(csvContent);
      const header = columnHeaders.map((col) => col.header).join(",") + "\n";
      console.log(header);
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      const mergedData = header + csvContent;
      const csvData = new Blob([mergedData], {
        type: "text/csv;charset=utf-8;",
      });
      console.log("Here");
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      saveAs(csvData, printOptions.fileName + ".csv" ?? "table-data" + ".csv");
    } else if (format === "pdf") {
      // Parse the CSV data into an array of objects
      const headers: string[] = columnHeaders.map((col) => {
        //length of the header text is long, then make ellipsis
        const headerText = col.header ?? col.accessorKey;
        return headerText;
      });

      //get the number of header items
      const headerLength = headers.length;

      const printOrientation = printOptions.pdfOptions?.pdfOrientation
        ? printOptions.pdfOptions?.pdfOrientation
        : headerLength > 7
        ? "landscape"
        : "portrait";

      const pdfDmn = printOptions.pdfOptions?.pdfDimensions
        ? printOptions.pdfOptions?.pdfDimensions
        : headerLength > 20
        ? [3508, 2480]
        : [841.89, 595.28];

      const doc = new jsPDF(printOrientation, "pt", pdfDmn);

      const fontSize = printOptions.pdfOptions?.pdfFontSize
        ? printOptions.pdfOptions?.pdfFontSize
        : headerLength > 20
        ? 8
        : 12;
      doc.setFontSize(fontSize);

      const dataItems: string[] = data.map((row: any) => {
        const rowItem = columnHeaders.map((col, index) => {
          const rowData = row[col.accessorKey ?? col.header]
            ? String(row[col.accessorKey ?? col.header])
            : "";
          return rowData;
        });
        return rowItem;
      });

      //as we have too much data, we need to split the data into differnt pages
      // split data object for 50 rows per page
      const dataChunk = fontSize > 8 ? 50 : 100;
      const dataLength = dataItems.length;
      const pageCount = Math.ceil(dataLength / dataChunk);
      for (let i = 0; i < pageCount; i++) {
        // create a page
        if (i > 0) {
          doc.addPage();
        }
        // add table header
        autoTable(doc, {
          head: [headers],
          body: dataItems as any,
          startY: 60,
          // theme: "grid",
          styles: {
            fontSize: fontSize,
            // cellPadding: 1,
            // cellWidth: "wrap",
            overflow: "linebreak",
          },
        });
      }
      doc.save(printOptions.fileName + ".pdf" ?? "table-data" + ".pdf");
    }
  };

  const flyOutItems = () => {
    let childrenItems: any = [];

    if (printOptions.enablePdf) {
      childrenItems.push(
        <Button
          fullWidth={true}
          iconClassName="-mt-2"
          btnText="Download PDF"
          clicked={() => void exportData("pdf")}
          iconColor={variables.gray500}
          iconName="download-01"
          iconPos="left"
          iconSize="20px"
          iconStrokeWidth="2"
          outline
          size="sm"
          textClassName=""
          variant="neutral"
        />
      );
    }
    if (printOptions.enableCsv) {
      childrenItems.push(
        <Button
          fullWidth={true}
          iconClassName="-mt-2"
          btnText="Download CSV"
          clicked={() => void exportData("csv")}
          iconColor={variables.gray500}
          iconName="download-01"
          iconPos="left"
          iconSize="20px"
          iconStrokeWidth="2"
          outline
          size="sm"
          textClassName=""
          variant="neutral"
        />
      );
    }
    if (printOptions.enableExcel) {
      childrenItems.push(
        <Button
          fullWidth={true}
          iconClassName="-mt-2"
          btnText="Download Excel"
          clicked={() => void exportData("excel")}
          iconColor={variables.gray500}
          iconName="download-01"
          iconPos="left"
          iconSize="20px"
          iconStrokeWidth="2"
          outline
          size="sm"
          textClassName=""
          variant="neutral"
        />
      );
    }
    return childrenItems;
  };

  return (
    <span ref={componentRef}>
      <ThemeProvider theme={tableTheme}>
        <MaterialReactTable
          columns={columnHeaders}
          data={data}
          defaultColumn={defaultColumn}
          enableColumnOrdering={true}
          enableColumnFilters={true}
          enablePagination={enablePagination}
          enableRowSelection={enableRowSelection}
          enableRowNumbers={enableRowNumbers} //needed for lazy loading
          muiTablePaginationProps={{
            rowsPerPageOptions: enableRowSelection ? [] : rowPerPageOptions,
            showFirstButton: false,
            showLastButton: false,
          }}
          renderTopToolbarCustomActions={() => {
            const items: Array<any> = flyOutItems();

            return (
              <div className="flex w-full justify-end">
                {printOptions.enablePrint && (
                  <>
                    <Flyout
                      controllingComponent={[
                        <ButtonIcon
                          key={Math.random() * 20 + 3}
                          iconName="download-01"
                          iconColor={variables.gray400}
                          className="!relative !top-6 !mr-6"
                          clicked={() => {
                            if (!isDownloadFlyoutOpen) {
                              setIsDownloadFlyoutOpen(true);
                            } else {
                              setIsDownloadFlyoutOpen(false);
                            }
                          }}
                        />,
                      ]}
                      isOpen={isDownloadFlyoutOpen}
                      items={items}
                    />
                  </>
                )}
              </div>
            );
          }}
          // renderTopToolbarCustomActions={({ table }) => (
          //   <Button
          //     variant="contained"
          //     color="primary"
          //     //extract all selected rows from the table instance and do something with them
          //     onClick={() => downloadCSV()}
          //   >
          //     Download Selected Rows
          //   </Button>
          // )}
          // onRowSelectionChange={ e => {
          //   if (onRowSelectionChange) {
          //     onRowSelectionChange(e);
          //   }
          // }}
          // For pagination purposes
          // getRowId={(row) => row.id}
          initialState={{
            showColumnFilters: false,
            density: density,
          }}
          manualFiltering={false}
          manualPagination
          manualSorting={manualSorting}
          muiToolbarAlertBannerProps={
            isError
              ? {
                  color: "error",
                  children: "Error loading data",
                }
              : undefined
          }
          onPaginationChange={setPagination}
          globalFilterModeOptions={["fuzzy", "startsWith"]}
          onSortingChange={(e) => {
            setSorting(e);
          }}
          onRowSelectionChange={(e) => {
            console.log("Selected row values");
            console.log(e);
            console.log(selectedRowArray);
            setRowSelection(e);
          }}
          rowCount={rowCount}
          muiTableBodyRowProps={({ row }) => ({
            onClick: (event) => {
              // if (!enableRowSelection) {
              if (onRowClick) {
                onRowClick(row);
              }
              // }
            },
            sx: {
              cursor: "pointer", //you might want to change the cursor too when adding an onClick
            },
          })}
          // muiLinearProgressProps={({ isTopToolbar }) => ({
          //   color: "primary",
          //   variant: "determinate",
          // })}
          state={{
            // columnFilters,
            // globalFilter,
            isLoading,
            pagination,
            showAlertBanner: isError,
            showProgressBars: isRefetching,
            sorting,
            rowSelection,
            grouping,
            expanded: expandAggregated,
          }}
          onExpandedChange={(e) => {
            console.log(e);
            if (setExpandedAggregatedState) {
              setExpandedAggregatedState(e);
            }
          }}
          // End Pagination purposes
          enableColumnResizing={true}
          enableStickyHeader={true}
          enablePinning={true}
          columnResizeMode="onChange"
          enableGrouping={true}
          enableGlobalFilter={enableGlobalFilter} //turn off a feature
          enableGlobalFilterModes={true}
          onGlobalFilterChange={setGlobalFilter}
          onGroupingChange={groupingChange}
          icons={{
            ArrowDownwardIcon: (props: any) => (
              <Icon iconName="chevron-up" {...props} iconSize="16" />
            ),
            FullscreenIcon: (props: any) => (
              <Icon iconName="maximize-02" {...props} />
            ),
            FullscreenExitIcon: (props: any) => (
              <Icon iconName="minimize-02" {...props} />
            ),
            ViewColumnIcon: (props: any) => (
              <Icon iconName="columns-03" {...props} />
            ),
            DragHandleIcon: (props: any) => (
              <Icon iconName="menu-05" {...props} />
            ),
            MoreHorizIcon: (props: any) => (
              <Icon iconName="dots-horizontal" {...props} />
            ),
            MoreVertIcon: (props: any) => (
              <Icon iconName="dots-vertical" {...props} />
            ),
            DensityLargeIcon: (props: any) => (
              <Icon iconName="rows-03" {...props} />
            ),
            DensityMediumIcon: (props: any) => (
              <Icon iconName="rows-03" {...props} />
            ),
            DensitySmallIcon: (props: any) => (
              <Icon iconName="rows-03" {...props} />
            ),
            CloseIcon: (props: any) => <Icon iconName="x" {...props} />,
            SaveIcon: (props: any) => <Icon iconName="save-02" {...props} />,
            SearchIcon: (props: any) => (
              <Icon iconName="search-lg" {...props} />
            ),
            // FilterAltIcon: (props: any) => <Icon iconName='filter-line' {...props} />,
            // FilterListOffIcon: (props: any) => <Icon iconName='equal-not' {...props} />,
          }}
        />
      </ThemeProvider>
    </span>
  );
});

export default TablePagyCustom;
