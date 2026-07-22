import { Controller, Get, Post, Body, Param, Patch, Delete, Put, Req, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { iconUploadConfig } from 'src/common/utils/uploads.utils';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/gaurds/jwt-auth.gaurd';
import { ServiceSubCategoryService } from './service-sub-category.service';
import { CreateServiceSubCategoryDto } from './dto/create-service-sub-category-dto';
import { ListServiceSubCategoryDto } from './dto/service-sub-category-list-dto';
import { UpdateServiceSubCategoryDto } from './dto/update-service-sub-category-dto';



@Controller('admin/serviceSubCategory')
@UseGuards(AuthGuard('jwt'))
export class ServiceSubCategoryController {
  constructor(private readonly service: ServiceSubCategoryService) { }

  @Post('create')
  @UseInterceptors(
    FileInterceptor('icon', iconUploadConfig('ServiceSubCategory'))
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateServiceSubCategoryDto,
    @Req() req: any,
  ) {
    return this.service.create(dto, req.user.id, file);
  }

  @Post('list')
  findAll(@Body() dto: ListServiceSubCategoryDto) {
    return this.service.findAll(dto);
  }

  @Get('getById/:id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(+id);
  }

  @Put('update/:id')
  @UseInterceptors(
    FileInterceptor('icon', iconUploadConfig('ServiceSubCategory'))
  )
  update(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateServiceSubCategoryDto,
    @Req() req: any,
  ) {
    return this.service.update(id, dto, req.user?.id , file);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: number, @Req() req) {
    return this.service.remove(+id, req.user.id);
  }
}

@Controller('users/serviceSubCategory')
@UseGuards(JwtAuthGuard)
export class ServiceSubCategoryFrontendController {
    constructor(private readonly service: ServiceSubCategoryService) { }
    @Get('list')
    findActive() {
        return this.service.findActive();
    }
}