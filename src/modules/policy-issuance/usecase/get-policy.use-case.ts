import { Inject, Injectable } from '@nestjs/common';
import { PolicyNotFoundError } from '../domain/errors/policy-domain.errors';
import {
  POLICY_REPOSITORY,
  PolicyRepository,
} from '../domain/repositories/policy.repository';

@Injectable()
export class GetPolicyUseCase {
  constructor(
    @Inject(POLICY_REPOSITORY)
    private readonly repository: PolicyRepository,
  ) {}

  async execute(policyId: string) {
    const policy = await this.repository.findById(policyId);

    if (!policy) {
      throw new PolicyNotFoundError(policyId);
    }

    return policy;
  }
}
