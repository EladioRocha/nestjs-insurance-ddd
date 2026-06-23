import { Inject, Injectable } from '@nestjs/common';
import {
  INSURANCE_QUOTE_REPOSITORY,
  InsuranceQuoteRepository,
} from '../domain/repositories/insurance-quote.repository';

@Injectable()
export class ListInsuranceQuotesUseCase {
  constructor(
    @Inject(INSURANCE_QUOTE_REPOSITORY)
    private readonly repository: InsuranceQuoteRepository,
  ) {}

  async execute() {
    return this.repository.findAll();
  }
}
