import { Transform, Type } from "class-transformer";
import { isAlphanumeric, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { MESSAGES } from "src/common/constants/status.constants";
import { ContainsAlphabet } from "src/common/decorators/contains-alphabet.decorator";
import { TrimAndClean } from 'src/common/transforms/trim.transform';

export class CreateServiceCategoryDto {

    @IsNotEmpty()
    serviceTypeId?: number;

    @IsString()
    @IsNotEmpty()
    @TrimAndClean()
    @ContainsAlphabet({
        message: MESSAGES.TILE_CONTAIN_NUMBERS,
    })
    title !: string;

    @IsString()
    @IsOptional()
    icon?: string;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    position?: number;

    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    })
    @IsOptional()
    @IsBoolean()
    status?: boolean;

}