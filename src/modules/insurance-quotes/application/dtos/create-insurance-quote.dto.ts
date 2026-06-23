import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { CoveragePackageType } from '../../domain/value-objects/coverage-package.vo';
import { VehicleUsage } from '../../domain/value-objects/vehicle-details.vo';

class VehicleDto {
  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsInt()
  @Min(1990)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @IsIn(['personal', 'business'])
  usage: VehicleUsage;
}

export class CreateInsuranceQuoteDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  insuredName: string;

  @IsInt()
  @Min(18)
  @Max(99)
  insuredAge: number;

  @ValidateNested()
  @Type(() => VehicleDto)
  vehicle: VehicleDto;

  @IsIn(['BASIC', 'PLUS', 'PREMIUM'])
  packageType: CoveragePackageType;
}
