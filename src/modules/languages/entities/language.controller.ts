import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LanguageService } from './language.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ROUTES } from 'src/common/constants/routes.constant';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/gaurds/roles.guard';


@Controller(`${ROUTES.ADMIN}/language`)
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class LanguageController {
  constructor(
    private readonly languageService: LanguageService,
  ) {}

  @Post('list')
  async findAll(@Body() dto: PaginationDto) {
    return this.languageService.findAll(dto);
  }
}