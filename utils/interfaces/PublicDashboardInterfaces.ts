export interface DateWiseCounterInterface {
  key: string;
  doc_count: number;
}

export interface DateWiseCounterInterface {
  date: string;
  all?: number;
  male: number;
  others: number;
  female: number;
}

export interface LatestGenderWiseStatsInterface {
  message?: any;

  [key: string]: DateWiseCounterInterface;
}
