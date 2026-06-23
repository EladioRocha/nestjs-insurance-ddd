import { DomainEvent } from '../../../../shared/domain/events/domain-event';

interface InsuranceQuoteCreatedPayload extends Record<string, unknown> {
  quoteId: string;
  customerId: string;
  packageType: string;
  totalPremium: number;
  currency: string;
}

export class InsuranceQuoteCreatedEvent extends DomainEvent<InsuranceQuoteCreatedPayload> {
  static readonly eventName = 'insurance.quote.created';

  public readonly name = InsuranceQuoteCreatedEvent.eventName;
  public readonly version = 1;

  constructor(payload: InsuranceQuoteCreatedPayload, correlationId?: string) {
    super(payload, correlationId);
  }
}
