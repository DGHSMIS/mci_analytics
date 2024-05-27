import { ModelObjectProps } from "@library/interfaces/ApiResponseProps";
import {
  MRT_ColumnDef,
  MRT_DensityState,
  MRT_ExpandedState,
  MRT_Row,
} from "material-react-table";

export interface TableComponentProps {
  // data: ModelObjectInterface[];
  columnHeadersLabel: MRT_ColumnDef<ModelObjectProps>[];
  // defaultColumn: Object;
  url?: TableUrlParameterProps;
  method?: "GET" | "POST";
  body?: any | null;
  addPaginationIndexToUrl?: boolean;
  onRowClick?: (event: MRT_Row<ModelObjectProps>) => void;
  enableRowSelection?: boolean;
  revalidationTime?: number;
  onRowSelectionChange?: (event: any, data?: any, selectedData?: any) => void;
  enablePagination?: boolean;
  pageSize?: number;
  density?: MRT_DensityState;
  enableRowNumbers?: boolean;
  manualSorting?: boolean;
  enableGlobalFilter?: boolean;
  rawData?: Array<any>;
  sizeName?: string;
  startName?: string;
  grouping?: Array<string>;
  totalRowName?: string;
  printOptions?: PrintProps;
  rowPerPageOptions?: Array<number>;
  groupingChange?: (event: any) => void;
  expandAggregated?: MRT_ExpandedState;
  setExpandedAggregatedState?: (event: any) => void;
  onLoading?: (isLoading: boolean) => void;
}

export interface TableUrlParameterProps {
  apiUrl: string;
  headerOptions: RequestInit | undefined;
}

export interface PrintProps {
  enablePrint?: boolean;
  enablePdf?: boolean;
  enableCsv?: boolean;
  enableExcel?: boolean;
  fileName?: string;
  pdfOptions?: {
    pdfDimensions: number[];
    pdfFontSize: number;
    pdfOrientation: "landscape" | "portrait";
  };
}
