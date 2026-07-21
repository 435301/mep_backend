import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { TrimAndClean } from 'src/common/transforms/trim.transform';

export class CreateDistrictDto {
    @TrimAndClean()
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsInt()
    @IsNotEmpty()
    stateId!: number;

    @IsBoolean()
    @IsNotEmpty()
    status!: boolean;
}
