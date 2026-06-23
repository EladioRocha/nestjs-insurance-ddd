import { ValueObject } from '../../../../shared/domain/value-objects/value-object';

export type CoveragePackageType = 'BASIC' | 'PLUS' | 'PREMIUM';

interface CoveragePackageProps {
  type: CoveragePackageType;
}

export class CoveragePackage extends ValueObject<CoveragePackageProps> {
  private constructor(props: CoveragePackageProps) {
    super(props);
  }

  static create(type: CoveragePackageType): CoveragePackage {
    if (!['BASIC', 'PLUS', 'PREMIUM'].includes(type)) {
      throw new Error('Coverage package must be BASIC, PLUS or PREMIUM.');
    }

    return new CoveragePackage({ type });
  }

  get type(): CoveragePackageType {
    return this.props.type;
  }

  get pricingFactor(): number {
    const factors: Record<CoveragePackageType, number> = {
      BASIC: 1,
      PLUS: 1.35,
      PREMIUM: 1.8,
    };

    return factors[this.props.type];
  }

  get coverages(): string[] {
    const coverages: Record<CoveragePackageType, string[]> = {
      BASIC: ['Civil liability', 'Legal assistance'],
      PLUS: ['Civil liability', 'Legal assistance', 'Total theft', 'Material damage'],
      PREMIUM: [
        'Civil liability',
        'Legal assistance',
        'Total theft',
        'Material damage',
        'Roadside assistance',
        'Occupant medical expenses',
      ],
    };

    return coverages[this.props.type];
  }
}
