import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ROUTES } from 'src/common/constants/routes.constant';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/gaurds/roles.guard';

@Controller(`${ROUTES.ADMIN}/experience`)
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ExperienceController {
  constructor(
    private readonly experienceService: ExperienceService,
  ) {}

  @Post('list')
  async findAll(@Body() dto: PaginationDto) {
    return this.experienceService.findAll(dto);
  }
}