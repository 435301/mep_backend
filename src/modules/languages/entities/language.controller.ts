import { Body, Controller, Post } from '@nestjs/common';
import { LanguageService } from './language.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('language')
export class LanguageController {
  constructor(
    private readonly languageService: LanguageService,
  ) {}

  @Post('list')
  async findAll(@Body() dto: PaginationDto) {
    return this.languageService.findAll(dto);
  }
}