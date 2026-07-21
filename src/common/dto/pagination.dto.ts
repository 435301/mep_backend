import { IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : Number(value))
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : Number(value))
  limit?: number = 15;

  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  search?: string;

  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value === 'true')
  pagination?: boolean = true;

  @IsOptional()
  @Transform(({ value }) =>
    value === '' ? undefined : value === true 
  )
  status?: boolean;
}
