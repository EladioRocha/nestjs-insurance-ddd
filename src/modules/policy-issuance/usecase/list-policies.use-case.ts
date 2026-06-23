import { Inject, Injectable } from '@nestjs/common';
import {
  POLICY_REPOSITORY,
  PolicyRepository,
} from '../domain/repositories/policy.repository';

@Injectable()
export class ListPoliciesUseCase {
  constructor(
    @Inject(POLICY_REPOSITORY)
    private readonly repository: PolicyRepository,
  ) {}

  async execute() {
    return this.repository.findAll();
  }
}
