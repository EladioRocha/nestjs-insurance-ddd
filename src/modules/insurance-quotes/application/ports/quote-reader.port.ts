export const QUOTE_READER = Symbol('QUOTE_READER');

export interface QuoteSnapshot {
  id: string;
  customerId: string;
  insuredName: string;
  insuredAge: number;
  vehicle: {
    brand: string;
    model: string;
    year: number;
    usage: string;
  };
  packageType: string;
  premium: {
    subtotal: number;
    tax: number;
    total: number;
    currency: string;
  };
  validUntil: string;
  status: string;
}

export interface QuoteReader {
  findById(quoteId: string): Promise<QuoteSnapshot | null>;
}
