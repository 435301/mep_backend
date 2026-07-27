import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Experience } from "./entities/experience.entity";
import { Repository } from "typeorm";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { BaseService } from "src/common/services/base.service";
import { MESSAGES } from "src/common/constants/status.constants";


@Injectable()
export class ExperienceService extends BaseService{
  constructor(
    @InjectRepository(Experience)
    private readonly experienceRepo: Repository<Experience>,
  ) {
    super()
  }

async findAll(dto: PaginationDto) {
  const { page, limit, search, pagination, status } = dto;

  const qb = this.experienceRepo
    .createQueryBuilder('experience')
    .where('experience.trash = :trash', { trash: false });

  if (typeof status === 'boolean') {
    qb.andWhere('experience.status = :status', { status });
  }

  if (search && search.trim().length >= 3) {
    qb.andWhere('experience.name LIKE :search', {
      search: `%${search.trim()}%`,
    });
  }

  qb.orderBy('experience.position', 'ASC');

  const data = await this.paginate(
    qb,
    page,
    limit,
    pagination,
  );

  return {
    ...data,
    message: MESSAGES.EXPERIENCE_FETCHED_SUCCESS,
  };
}

}