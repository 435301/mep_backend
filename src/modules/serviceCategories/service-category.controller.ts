import { Controller, Get, Post, Body, Param, Patch, Delete, Put, Req, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { iconUploadConfig } from 'src/common/utils/uploads.utils';
import { AuthGuard } from '@nestjs/passport';
import { ServiceCategoryService } from './service-category.service';
import { CreateServiceCategoryDto } from './dto/create-service-category-dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category-dto';
import { JwtAuthGuard } from 'src/gaurds/jwt-auth.gaurd';
import { ListServiceCategoryDto } from './dto/service-category-list-dto';


@Controller('admin/serviceCategory')
@UseGuards(AuthGuard('jwt'))
export class ServiceCategoryController {
  constructor(private readonly service: ServiceCategoryService) { }

  @Post('create')
  @UseInterceptors(
    FileInterceptor('icon', iconUploadConfig('ServiceCategory'))
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateServiceCategoryDto,
    @Req() req: any,
  ) {
    return this.service.create(dto, req.user.id, file);
  }

  @Post('list')
  findAll(@Body() dto: ListServiceCategoryDto) {
    return this.service.findAll(dto);
  }

  @Get('getById/:id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(+id);
  }

  @Put('update/:id')
  @UseInterceptors(
    FileInterceptor('icon', iconUploadConfig('ServiceCategory'))
  )
  update(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateServiceCategoryDto,
    @Req() req: any,
  ) {
    return this.service.update(id, dto, req.user?.id , file);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: number, @Req() req) {
    return this.service.remove(+id, req.user.id);
  }
}

@Controller('users/serviceCategory')
@UseGuards(JwtAuthGuard)
export class ServiceCategoryFrontendController {
    constructor(private readonly service: ServiceCategoryService) { }
    @Get('list')
    findActive() {
        return this.service.findActive();
    }
}