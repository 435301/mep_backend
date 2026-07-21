import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { iconUploadConfig } from '../utils/uploads.utils';


@Controller('uploads')
export class UploadController {

  @Post('machineryIcon')
  @UseInterceptors(FileInterceptor('icon', iconUploadConfig('machineryCategory')))
  uploadMachineryIcon(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('Icon file is required');
    }

    return { icon: `machineryCategory/${file.filename}` };
  }
}
