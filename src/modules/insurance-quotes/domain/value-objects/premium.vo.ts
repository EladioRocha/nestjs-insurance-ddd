import { ValueObject } from '../../../../shared/domain/value-objects/value-object';

interface PremiumProps {
  subtotal: number;
  tax: number;
  total: number;
  currency: 'MXN';
}

export class Premium extends ValueObject<PremiumProps> {
  private constructor(props: PremiumProps) {
    super(props);
  }

  static create(subtotal: number, taxRate = 0.16): Premium {
    if (subtotal <= 0) {
      throw new Error('Premium subtotal must be greater than zero.');
    }

    const normalizedSubtotal = Number(subtotal.toFixed(2));
    const tax = Number((normalizedSubtotal * taxRate).toFixed(2));
    const total = Number((normalizedSubtotal + tax).toFixed(2));

    return new Premium({
      subtotal: normalizedSubtotal,
      tax,
      total,
      currency: 'MXN',
    });
  }

  get subtotal(): number {
    return this.props.subtotal;
  }

  get tax(): number {
    return this.props.tax;
  }

  get total(): number {
    return this.props.total;
  }

  get currency(): 'MXN' {
    return this.props.currency;
  }
}
