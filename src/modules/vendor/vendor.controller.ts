import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { VendorsService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor-dto';
import { iconUploadConfig } from 'src/common/utils/uploads.utils';
import { ListVendorDto } from './dto/list-vendor-dto';
import { UpdateVendorDto } from './dto/update-vendor-dto';
import { ROUTES } from 'src/common/constants/routes.constant';

@Controller(`${ROUTES.ADMIN}/vendors`)
@UseGuards(AuthGuard('jwt'))
export class VendorsController {
  constructor(private readonly service: VendorsService) { }

  @Post('create')
  @UseInterceptors(
    FileInterceptor('icon', iconUploadConfig('vendors'))
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateVendorDto,
    @Req() req: any,
  ) {
    return this.service.create(dto, req.user.id, file);
  }

  @Post('list')
  findAll(@Body() dto: ListVendorDto) {
    return this.service.findAll(dto);
  }

  @Get('getById/:id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(+id);
  }

  @Put('update/:id')
  @UseInterceptors(
    FileInterceptor('icon', iconUploadConfig('vendors'))
  )
  update(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateVendorDto,
    @Req() req: any,
  ) {
    return this.service.update(id, dto, req.user?.id, file);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: number, @Req() req) {
    return this.service.remove(+id, req.user.id);
  }

  // Change Status
  @Patch(':id/status')
  async changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', ParseBoolPipe) status: boolean,
    @Req() req: any,
  ) {
    return this.service.changeStatus(
      id,
      status,
      req.user.id,
    );
  }
}