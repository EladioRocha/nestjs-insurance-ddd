import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { QuoteNotFoundError } from '../../domain/errors/quote-domain.errors';
import { CreateInsuranceQuoteUseCase } from '../../usecase/create-insurance-quote.use-case';
import { GetInsuranceQuoteUseCase } from '../../usecase/get-insurance-quote.use-case';
import { ListInsuranceQuotesUseCase } from '../../usecase/list-insurance-quotes.use-case';
import { CreateInsuranceQuoteDto } from '../dtos/create-insurance-quote.dto';
import { InsuranceQuotePresenter } from '../presenters/insurance-quote.presenter';

@Controller('insurance-quotes')
export class InsuranceQuotesController {
  constructor(
    private readonly createInsuranceQuote: CreateInsuranceQuoteUseCase,
    private readonly getInsuranceQuote: GetInsuranceQuoteUseCase,
    private readonly listInsuranceQuotes: ListInsuranceQuotesUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateInsuranceQuoteDto) {
    try {
      const quote = await this.createInsuranceQuote.execute(dto);
      return InsuranceQuotePresenter.toHttp(quote);
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Get()
  async findAll() {
    const quotes = await this.listInsuranceQuotes.execute();
    return quotes.map(InsuranceQuotePresenter.toHttp);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const quote = await this.getInsuranceQuote.execute(id);
      return InsuranceQuotePresenter.toHttp(quote);
    } catch (error) {
      if (error instanceof QuoteNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }
}
