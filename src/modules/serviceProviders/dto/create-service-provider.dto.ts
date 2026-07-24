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
    @MaxLength(60)
    @IsNotEmpty()
    @Matches(/^[6-9]\d{9}$/, {
        message: 'Mobile number must be a valid 10-digit Indian mobile number.',
    })
    email!: string;

    @Matches(/^[6-9]\d{9}$/, {
        message: 'Mobile number must be a valid 10-digit Indian mobile number.',
    })
    @IsNotEmpty()
    mobile!: string;

    @IsNotEmpty()
    @IsDateString()
    dob?: Date;

    @IsOptional()
    @IsNumber()
    age?: number;

    @IsOptional()
    @IsNumber()
    experienceId?: number;

    @IsOptional()
    @IsNumber()
    languageId?: number;

    @IsOptional()
    @IsBoolean()
    serviceAvailable?: boolean;

    @IsNumber()
    stateId!: number;

    @IsNumber()
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
    latitude?: number;

    @IsOptional()
    @IsLongitude()
    longitude?: number;

    @Matches(/^[1-9][0-9]{5}$/, {
        message: 'Invalid pincode.',
    })
    pincode !: string;

    @IsOptional()
    @IsString()
    address?: string;
}