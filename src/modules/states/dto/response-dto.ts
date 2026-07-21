import { ApiProperty } from "@nestjs/swagger";

export class StateResponseDto {

    @ApiProperty({
        example: 1
    })
    id !: number;

    @ApiProperty({
        example: "Andhra Pradesh"
    })
    name !: string;

    @ApiProperty({
        example: true
    })
    status !: boolean;
}