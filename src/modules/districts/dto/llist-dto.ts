import { IsNumber, IsOptional } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";


export class ListDistrictDto extends PaginationDto {
    @IsOptional()
    stateId?: number;
}