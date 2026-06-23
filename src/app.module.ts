import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { InsuranceQuotesModule } from './modules/insurance-quotes/insurance-quotes.module';
import { PolicyIssuanceModule } from './modules/policy-issuance/policy-issuance.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    InsuranceQuotesModule,
    PolicyIssuanceModule,
  ],
})
export class AppModule {}
