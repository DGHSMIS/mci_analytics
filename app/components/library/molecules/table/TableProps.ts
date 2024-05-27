import { ModelObjectProps } from "@library/interfaces/ApiResponseProps";
import { MRT_ColumnDef, MRT_DensityState, MRT_Row } from "material-react-table";

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
  totalRowName?: string;
  printOptions?: PrintProps;
  rowPerPageOptions?: Array<number>;
  onLoading?: (isLoading: boolean) => void;
  /**
   * @description
   * This is the key (supports deep key dot notation) that will be used to access the
   * data from the response.
   * @example
   * If the response is like this:
   * ```json
   * {
   *   "status": 200,
   *   "results": {
   *     "content": [...],
   *     "pageable": {...},
   *     "last": true,
   *     "totalPages": 1,
   *     "totalElements": 4,
   *     "size": 50,
   *     "number": 0,
   *     "first": true,
   *     "empty": false
   *   },
   *   "totalRows": null
   * }
   * ```
   * The dataAccessorKey will be `results.content`
   */
  dataAccessorKey?: string;
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
