"use client";

import ButtonIcon from "@library/ButtonIcon";
import Icon from "@library/Icon";
import { ModelObjectProps } from "@library/interfaces/ApiResponseProps";
// If using TypeScript (optional, but recommended)
import { createTheme, ThemeProvider, useTheme } from "@mui/material";
import variables from "@variables/variables.module.scss";
import type { MRT_ColumnDef } from "material-react-table";
import MaterialReactTable from "material-react-table";
import React, { useMemo } from "react";

//mock data - strongly typed if you are using TypeScript (optional, but recommended)
export default function TableComponentCustom({ data, defaultColumn }: any) {
  const globalTheme = useTheme(); //(optional) if you already have a theme defined in your app root, you can import here

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
  const columnDef = useMemo<MRT_ColumnDef<ModelObjectProps>[]>(
    () => [
      // {
      // 	header: 'Whatever Name',
      // 	id: 'my-group',
      // 	columns: [
      // 		{
      // 			accessorKey: 'name', //simple recommended way to define a column
      // 			header: 'Name',
      // 			// Header: ({ row }: any) => <b>Hell</b>,
      // 			// Cell: ({ row }) => <i>Noob</i>,
      // 		},
      // 		{
      // 			// accessorFn: (originalRow) => originalRow.age, //alternate way
      // 			id: 'age', //id required if you use accessorFn instead of accessorKey
      // 			accessorKey: 'age',
      // 			header: 'Age',
      // 			// filterVariants: 'range',
      // 			// filterFn: 'inNumberRange',
      // 			aggregationFn: 'mean',
      // 			aggregationLabel: 'Mean',
      // 		},
      // 	],
      // },
      {
        accessorKey: "name", //simple recommended way to define a column
        header: "Name",
        // Header: ({ row }: any) => <b>Hell</b>,
        // Cell: ({ row }) => <i>Noob</i>,
      },
      {
        // accessorFn: (originalRow) => originalRow.age, //alternate way
        id: "age", //id required if you use accessorFn instead of accessorKey
        accessorKey: "age",
        header: "Age",
        // filterVariants: 'range',
        // filterFn: 'inNumberRange',
        aggregationFn: "mean",
        aggregationLabel: "Mean",
      },
      {
        accessorKey: "location",
        header: "Location",
        // muiTableHeadCellProps: { sx: { color: 'blue' } }, //custom props
        // enableColumnFilter: false, //turn off a feature
        // Cell: ({ row }) => {
        //   console.log(row.original.location);
        //   // return <>Hello</>
        //   return (
        //     <StatusPill
        //       value={row.original.location}
        //       optionsItems={['Pending', 'Uploaded', 'Unknown']}
        //     />
        //   );
        // },
      },
      {
        id: "actions",
        header: "Actions",
        columnDefType: "display",
        Cell: ({ row }) => (
          <div className="space-x-10">
            <ButtonIcon
              key="i"
              iconName="edit-05"
              // title={item.title}
              className=""
              isDisabled={false}
              btnId={parseInt(row.id)}
              clicked={() => {
                console.log(row.original.id);
                console.log(1);
              }}
            />
            <ButtonIcon
              key="i"
              iconName="download-01"
              // title={item.title}
              className=""
              isDisabled={false}
              btnId={parseInt(row.id)}
              clicked={() => {
                console.log(row.original.id);
                console.log(2);
              }}
            />
            <ButtonIcon
              key="i"
              iconName="trash-01"
              // title={item.title}
              className=""
              isDisabled={false}
              btnId={parseInt(row.id)}
              clicked={() => {
                console.log(row.original.id);
                console.log(3);
              }}
            />
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions2",
        columnDefType: "display",
        Cell: ({ row }) => (
          <ButtonIcon
            key="i"
            // title={item.title}
            className=""
            isDisabled={false}
            btnId={parseInt(row.id)}
            clicked={() => {
              console.log(row.id);
              console.log(1);
            }}
          />
        ),
      },
      {
        id: "actions",
        header: "Actions2",
        columnDefType: "display",
        Cell: ({ row }) => (
          <ButtonIcon
            key="i"
            // title={item.title}
            className=""
            isDisabled={false}
            btnId={parseInt(row.id)}
            clicked={() => {
              console.log(row.id);
              console.log(1);
            }}
          />
        ),
      },
      {
        id: "actions",
        header: "Actions2",
        columnDefType: "display",
        Cell: ({ row }) => (
          <ButtonIcon
            key="i"
            // title={item.title}
            className=""
            isDisabled={false}
            btnId={parseInt(row.id)}
            clicked={() => {
              console.log(row.id);
              console.log(1);
            }}
          />
        ),
      },
      {
        id: "actions",
        header: "Actions2",
        columnDefType: "display",
        Cell: ({ row }) => (
          <ButtonIcon
            key="i"
            // title={item.title}
            className=""
            isDisabled={false}
            btnId={parseInt(row.id)}
            clicked={() => {
              console.log(row.id);
              console.log(1);
            }}
          />
        ),
      },
      {
        id: "actions",
        header: "Actions2",
        columnDefType: "display",
        Cell: ({ row }) => (
          <ButtonIcon
            key="i"
            // title={item.title}
            className=""
            isDisabled={false}
            btnId={parseInt(row.id)}
            clicked={() => {
              console.log(row.id);
              console.log(1);
            }}
          />
        ),
      },
      {
        id: "actions",
        header: "Actions2",
        columnDefType: "display",
        Cell: ({ row }) => (
          <ButtonIcon
            key="i"
            // title={item.title}
            className=""
            isDisabled={false}
            btnId={parseInt(row.id)}
            clicked={() => {
              console.log(row.id);
              console.log(1);
            }}
          />
        ),
      },
    ],
    []
  );

  return (
    <ThemeProvider theme={tableTheme}>
      <MaterialReactTable
        columns={columnDef}
        data={data}
        defaultColumn={defaultColumn}
        enableColumnOrdering={true}
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
        enablePagination={true}
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
