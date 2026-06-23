import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  DOMAIN_EVENT_PUBLISHER,
  DomainEventPublisher,
} from '../../../shared/domain/events/domain-event-publisher';
import {
  QUOTE_READER,
  QuoteReader,
} from '../../insurance-quotes/application/ports/quote-reader.port';
import { Policy } from '../domain/entities/policy.entity';
import { QuoteCannotBeIssuedError } from '../domain/errors/policy-domain.errors';
import { PolicyIssuedEvent } from '../domain/events/policy-issued.event';
import {
  POLICY_REPOSITORY,
  PolicyRepository,
} from '../domain/repositories/policy.repository';

export interface IssuePolicyInput {
  quoteId: string;
  paymentReference: string;
  correlationId?: string;
}

@Injectable()
export class IssuePolicyUseCase {
  constructor(
    @Inject(QUOTE_READER)
    private readonly quoteReader: QuoteReader,
    @Inject(POLICY_REPOSITORY)
    private readonly policyRepository: PolicyRepository,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(input: IssuePolicyInput): Promise<Policy> {
    const quote = await this.quoteReader.findById(input.quoteId);

    if (!quote) {
      throw new QuoteCannotBeIssuedError(`Quote ${input.quoteId} does not exist.`);
    }

    if (quote.status === 'EXPIRED') {
      throw new QuoteCannotBeIssuedError(`Quote ${input.quoteId} is expired.`);
    }

    const policy = Policy.issue({
      id: randomUUID(),
      policyNumber: this.createPolicyNumber(),
      quoteId: quote.id,
      customerId: quote.customerId,
      insuredName: quote.insuredName,
      packageType: quote.packageType,
      premiumTotal: quote.premium.total,
      currency: quote.premium.currency,
      paymentReference: input.paymentReference,
    });

    await this.policyRepository.save(policy);

    this.eventPublisher.publish(
      new PolicyIssuedEvent(
        {
          policyId: policy.id,
          policyNumber: policy.policyNumber,
          quoteId: policy.quoteId,
          customerId: policy.customerId,
          premiumTotal: policy.premiumTotal,
          currency: policy.currency,
        },
        input.correlationId,
      ),
    );

    return policy;
  }

  private createPolicyNumber(): string {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomPart = Math.floor(100000 + Math.random() * 900000);
    return `POL-${datePart}-${randomPart}`;
  }
}
