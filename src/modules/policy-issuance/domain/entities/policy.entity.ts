export type PolicyStatus = 'ACTIVE' | 'CANCELLED';

export interface PolicyPrimitives {
  id: string;
  policyNumber: string;
  quoteId: string;
  customerId: string;
  insuredName: string;
  packageType: string;
  premiumTotal: number;
  currency: string;
  paymentReference: string;
  status: PolicyStatus;
  issuedAt: string;
  startsAt: string;
  endsAt: string;
}

export class Policy {
  private constructor(
    public readonly id: string,
    public readonly policyNumber: string,
    public readonly quoteId: string,
    public readonly customerId: string,
    public readonly insuredName: string,
    public readonly packageType: string,
    public readonly premiumTotal: number,
    public readonly currency: string,
    public readonly paymentReference: string,
    public readonly issuedAt: Date,
    public readonly startsAt: Date,
    public readonly endsAt: Date,
    public readonly status: PolicyStatus,
  ) {}

  static issue(params: {
    id: string;
    policyNumber: string;
    quoteId: string;
    customerId: string;
    insuredName: string;
    packageType: string;
    premiumTotal: number;
    currency: string;
    paymentReference: string;
    now?: Date;
  }): Policy {
    if (params.paymentReference.trim().length < 5) {
      throw new Error('Payment reference must have at least 5 characters.');
    }

    const issuedAt = params.now ?? new Date();
    const startsAt = new Date(issuedAt);
    const endsAt = new Date(startsAt);
    endsAt.setFullYear(endsAt.getFullYear() + 1);

    return new Policy(
      params.id,
      params.policyNumber,
      params.quoteId,
      params.customerId,
      params.insuredName,
      params.packageType,
      params.premiumTotal,
      params.currency,
      params.paymentReference.trim(),
      issuedAt,
      startsAt,
      endsAt,
      'ACTIVE',
    );
  }

  toPrimitives(): PolicyPrimitives {
    return {
      id: this.id,
      policyNumber: this.policyNumber,
      quoteId: this.quoteId,
      customerId: this.customerId,
      insuredName: this.insuredName,
      packageType: this.packageType,
      premiumTotal: this.premiumTotal,
      currency: this.currency,
      paymentReference: this.paymentReference,
      status: this.status,
      issuedAt: this.issuedAt.toISOString(),
      startsAt: this.startsAt.toISOString(),
      endsAt: this.endsAt.toISOString(),
    };
  }
}
