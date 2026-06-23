import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  DOMAIN_EVENT_PUBLISHER,
  DomainEventPublisher,
} from '../../../shared/domain/events/domain-event-publisher';
import { InsuranceQuote } from '../domain/entities/insurance-quote.entity';
import { InsuranceQuoteCreatedEvent } from '../domain/events/insurance-quote-created.event';
import {
  INSURANCE_QUOTE_REPOSITORY,
  InsuranceQuoteRepository,
} from '../domain/repositories/insurance-quote.repository';
import { PremiumCalculatorService } from '../domain/services/premium-calculator.service';
import { CoveragePackage, CoveragePackageType } from '../domain/value-objects/coverage-package.vo';
import { InsuredPerson } from '../domain/value-objects/insured-person.vo';
import { VehicleDetails, VehicleUsage } from '../domain/value-objects/vehicle-details.vo';

export interface CreateInsuranceQuoteInput {
  customerId: string;
  insuredName: string;
  insuredAge: number;
  vehicle: {
    brand: string;
    model: string;
    year: number;
    usage: VehicleUsage;
  };
  packageType: CoveragePackageType;
  correlationId?: string;
}

@Injectable()
export class CreateInsuranceQuoteUseCase {
  constructor(
    @Inject(INSURANCE_QUOTE_REPOSITORY)
    private readonly repository: InsuranceQuoteRepository,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisher,
    private readonly premiumCalculator: PremiumCalculatorService,
  ) {}

  async execute(input: CreateInsuranceQuoteInput): Promise<InsuranceQuote> {
    const insuredPerson = InsuredPerson.create(input.insuredName, input.insuredAge);
    const vehicle = VehicleDetails.create(
      input.vehicle.brand,
      input.vehicle.model,
      input.vehicle.year,
      input.vehicle.usage,
    );
    const coveragePackage = CoveragePackage.create(input.packageType);

    const premium = this.premiumCalculator.calculate({
      insuredPerson,
      vehicle,
      coveragePackage,
    });

    const quote = InsuranceQuote.create({
      id: randomUUID(),
      customerId: input.customerId,
      insuredPerson,
      vehicle,
      coveragePackage,
      premium,
    });

    await this.repository.save(quote);

    this.eventPublisher.publish(
      new InsuranceQuoteCreatedEvent(
        {
          quoteId: quote.id,
          customerId: quote.customerId,
          packageType: quote.coveragePackage.type,
          totalPremium: quote.premium.total,
          currency: quote.premium.currency,
        },
        input.correlationId,
      ),
    );

    return quote;
  }
}
