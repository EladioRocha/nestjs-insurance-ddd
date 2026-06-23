import { Injectable } from '@nestjs/common';
import { Policy } from '../../domain/entities/policy.entity';
import { PolicyRepository } from '../../domain/repositories/policy.repository';

@Injectable()
export class InMemoryPolicyRepository implements PolicyRepository {
  private readonly policies = new Map<string, Policy>();

  async save(policy: Policy): Promise<void> {
    this.policies.set(policy.id, policy);
  }

  async findById(id: string): Promise<Policy | null> {
    return this.policies.get(id) ?? null;
  }

  async findAll(): Promise<Policy[]> {
    return Array.from(this.policies.values()).sort(
      (a, b) => b.issuedAt.getTime() - a.issuedAt.getTime(),
    );
  }
}
