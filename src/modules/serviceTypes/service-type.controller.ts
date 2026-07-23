import { Controller, Get, Post, Body, Param, Patch, Delete, Put, Req, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { iconUploadConfig } from 'src/common/utils/uploads.utils';
import { AuthGuard } from '@nestjs/passport';
import { CreateServiceTypeDto } from './dto/create-service-type-dto';
import { UpdateServiceTypeDto } from './dto/update-service-type-dto';
import { JwtAuthGuard } from 'src/gaurds/jwt-auth.gaurd';
import { ServiceTypeService } from './service-type.service';
import { BulkStatusDto } from 'src/common/dto/bulk.dto';
import { ROUTES } from 'src/common/constants/routes.constant';


@Controller(`${ROUTES.ADMIN}/serviceType`)
@UseGuards(AuthGuard('jwt'))
export class ServiceTypeController {
  constructor(private readonly service: ServiceTypeService) { }

  @Post('create')
  async create(

    @Body() dto: CreateServiceTypeDto,
    @Req() req: any,
  ) {
    return this.service.create(dto, req.user.id);
  }

  @Post('list')
  findAll(@Body() dto: PaginationDto) {
    return this.service.findAll(dto);
  }

  @Get('getById/:id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(+id);
  }

  @Put('update/:id')
  @UseInterceptors(
    FileInterceptor('icon', iconUploadConfig('ServiceType'))
  )
  update(
    @Param('id') id: number,
    @Body() dto: UpdateServiceTypeDto,
    @Req() req: any,
  ) {
    return this.service.update(id, dto, req.user?.id);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: number, @Req() req) {
    return this.service.remove(+id, req.user.id);
  }

  @Patch('bulk-status')
  async bulkStatus(
    @Body() dto: BulkStatusDto,
    @Req() req: any,
  ) {
    return this.service.bulkStatus(
      dto,
      req.user.id,
    );
  }
}

@Controller('users/Service-types')
@UseGuards(JwtAuthGuard)
export class ServiceTypeFrontendController {
  constructor(private readonly service: ServiceTypeService) { }
  @Get('list')
  findActive() {
    return this.service.findActive();
  }
}