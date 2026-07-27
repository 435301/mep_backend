
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { BaseService } from "src/common/services/base.service";
import { MESSAGES } from "src/common/constants/status.constants";
import { Injectable } from "@nestjs/common";
import { Language } from "./language.entity";


@Injectable()
export class LanguageService extends BaseService{
  constructor(
    @InjectRepository(Language)
    private readonly languageRepo: Repository<Language>,
  ) {
    super()
  }

async findAll(dto: PaginationDto) {
  const { page, limit, search, pagination, status } = dto;

  const qb = this.languageRepo
    .createQueryBuilder('language')
    .where('language.trash = :trash', { trash: false });

  if (typeof status === 'boolean') {
    qb.andWhere('language.status = :status', { status });
  }

  if (search && search.trim().length >= 3) {
    qb.andWhere('language.name LIKE :search', {
      search: `%${search.trim()}%`,
    });
  }

  const data = await this.paginate(
    qb,
    page,
    limit,
    pagination,
  );

  return {
    ...data,
    message: MESSAGES.LANGUAGE_FETCHED_SUCCESS,
  };
}
}