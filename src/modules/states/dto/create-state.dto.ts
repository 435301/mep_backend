import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { TrimAndClean } from 'src/common/transforms/trim.transform';

export class CreateStateDto {
  @TrimAndClean()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'karnataka',
  })
  name!: string;

  @IsBoolean()
  @IsNotEmpty()
   @ApiProperty({
    example: true,
  })
  status!: boolean;
}
