import { Module } from '@nestjs/common';
import { DOMAIN_EVENT_PUBLISHER } from '../../shared/domain/events/domain-event-publisher';
import { NestDomainEventPublisher } from '../../shared/infrastructure/events/nest-domain-event-publisher';
import { InsuranceQuotesModule } from '../insurance-quotes/insurance-quotes.module';
import { PolicyIssuanceController } from './application/controllers/policy-issuance.controller';
import { POLICY_REPOSITORY } from './domain/repositories/policy.repository';
import { LogPolicyIssuedHandler } from './infrastructure/event-handlers/log-policy-issued.handler';
import { InMemoryPolicyRepository } from './infrastructure/repositories/in-memory-policy.repository';
import { GetPolicyUseCase } from './usecase/get-policy.use-case';
import { IssuePolicyUseCase } from './usecase/issue-policy.use-case';
import { ListPoliciesUseCase } from './usecase/list-policies.use-case';

@Module({
  imports: [InsuranceQuotesModule],
  controllers: [PolicyIssuanceController],
  providers: [
    IssuePolicyUseCase,
    GetPolicyUseCase,
    ListPoliciesUseCase,
    LogPolicyIssuedHandler,
    {
      provide: POLICY_REPOSITORY,
      useClass: InMemoryPolicyRepository,
    },
    {
      provide: DOMAIN_EVENT_PUBLISHER,
      useClass: NestDomainEventPublisher,
    },
  ],
})
export class PolicyIssuanceModule {}
