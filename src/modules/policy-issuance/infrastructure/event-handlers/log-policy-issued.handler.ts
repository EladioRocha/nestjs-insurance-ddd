import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PolicyIssuedEvent } from '../../domain/events/policy-issued.event';

@Injectable()
export class LogPolicyIssuedHandler {
  private readonly logger = new Logger(LogPolicyIssuedHandler.name);

  @OnEvent(PolicyIssuedEvent.eventName)
  handle(event: PolicyIssuedEvent): void {
    this.logger.log(
      `Policy issued: ${event.payload.policyNumber} from quote ${event.payload.quoteId}`,
    );
  }
}
