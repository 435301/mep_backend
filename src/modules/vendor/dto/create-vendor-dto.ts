import {
    IsString,
    IsEmail,
    IsNumber,
    IsEnum,
    IsOptional,
    IsNotEmpty,
    IsBoolean,
    Matches,
    Min,
    IsArray,
    ArrayNotEmpty,
    IsInt,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CommissionType } from '../entities/vendor.entity';
import { TrimAndClean } from 'src/common/transforms/trim.transform';
import { ContainsAlphabet } from 'src/common/decorators/contains-alphabet.decorator';
import { MESSAGES } from 'src/common/constants/status.constants';

export class CreateVendorDto {
    @IsString()
    @IsNotEmpty()
    @TrimAndClean()
    @ContainsAlphabet({
        message: MESSAGES.TILE_CONTAIN_NUMBERS,
    })
    vendorName!: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^[6-9]\d{9}$/, {
        message: 'Mobile number must be a valid 10-digit Indian mobile number.',
    })
    mobileNumber!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @Transform(({ value }) => Number(value))
    @Type(() => Number)
    @IsNumber()
    serviceTypeId!: number;

    @Transform(({ value }) => Number(value))
    @Type(() => Number)
    @IsNumber()
    serviceCategoryId!: number;

    @IsArray()
    @ArrayNotEmpty()
    @Type(() => Number)
    @IsInt({ each: true })
    serviceSubCategoryIds!: number[];

    @IsString()
    @Matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
        message: 'Invalid PAN number.',
    })
    panNumber!: string;

    @Type(() => Number)
    @IsNumber()
    districtId!: number;

    @IsString()
    location!: string;

    @IsString()
    @Matches(/^[1-9][0-9]{5}$/, {
        message: 'Invalid pincode.',
    })
    pincode!: string;

    @IsString()
    address!: string;

    @IsString()
    @TrimAndClean()
    @ContainsAlphabet({
        message: MESSAGES.TILE_CONTAIN_NUMBERS,
    })
    accountHolderName!: string;

    @IsString()
    @TrimAndClean()
    @ContainsAlphabet({
        message: MESSAGES.TILE_CONTAIN_NUMBERS,
    })
    bankName!: string;

    @IsString()
    @TrimAndClean()
    @ContainsAlphabet({
        message: MESSAGES.TILE_CONTAIN_NUMBERS,
    })
    branchName!: string;

    @IsString()
    @Matches(/^\d{9,18}$/, {
        message: 'Invalid account number.',
    })
    accountNumber!: string;

    @IsString()
    @Matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, {
        message: 'Invalid IFSC code.',
    })
    ifscCode!: string;

    @IsEnum(CommissionType)
    commissionType!: CommissionType;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    commissionValue!: number;

    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    })
    @IsOptional()
    @IsBoolean()
    status?: boolean;
}