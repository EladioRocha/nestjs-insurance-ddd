import { CoveragePackage } from '../value-objects/coverage-package.vo';
import { InsuredPerson } from '../value-objects/insured-person.vo';
import { Premium } from '../value-objects/premium.vo';
import { VehicleDetails } from '../value-objects/vehicle-details.vo';

export class PremiumCalculatorService {
  calculate(params: {
    insuredPerson: InsuredPerson;
    vehicle: VehicleDetails;
    coveragePackage: CoveragePackage;
  }): Premium {
    const { insuredPerson, vehicle, coveragePackage } = params;

    const basePremium = 4200;
    const youngDriverFactor = insuredPerson.age < 25 ? 1.25 : 1;
    const vehicleAgeFactor = vehicle.age > 10 ? 1.18 : 1;
    const businessUsageFactor = vehicle.usage === 'business' ? 1.3 : 1;

    const subtotal =
      basePremium *
      coveragePackage.pricingFactor *
      youngDriverFactor *
      vehicleAgeFactor *
      businessUsageFactor;

    return Premium.create(subtotal);
  }
}
