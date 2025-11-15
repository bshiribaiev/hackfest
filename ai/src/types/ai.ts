export type AdvisorStatus = "GO" | "CAREFUL" | "NOPE";

export interface PurchaseAdviceRequest {
  userId: string;
  message: string;
  price?: number;
  category?: string;
}

export interface PurchaseAdviceResponse {
  status: AdvisorStatus;
  message: string;
  suggestion?: string;
}

export interface DailyAdviceResponse {
  date: string;
  tip: string;
}


