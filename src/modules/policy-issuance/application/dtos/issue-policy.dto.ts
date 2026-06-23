import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class IssuePolicyDto {
  @IsString()
  @IsNotEmpty()
  quoteId: string;

  @IsString()
  @MinLength(5)
  paymentReference: string;
}
