import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DomainEvent } from '../../domain/events/domain-event';
import { DomainEventPublisher } from '../../domain/events/domain-event-publisher';

@Injectable()
export class NestDomainEventPublisher implements DomainEventPublisher {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  publish(event: DomainEvent<Record<string, unknown>>): void {
    this.eventEmitter.emit(event.name, event);
  }
}
