import { ApiProperty } from '@nestjs/swagger';
import { StateResponseDto } from './response-dto';

export class StateListResponseDto {

  @ApiProperty({
    example: true,
  })
  success !: boolean;

  @ApiProperty({
    example: 'States fetched successfully',
  })
  message !: string;

  @ApiProperty({
    type: [StateResponseDto],
  })
  data !: StateResponseDto[];

  @ApiProperty({
    example: 25,
  })
  total !: number;

  @ApiProperty({
    example: 1,
  })
  page !: number;

  @ApiProperty({
    example: 10,
  })
  limit !: number;
}