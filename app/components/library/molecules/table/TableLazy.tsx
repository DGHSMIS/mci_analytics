"use client";

// If using TypeScript (optional, but recommended)
import { createTheme, ThemeProvider, useTheme } from "@mui/material";
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
/* @ts-ignore */
import type { Virtualizer } from "@tanstack/react-virtual";
import variables from "@variables/variables.module.scss";
import type { MRT_ColumnDef } from "material-react-table";
import MaterialReactTable from "material-react-table";
import {
  UIEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Icon from "../../Icon";
import { ModelObjectProps } from "../../interfaces/ApiResponseProps";
import { TableComponentProps } from "./TableProps";

//############### mock data - strongly typed if you are using TypeScript (optional, but recommended) ##################
export default function TableLazy({
  columnHeadersLabel,
  enablePagination = false,
  url,
  pageSize = 20,
  addPaginationIndexToUrl = false,
  revalidationTime = 5,
  enableRowNumbers = true,
  onRowClick,
}: TableComponentProps) {
  //###################  State For Data Loading ########################
  const [pageNo, setPageNo] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(false);
  const [loadData, setLoadData] = useState<any>([]);
  const [isReachedBottom, setIsReachedBottom] = useState(false);
  const [firstApiCalling, setFirstApiCalling] = useState(true);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });
  //################# Variables For Infinity Scroll ###########################
  const tableContainerRef = useRef<HTMLDivElement>(null); //we can get access to the underlying TableContainer element and react to its scroll events
  const rowVirtualizerInstanceRef =
    useRef<Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null); //we can get access to the underlying Virtualizer instance and call its scrollToIndex method
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isReadched, setIsReached] = useState<boolean>(true);

  //#######################  called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table #######################
  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        //once the user has scrolled within 400px of the bottom of the table, fetch more data if we can
        if (
          scrollHeight - scrollTop - clientHeight < 100 &&
          scrollHeight - scrollTop - clientHeight >= 0
        ) {
          setIsReachedBottom(true);
        }
      }
    },
    [isReachedBottom]
  );

  //################ a check on mount to see if the table is already scrolled to the bottom and immediately needs to fetch more data #########################
  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  //############## scroll to top of table when sorting or filters change ###############
  useEffect(() => {
    if (rowVirtualizerInstanceRef.current) {
      rowVirtualizerInstanceRef.current.scrollToIndex(0);
    }
  }, [sorting, columnFilters, globalFilter]);

  //################ First Loading Data ######################
  const callUserDataList = useCallback(async () => {
    setPageNo(pageNo + 1);
    if (!url) {
      return;
    }
    const apiUrl = new URL(
      url.apiUrl + `/${addPaginationIndexToUrl ? pagination.pageIndex + 1 : ""}`
    );
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    await fetch(apiUrl, url?.headerOptions)
      .then((res) => res.json())
      .then((data) => {
        if (data.status_code == 200) {
          if (data.results.length > 0) {
            setLoadData(data.results);
            setHasMoreData(true);
          }
        }
      });
  }, [pageNo, url]);

  //################# First Time Data Loading #####################
  var isFirstDataLoding = false;
  useEffect(() => {
    if (!isFirstDataLoding && firstApiCalling) {
      isFirstDataLoding = true;
      setFirstApiCalling(true);
      callUserDataList();
    }
  }, [firstApiCalling]);

  //##################### Get More Data on Scroll ##################
  const getMoreNewsPost = async () => {
    setPageNo(pageNo + 1);
    if (!url) {
      return;
    }
    await fetch(url?.apiUrl + pageNo, {
      next: { revalidate: revalidationTime },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status_code == 200) {
          if (data.results.length > 0) {
            setIsReachedBottom(false);
            setLoadData((user: any) => [...user, ...data.results]);
          } else {
            setIsReachedBottom(false);
            setHasMoreData(false);
          }
        } else {
          setIsReachedBottom(false);
          setHasMoreData(false);
        }
      });
  };

  //################### Get More Data on Scroll If Data Found ####################
  useEffect(() => {
    if (isReachedBottom && hasMoreData) {
      getMoreNewsPost();
      // setIsReachedBottom(true);
      // console.log("###########inside scrollbar inside useeffect");
    }
  }, [isReachedBottom, hasMoreData]);

  const globalTheme = useTheme(); //(optional) if you already have a theme defined in your app root, you can import here
  //################ Table Hader Column Loaded with model object #################
  const columnHeaders = useMemo<MRT_ColumnDef<ModelObjectProps>[]>(
    () => columnHeadersLabel,
    [columnHeadersLabel]
  );

  ///############### Table Theme #########################
  const tableTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: globalTheme.palette.mode, //let's use the same dark/light mode as the global theme
          primary: globalTheme.palette.primary, //swap in the secondary color as the primary for the table
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
  return (
    <ThemeProvider theme={tableTheme}>
      <MaterialReactTable
        columns={columnHeaders}
        data={useMemo(() => loadData, [loadData])}
        defaultColumn={defaultColumn}
        enableColumnOrdering={true}
        enableRowNumbers={enableRowNumbers} //needed for lazy loading
        enableRowVirtualization={true} //needed for lazy loading
        manualFiltering={true} //needed for lazy loading
        manualSorting={true} //needed for lazy loading
        muiTableContainerProps={{
          //needed for lazy loading
          ref: tableContainerRef, //get access to the table container element
          sx: { maxHeight: "600px" }, //give the table a max height
          onScroll: (
            event: UIEvent<HTMLDivElement> //add an event listener to the table container element
          ) => fetchMoreOnBottomReached(event.target as HTMLDivElement),
        }}
        muiTableBodyRowProps={({ row }) => ({
          onClick: (event) => {
            if (onRowClick) {
              onRowClick(row);
            }
          },
          sx: {
            cursor: "pointer", //you might want to change the cursor too when adding an onClick
          },
        })}
        onColumnFiltersChange={setColumnFilters} //needed for lazy loading
        onGlobalFilterChange={setGlobalFilter} //needed for lazy loading
        onSortingChange={setSorting} //needed for lazy loading
        state={{
          columnFilters,
          globalFilter,
          sorting,
        }}
        rowVirtualizerInstanceRef={rowVirtualizerInstanceRef} //needed for lazy loading -- get access to the virtualizer instance
        rowVirtualizerProps={{ overscan: 4 }} //needed for lazy loading
        enableColumnResizing={true}
        enableStickyHeader={true}
        enablePinning={true}
        enableGrouping={true}
        columnResizeMode="onChange"
        initialState={
          {
            // grouping: ['age'],
            // columnPinning: {
            //   left: ['name'],
            // },
          }
        }
        enablePagination={enablePagination}
        muiTablePaginationProps={{
          rowsPerPageOptions: [5, 10],
          showFirstButton: false,
          showLastButton: false,
        }}
        enableGlobalFilter={false} //turn off a feature
        icons={{
          ArrowDownwardIcon: (props: any) => (
            <Icon iconName="chevron-up" {...props} />
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
          SearchIcon: (props: any) => <Icon iconName="search-lg" {...props} />,
          // FilterAltIcon: (props: any) => <Icon iconName='filter-line' {...props} />,
          // FilterListOffIcon: (props: any) => <Icon iconName='equal-not' {...props} />,
        }}
      />
    </ThemeProvider>
  );
}
