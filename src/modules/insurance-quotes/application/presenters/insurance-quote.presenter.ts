import { InsuranceQuote } from '../../domain/entities/insurance-quote.entity';

export class InsuranceQuotePresenter {
  static toHttp(quote: InsuranceQuote) {
    const data = quote.toPrimitives();

    return {
      id: data.id,
      customerId: data.customerId,
      insured: {
        name: data.insuredName,
        age: data.insuredAge,
      },
      vehicle: data.vehicle,
      package: {
        type: data.packageType,
        coverages: data.coverages,
      },
      premium: data.premium,
      status: data.status,
      validUntil: data.validUntil,
      createdAt: data.createdAt,
    };
  }
}
