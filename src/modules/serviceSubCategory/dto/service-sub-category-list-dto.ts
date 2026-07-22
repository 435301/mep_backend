import { IsOptional } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";

export class ListServiceSubCategoryDto extends PaginationDto {

    @IsOptional()
    serviceTypeId?: number;

    @IsOptional()
    serviceCategoryId?: number;
}