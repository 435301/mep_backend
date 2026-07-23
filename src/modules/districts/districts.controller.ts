import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { DistrictService } from './districts.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/gaurds/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/gaurds/jwt-auth.gaurd';
import { ListDistrictDto } from './dto/llist-dto';

@Controller('admin/districts')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(1, 2)
export class DistrictController {
  constructor(private readonly districtService: DistrictService) { }

  @Post('create')
  create(@Body() dto: CreateDistrictDto, @Req() req) {
    return this.districtService.create(dto, req.user.id);
  }

  @Post('list')
  findAll(@Body() dto: ListDistrictDto) {
    return this.districtService.findAll(dto);
  }

  @Get('getById/:id')
  findOne(@Param('id') id: number) {
    return this.districtService.findOne(+id);
  }

  @Put('update/:id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdateDistrictDto,
    @Req() req,
  ) {
    return this.districtService.update(+id, dto, req.user.id);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: number, @Req() req) {
    return this.districtService.remove(+id, req.user.id);
  }

}

@Controller('users/districts')
@UseGuards(JwtAuthGuard)
export class DistrictFrontendController {
  constructor(private readonly service: DistrictService) { }

  @Get('list')
  findActive(@Query('stateId') stateId: number) {
    return this.service.findActive(stateId);
  }
}
