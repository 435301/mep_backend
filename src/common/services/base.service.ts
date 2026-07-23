import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class BaseService {
  protected async paginate<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  page = 1,
  limit = 15,
  pagination = true,
) {
   page = page && page > 0 ? page : 1;
  limit = limit && limit > 0 ? limit : 15;
  if (pagination) {
    qb.skip((page - 1) * limit).take(limit);
  }

  const [data, total] = await qb.getManyAndCount();

  return {
    data,
    total,
    page: pagination ? page : 1,
    limit: pagination ? limit : total,
    totalPages: pagination ? Math.ceil(total / limit) : 1,
  };
}

}


