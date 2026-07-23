import { IsArray, ArrayNotEmpty, IsBoolean } from 'class-validator';

export class BulkStatusDto {
  @IsArray()
  @ArrayNotEmpty()
  ids !: number[];

  @IsBoolean()
  status !: boolean;
}