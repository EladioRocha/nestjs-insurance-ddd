import { randomUUID } from 'crypto';

export abstract class DomainEvent<TPayload extends Record<string, unknown>> {
  public readonly eventId: string;
  public readonly occurredAt: Date;

  public abstract readonly name: string;
  public abstract readonly version: number;

  protected constructor(
    public readonly payload: TPayload,
    public readonly correlationId?: string,
  ) {
    this.eventId = randomUUID();
    this.occurredAt = new Date();
  }
}
