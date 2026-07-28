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
    Query,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ServiceProviderService } from './service-provider.service';
import { CreateServiceProviderDto } from './dto/create-service-provider.dto';
import { UpdateServiceProviderDto } from './dto/update-service-provider.dto';
import { AuthGuard } from '@nestjs/passport';
import { ROUTES } from 'src/common/constants/routes.constant';
import { FileInterceptor } from '@nestjs/platform-express';
import { iconUploadConfig } from 'src/common/utils/uploads.utils';
import { ListServiceProviderDto } from './dto/list-service-provider-dto';
import { BulkStatusDto } from 'src/common/dto/bulk.dto';

@Controller(`${ROUTES.ADMIN}/serviceProvider`)
@UseGuards(AuthGuard('jwt'))
export class ServiceProviderController {
    constructor(
        private readonly serviceProviderService: ServiceProviderService,
    ) { }

    @Post('create')
    @UseInterceptors(
        FileInterceptor('icon', iconUploadConfig('serviceProviders'))
    )
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: CreateServiceProviderDto,
        @Req() req: any,
    ) {
        console.log(dto.services);
        console.log(typeof dto.services);
        return this.serviceProviderService.create(dto, req.user.id, file);
    }

    @Post('list')
    findAll(@Body() dto: ListServiceProviderDto) {
        return this.serviceProviderService.findAll(dto);
    }

    @Get('getById/:id')
    findOne(@Param('id') id: number) {
        return this.serviceProviderService.findOne(+id);
    }

    @Put('update/:id')
    @UseInterceptors(
        FileInterceptor('icon', iconUploadConfig('serviceProviders'))
    )
    update(
        @Param('id') id: number,
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: UpdateServiceProviderDto,
        @Req() req: any,
    ) {
        return this.serviceProviderService.update(id, dto, req.user?.id, file);
    }

    @Delete('delete/:id')
    remove(@Param('id') id: number, @Req() req) {
        return this.serviceProviderService.remove(+id, req.user.id);
    }


    @Patch('bulk-status')
    async bulkStatus(
        @Body() dto: BulkStatusDto,
        @Req() req: any,
    ) {
        return this.serviceProviderService.bulkStatus(
            dto,
            req.user.id,
        );
    }


}