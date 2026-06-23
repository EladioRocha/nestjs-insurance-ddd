import { InsuranceQuote } from '../entities/insurance-quote.entity';

export const INSURANCE_QUOTE_REPOSITORY = Symbol('INSURANCE_QUOTE_REPOSITORY');

export interface InsuranceQuoteRepository {
  save(quote: InsuranceQuote): Promise<void>;
  findById(id: string): Promise<InsuranceQuote | null>;
  findAll(): Promise<InsuranceQuote[]>;
}
