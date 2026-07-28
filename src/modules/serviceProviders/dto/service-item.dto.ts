import { Type, Transform } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNumber,
} from 'class-validator';

export class ServiceItemDto {
  @Transform(({ value }) => Number(value))
  @Type(() => Number)
  @IsNumber()
  serviceTypeId!: number;

  @Transform(({ value }) => Number(value))
  @Type(() => Number)
  @IsNumber()
  serviceCategoryId!: number;

  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map(Number);
    }

    return value ? [Number(value)] : [];
  })
  @Type(() => Number)
  @IsArray()
  @IsInt({ each: true })
  serviceSubCategoryIds!: number[];
}