import { DomainEvent } from '../../../../shared/domain/events/domain-event';

interface PolicyIssuedPayload extends Record<string, unknown> {
  policyId: string;
  policyNumber: string;
  quoteId: string;
  customerId: string;
  premiumTotal: number;
  currency: string;
}

export class PolicyIssuedEvent extends DomainEvent<PolicyIssuedPayload> {
  static readonly eventName = 'policy.issued';

  public readonly name = PolicyIssuedEvent.eventName;
  public readonly version = 1;

  constructor(payload: PolicyIssuedPayload, correlationId?: string) {
    super(payload, correlationId);
  }
}
