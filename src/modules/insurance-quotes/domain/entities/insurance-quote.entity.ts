import { CoveragePackage } from '../value-objects/coverage-package.vo';
import { InsuredPerson } from '../value-objects/insured-person.vo';
import { Premium } from '../value-objects/premium.vo';
import { VehicleDetails } from '../value-objects/vehicle-details.vo';

export type InsuranceQuoteStatus = 'CREATED' | 'EXPIRED';

export interface InsuranceQuotePrimitives {
  id: string;
  customerId: string;
  insuredName: string;
  insuredAge: number;
  vehicle: {
    brand: string;
    model: string;
    year: number;
    usage: string;
  };
  packageType: string;
  coverages: string[];
  premium: {
    subtotal: number;
    tax: number;
    total: number;
    currency: string;
  };
  status: InsuranceQuoteStatus;
  validUntil: string;
  createdAt: string;
}

export class InsuranceQuote {
  private constructor(
    public readonly id: string,
    public readonly customerId: string,
    public readonly insuredPerson: InsuredPerson,
    public readonly vehicle: VehicleDetails,
    public readonly coveragePackage: CoveragePackage,
    public readonly premium: Premium,
    public readonly createdAt: Date,
    public readonly validUntil: Date,
  ) {}

  static create(params: {
    id: string;
    customerId: string;
    insuredPerson: InsuredPerson;
    vehicle: VehicleDetails;
    coveragePackage: CoveragePackage;
    premium: Premium;
    now?: Date;
  }): InsuranceQuote {
    const createdAt = params.now ?? new Date();
    const validUntil = new Date(createdAt);
    validUntil.setDate(validUntil.getDate() + 7);

    return new InsuranceQuote(
      params.id,
      params.customerId,
      params.insuredPerson,
      params.vehicle,
      params.coveragePackage,
      params.premium,
      createdAt,
      validUntil,
    );
  }

  isExpired(now = new Date()): boolean {
    return now.getTime() > this.validUntil.getTime();
  }

  canBeIssued(now = new Date()): boolean {
    return !this.isExpired(now);
  }

  toPrimitives(now = new Date()): InsuranceQuotePrimitives {
    return {
      id: this.id,
      customerId: this.customerId,
      insuredName: this.insuredPerson.name,
      insuredAge: this.insuredPerson.age,
      vehicle: {
        brand: this.vehicle.brand,
        model: this.vehicle.model,
        year: this.vehicle.year,
        usage: this.vehicle.usage,
      },
      packageType: this.coveragePackage.type,
      coverages: this.coveragePackage.coverages,
      premium: {
        subtotal: this.premium.subtotal,
        tax: this.premium.tax,
        total: this.premium.total,
        currency: this.premium.currency,
      },
      status: this.isExpired(now) ? 'EXPIRED' : 'CREATED',
      validUntil: this.validUntil.toISOString(),
      createdAt: this.createdAt.toISOString(),
    };
  }
}
