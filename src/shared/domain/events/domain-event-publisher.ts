import { DomainEvent } from './domain-event';

export const DOMAIN_EVENT_PUBLISHER = Symbol('DOMAIN_EVENT_PUBLISHER');

export interface DomainEventPublisher {
  publish(event: DomainEvent<Record<string, unknown>>): void;
}
