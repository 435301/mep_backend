import { Transform, Type } from 'class-transformer';
import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsEmail,
    IsNumber,
    IsBoolean,
    IsDateString,
    MaxLength,
    MinLength,
    IsLatitude,
    IsLongitude,
    Matches,
    IsArray,
    IsInt,
} from 'class-validator';
import { MESSAGES } from 'src/common/constants/status.constants';
import { ContainsAlphabet } from 'src/common/decorators/contains-alphabet.decorator';
import { TrimAndClean } from 'src/common/transforms/trim.transform';

export enum RegisteredAs {
    VENDOR = 'VENDOR',
    INDIVIDUAL = 'INDIVIDUAL',
}

export class CreateServiceProviderDto {
    @IsEnum(RegisteredAs)
    registeredAs !: RegisteredAs;

    @IsString()
    @IsNotEmpty()
    @MaxLength(60)
    @TrimAndClean()
    @ContainsAlphabet({
        message: MESSAGES.TILE_CONTAIN_NUMBERS,
    })
    name!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsOptional()
    icon?: string;

    @IsString()
    @IsOptional()
    @Matches(/^[6-9]\d{9}$/, {
        message: 'Mobile number must be a valid 10-digit Indian mobile number.',
    })
    mobile!: string;

    @IsNotEmpty()
    @IsDateString()
    dob?: Date;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    age?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    experienceId?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    languageId?: number;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    serviceAvailable?: boolean;

    @IsNumber()
    @Type(() => Number)
    districtId!: number;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    city!: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    location?: string;

    @IsOptional()
    @IsLatitude()
    @Type(() => Number)
    latitude?: number;

    @IsOptional()
    @IsLongitude()
    @Type(() => Number)
    longitude?: number;

    @Matches(/^[1-9][0-9]{5}$/, {
        message: 'Invalid pincode.',
    })
    pincode !: string;

    @IsOptional()
    @IsString()
    address?: string;

    @Transform(({ value }) => Number(value))
    @Type(() => Number)
    @IsNumber()
    serviceTypeId!: number;

    @Transform(({ value }) => Number(value))
    @Type(() => Number)
    @IsNumber()
    serviceCategoryId!: number;

    @IsArray()
    @Type(() => Number)
    @IsInt({ each: true })
    serviceSubCategoryIds !: number[];

    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    })
    @IsOptional()
    @IsBoolean()
    status?: boolean;
}