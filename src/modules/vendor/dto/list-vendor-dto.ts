import { IsOptional } from "class-validator";


export class ListVendorDto {
    @IsOptional()
    serviceTypeId?: number;

    @IsOptional()
    serviceCategoryId?: number;

    @IsOptional()
    serviceSubCategoryId?: number;

    @IsOptional()
    stateId?: number;

    @IsOptional()
    districtId?: number;
}