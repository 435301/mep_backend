import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async findAll() {
    const roles = await this.roleRepo.find({
      order: {
        id: 'ASC',
      },
    });

    return {
      success: true,
      message: 'Roles fetched successfully',
      data: roles,
    };
  }
}
