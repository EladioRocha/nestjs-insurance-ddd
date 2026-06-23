import { ValueObject } from '../../../../shared/domain/value-objects/value-object';

export type VehicleUsage = 'personal' | 'business';

interface VehicleDetailsProps {
  brand: string;
  model: string;
  year: number;
  usage: VehicleUsage;
}

export class VehicleDetails extends ValueObject<VehicleDetailsProps> {
  private constructor(props: VehicleDetailsProps) {
    super(props);
  }

  static create(
    brand: string,
    model: string,
    year: number,
    usage: VehicleUsage,
  ): VehicleDetails {
    const currentYear = new Date().getFullYear();

    if (brand.trim().length < 2) {
      throw new Error('Vehicle brand is required.');
    }

    if (model.trim().length < 1) {
      throw new Error('Vehicle model is required.');
    }

    if (year < 1990 || year > currentYear + 1) {
      throw new Error(`Vehicle year must be between 1990 and ${currentYear + 1}.`);
    }

    if (!['personal', 'business'].includes(usage)) {
      throw new Error('Vehicle usage must be personal or business.');
    }

    return new VehicleDetails({
      brand: brand.trim(),
      model: model.trim(),
      year,
      usage,
    });
  }

  get brand(): string {
    return this.props.brand;
  }

  get model(): string {
    return this.props.model;
  }

  get year(): number {
    return this.props.year;
  }

  get usage(): VehicleUsage {
    return this.props.usage;
  }

  get age(): number {
    return new Date().getFullYear() - this.props.year;
  }
}
