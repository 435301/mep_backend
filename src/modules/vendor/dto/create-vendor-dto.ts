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
    @Transform(({ value }) => {
        if (Array.isArray(value)) {
            return value.map(Number);
        }

        return value ? [Number(value)] : [];
    })
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
    @IsOptional()
    city!: string;

    @IsString()
    @IsOptional()
    location!: string;

    @IsString()
    @IsOptional()
    @Matches(/^[1-9][0-9]{5}$/, {
        message: 'Invalid pincode.',
    })
    pincode!: string;

    @IsString()
    @IsOptional()
    address!: string;

    @IsString()
    @IsOptional()
    @TrimAndClean()
    @ContainsAlphabet({
        message: MESSAGES.TILE_CONTAIN_NUMBERS,
    })

    accountHolderName!: string;

    @IsOptional()
    @IsString()
    @TrimAndClean()
    @ContainsAlphabet({
        message: MESSAGES.TILE_CONTAIN_NUMBERS,
    })
    bankName!: string;

    @IsString()
    @IsOptional()
    @TrimAndClean()
    @ContainsAlphabet({
        message: MESSAGES.TILE_CONTAIN_NUMBERS,
    })
    branchName!: string;


    @IsOptional()
    @IsString()
    @Matches(/^\d{9,18}$/, {
        message: 'Invalid account number.',
    })
    accountNumber!: string;

    @IsOptional()
    @IsString()
    @Matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, {
        message: 'Invalid IFSC code.',
    })
    ifscCode!: string;

    @IsEnum(CommissionType)
    @IsOptional()
    commissionType!: CommissionType;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    commissionValue!: number;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    })
    @IsBoolean()
    status?: boolean;
}