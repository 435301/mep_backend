import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MESSAGES } from 'src/common/constants/status.constants';
import { ContainsAlphabet } from 'src/common/decorators/contains-alphabet.decorator';
import { TrimAndClean } from 'src/common/transforms/trim.transform';

export class CreateStateDto {
  @TrimAndClean()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'karnataka',
  })
  @ContainsAlphabet({
    message: MESSAGES.TILE_CONTAIN_NUMBERS,
  })
  name!: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  status!: boolean;
}
