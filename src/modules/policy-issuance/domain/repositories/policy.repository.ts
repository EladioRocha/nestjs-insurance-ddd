import { Policy } from '../entities/policy.entity';

export const POLICY_REPOSITORY = Symbol('POLICY_REPOSITORY');

export interface PolicyRepository {
  save(policy: Policy): Promise<void>;
  findById(id: string): Promise<Policy | null>;
  findAll(): Promise<Policy[]>;
}
