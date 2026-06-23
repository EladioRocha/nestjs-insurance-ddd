import { Inject, Injectable } from '@nestjs/common';
import {
  INSURANCE_QUOTE_REPOSITORY,
  InsuranceQuoteRepository,
} from '../../domain/repositories/insurance-quote.repository';
import { QuoteReader, QuoteSnapshot } from '../ports/quote-reader.port';

@Injectable()
export class QuoteReaderService implements QuoteReader {
  constructor(
    @Inject(INSURANCE_QUOTE_REPOSITORY)
    private readonly repository: InsuranceQuoteRepository,
  ) {}

  async findById(quoteId: string): Promise<QuoteSnapshot | null> {
    const quote = await this.repository.findById(quoteId);

    if (!quote) return null;

    return quote.toPrimitives();
  }
}
