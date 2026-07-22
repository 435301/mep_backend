import {
    IsString,
    IsEmail,
    IsNumber,
    IsEnum,
    IsOptional,
    IsNotEmpty,
    IsBoolean,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CommissionType } from '../entities/vendor.entity';

export class CreateVendorDto {
    @IsString()
    @IsNotEmpty()
    vendorName!: string;

    @IsString()
    @IsNotEmpty()
    mobileNumber!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    profileImage! : string;

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    serviceTypeId!: number;

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    serviceCategoryId!: number;

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    serviceSubCategoryId!: number;

    @IsString()
    panNumber!: string;

    @Type(() => Number)
    @IsNumber()
    stateId!: number;

    @Type(() => Number)
    @IsNumber()
    districtId!: number;

    @IsString()
    location!: string;

    @IsString()
    pincode!: string;

    @IsString()
    address!: string;

    @IsString()
    accountHolderName!: string;

    @IsString()
    bankName!: string;

    @IsString()
    branchName!: string;

    @IsString()
    accountNumber!: string;

    @IsString()
    ifscCode!: string;

    @IsEnum(CommissionType)
    commissionType!: CommissionType;

    @Type(() => Number)
    @IsNumber()
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