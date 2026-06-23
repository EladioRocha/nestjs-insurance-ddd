import { Inject, Injectable } from '@nestjs/common';
import { QuoteNotFoundError } from '../domain/errors/quote-domain.errors';
import {
  INSURANCE_QUOTE_REPOSITORY,
  InsuranceQuoteRepository,
} from '../domain/repositories/insurance-quote.repository';

@Injectable()
export class GetInsuranceQuoteUseCase {
  constructor(
    @Inject(INSURANCE_QUOTE_REPOSITORY)
    private readonly repository: InsuranceQuoteRepository,
  ) {}

  async execute(quoteId: string) {
    const quote = await this.repository.findById(quoteId);

    if (!quote) {
      throw new QuoteNotFoundError(quoteId);
    }

    return quote;
  }
}
