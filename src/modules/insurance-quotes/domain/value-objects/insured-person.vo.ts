import { ValueObject } from '../../../../shared/domain/value-objects/value-object';

interface InsuredPersonProps {
  name: string;
  age: number;
}

export class InsuredPerson extends ValueObject<InsuredPersonProps> {
  private constructor(props: InsuredPersonProps) {
    super(props);
  }

  static create(name: string, age: number): InsuredPerson {
    const normalizedName = name.trim();

    if (normalizedName.length < 3) {
      throw new Error('The insured person name must have at least 3 characters.');
    }

    if (age < 18 || age > 99) {
      throw new Error('The insured person age must be between 18 and 99.');
    }

    return new InsuredPerson({ name: normalizedName, age });
  }

  get name(): string {
    return this.props.name;
  }

  get age(): number {
    return this.props.age;
  }
}
