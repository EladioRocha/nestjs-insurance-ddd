import { Module } from '@nestjs/common';
import { DOMAIN_EVENT_PUBLISHER } from '../../shared/domain/events/domain-event-publisher';
import { NestDomainEventPublisher } from '../../shared/infrastructure/events/nest-domain-event-publisher';
import { InsuranceQuotesController } from './application/controllers/insurance-quotes.controller';
import { QUOTE_READER } from './application/ports/quote-reader.port';
import { QuoteReaderService } from './application/services/quote-reader.service';
import { INSURANCE_QUOTE_REPOSITORY } from './domain/repositories/insurance-quote.repository';
import { PremiumCalculatorService } from './domain/services/premium-calculator.service';
import { InMemoryInsuranceQuoteRepository } from './infrastructure/repositories/in-memory-insurance-quote.repository';
import { LogInsuranceQuoteCreatedHandler } from './infrastructure/event-handlers/log-insurance-quote-created.handler';
import { CreateInsuranceQuoteUseCase } from './usecase/create-insurance-quote.use-case';
import { GetInsuranceQuoteUseCase } from './usecase/get-insurance-quote.use-case';
import { ListInsuranceQuotesUseCase } from './usecase/list-insurance-quotes.use-case';

@Module({
  controllers: [InsuranceQuotesController],
  providers: [
    PremiumCalculatorService,
    CreateInsuranceQuoteUseCase,
    GetInsuranceQuoteUseCase,
    ListInsuranceQuotesUseCase,
    QuoteReaderService,
    LogInsuranceQuoteCreatedHandler,
    {
      provide: INSURANCE_QUOTE_REPOSITORY,
      useClass: InMemoryInsuranceQuoteRepository,
    },
    {
      provide: QUOTE_READER,
      useExisting: QuoteReaderService,
    },
    {
      provide: DOMAIN_EVENT_PUBLISHER,
      useClass: NestDomainEventPublisher,
    },
  ],
  exports: [QUOTE_READER],
})
export class InsuranceQuotesModule {}
