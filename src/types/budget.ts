export interface Budget {
  /** Unique identifier, e.g., "2024-07" for monthly budget */
  id: string;
  /** Month in YYYY-MM format */
  month: string;
  /** Total amount allocated for the month */
  amount: number;
  /** Optional sub‑budget for a specific category */
  categoryId?: string;
}
