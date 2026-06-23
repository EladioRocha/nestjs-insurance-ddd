import { Injectable } from '@nestjs/common';
import { InsuranceQuote } from '../../domain/entities/insurance-quote.entity';
import { InsuranceQuoteRepository } from '../../domain/repositories/insurance-quote.repository';

@Injectable()
export class InMemoryInsuranceQuoteRepository implements InsuranceQuoteRepository {
  private readonly quotes = new Map<string, InsuranceQuote>();

  async save(quote: InsuranceQuote): Promise<void> {
    this.quotes.set(quote.id, quote);
  }

  async findById(id: string): Promise<InsuranceQuote | null> {
    return this.quotes.get(id) ?? null;
  }

  async findAll(): Promise<InsuranceQuote[]> {
    return Array.from(this.quotes.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }
}
