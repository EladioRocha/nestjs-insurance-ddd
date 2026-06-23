import { DomainEvent } from '../../../shared/domain/events/domain-event';
import { DomainEventPublisher } from '../../../shared/domain/events/domain-event-publisher';
import { InsuranceQuote } from '../domain/entities/insurance-quote.entity';
import { InsuranceQuoteRepository } from '../domain/repositories/insurance-quote.repository';
import { PremiumCalculatorService } from '../domain/services/premium-calculator.service';
import { CreateInsuranceQuoteUseCase } from './create-insurance-quote.use-case';

class FakeQuoteRepository implements InsuranceQuoteRepository {
  public savedQuote: InsuranceQuote | null = null;

  async save(quote: InsuranceQuote): Promise<void> {
    this.savedQuote = quote;
  }

  async findById(id: string): Promise<InsuranceQuote | null> {
    return this.savedQuote?.id === id ? this.savedQuote : null;
  }

  async findAll(): Promise<InsuranceQuote[]> {
    return this.savedQuote ? [this.savedQuote] : [];
  }
}

class FakeEventPublisher implements DomainEventPublisher {
  public events: string[] = [];

  publish(event: DomainEvent<Record<string, unknown>>): void {
    this.events.push(event.name);
  }
}

describe('CreateInsuranceQuoteUseCase', () => {
  it('creates a quote and publishes a domain event', async () => {
    const repository = new FakeQuoteRepository();
    const eventPublisher = new FakeEventPublisher();
    const premiumCalculator = new PremiumCalculatorService();

    const useCase = new CreateInsuranceQuoteUseCase(
      repository,
      eventPublisher,
      premiumCalculator,
    );

    const quote = await useCase.execute({
      customerId: 'CUS-001',
      insuredName: 'Eladio Rocha',
      insuredAge: 27,
      vehicle: {
        brand: 'Volkswagen',
        model: 'Jetta',
        year: 2021,
        usage: 'personal',
      },
      packageType: 'PLUS',
    });

    expect(repository.savedQuote?.id).toBe(quote.id);
    expect(quote.premium.total).toBeGreaterThan(0);
    expect(eventPublisher.events).toContain('insurance.quote.created');
  });
});
