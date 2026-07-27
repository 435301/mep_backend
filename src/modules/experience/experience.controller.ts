import { Body, Controller, Post } from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('experience')
export class ExperienceController {
  constructor(
    private readonly experienceService: ExperienceService,
  ) {}

  @Post('list')
  async findAll(@Body() dto: PaginationDto) {
    return this.experienceService.findAll(dto);
  }
}