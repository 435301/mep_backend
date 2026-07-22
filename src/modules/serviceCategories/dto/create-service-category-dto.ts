import { Transform, Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { TrimAndClean } from 'src/common/transforms/trim.transform';

export class CreateServiceCategoryDto {

    @IsNotEmpty()
    serviceTypeId?: number;

    @IsString()
    @IsNotEmpty()
    @TrimAndClean()
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