import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import {
  PolicyNotFoundError,
  QuoteCannotBeIssuedError,
} from '../../domain/errors/policy-domain.errors';
import { GetPolicyUseCase } from '../../usecase/get-policy.use-case';
import { IssuePolicyUseCase } from '../../usecase/issue-policy.use-case';
import { ListPoliciesUseCase } from '../../usecase/list-policies.use-case';
import { IssuePolicyDto } from '../dtos/issue-policy.dto';
import { PolicyPresenter } from '../presenters/policy.presenter';

@Controller('policies')
export class PolicyIssuanceController {
  constructor(
    private readonly issuePolicy: IssuePolicyUseCase,
    private readonly getPolicy: GetPolicyUseCase,
    private readonly listPolicies: ListPoliciesUseCase,
  ) {}

  @Post('issue')
  async issue(@Body() dto: IssuePolicyDto) {
    try {
      const policy = await this.issuePolicy.execute(dto);
      return PolicyPresenter.toHttp(policy);
    } catch (error) {
      if (error instanceof QuoteCannotBeIssuedError) {
        throw new BadRequestException(error.message);
      }

      throw new BadRequestException((error as Error).message);
    }
  }

  @Get()
  async findAll() {
    const policies = await this.listPolicies.execute();
    return policies.map(PolicyPresenter.toHttp);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const policy = await this.getPolicy.execute(id);
      return PolicyPresenter.toHttp(policy);
    } catch (error) {
      if (error instanceof PolicyNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }
}
