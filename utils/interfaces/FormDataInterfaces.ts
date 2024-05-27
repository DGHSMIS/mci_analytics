import { DivisionInterface } from "@utils/interfaces/LocalityInterfaces";

export interface DateRangeFormInterface {
  dateFrom?: string;
  dateTo?: string;
  divisionId?: string;
}

export interface ParsedFormDateAndDivisionInterface {
  dateFrom: string;
  dateTo: string;
  divisionInfo?: DivisionInterface;
}

export interface ValidateDateAndDivisionResponseInterface {
  valid: boolean;
  errors: string[];
  results?: ParsedFormDateAndDivisionInterface;
}
