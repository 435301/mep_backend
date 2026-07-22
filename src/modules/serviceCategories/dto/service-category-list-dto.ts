import { IsOptional } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";

export class ListServiceCategoryDto extends PaginationDto {

    @IsOptional()
    serviceTypeId?: number;
}