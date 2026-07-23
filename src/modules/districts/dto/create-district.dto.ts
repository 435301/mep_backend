import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { MESSAGES } from 'src/common/constants/status.constants';
import { ContainsAlphabet } from 'src/common/decorators/contains-alphabet.decorator';
import { TrimAndClean } from 'src/common/transforms/trim.transform';

export class CreateDistrictDto {
    @TrimAndClean()
    @IsString()
    @IsNotEmpty()
    @ContainsAlphabet({
        message: MESSAGES.TILE_CONTAIN_NUMBERS,
    })
    name!: string;

    @IsInt()
    @IsNotEmpty()
    stateId!: number;

    @IsBoolean()
    @IsNotEmpty()
    status!: boolean;
}
