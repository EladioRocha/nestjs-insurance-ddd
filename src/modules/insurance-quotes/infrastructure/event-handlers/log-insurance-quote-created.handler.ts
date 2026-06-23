import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InsuranceQuoteCreatedEvent } from '../../domain/events/insurance-quote-created.event';

@Injectable()
export class LogInsuranceQuoteCreatedHandler {
  private readonly logger = new Logger(LogInsuranceQuoteCreatedHandler.name);

  @OnEvent(InsuranceQuoteCreatedEvent.eventName)
  handle(event: InsuranceQuoteCreatedEvent): void {
    this.logger.log(
      `Quote created: ${event.payload.quoteId} | premium ${event.payload.totalPremium} ${event.payload.currency}`,
    );
  }
}
