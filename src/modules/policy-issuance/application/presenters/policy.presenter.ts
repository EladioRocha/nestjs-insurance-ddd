import { Policy } from '../../domain/entities/policy.entity';

export class PolicyPresenter {
  static toHttp(policy: Policy) {
    const data = policy.toPrimitives();

    return {
      id: data.id,
      policyNumber: data.policyNumber,
      quoteId: data.quoteId,
      customerId: data.customerId,
      insuredName: data.insuredName,
      packageType: data.packageType,
      premium: {
        total: data.premiumTotal,
        currency: data.currency,
      },
      paymentReference: data.paymentReference,
      status: data.status,
      issuedAt: data.issuedAt,
      startsAt: data.startsAt,
      endsAt: data.endsAt,
    };
  }
}
