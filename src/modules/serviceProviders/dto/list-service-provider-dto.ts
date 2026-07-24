import { IsOptional } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";


export class ListServiceProviderDto extends PaginationDto{
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