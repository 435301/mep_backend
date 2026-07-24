import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateServiceProviderDto } from './dto/create-service-provider.dto';
import { UpdateServiceProviderDto } from './dto/update-service-provider.dto';
import { ServiceProvider } from './entities/service-provider.entity';
import { BaseService } from 'src/common/services/base.service';
import { District } from '../districts/entities/district.entity';
import { Experience } from '../experience/entities/experience.entity';
import { Language } from '../languages/entities/language.entity';
import { MESSAGES } from 'src/common/constants/status.constants';

@Injectable()
export class ServiceProviderService extends BaseService {
  constructor(
    @InjectRepository(ServiceProvider)
    private readonly providerRepo: Repository<ServiceProvider>,

    @InjectRepository(District)
    private readonly districtRepo: Repository<District>,

    @InjectRepository(Experience)
    private readonly experienceRepo: Repository<Experience>,

    @InjectRepository(Language)
    private readonly languageRepo: Repository<Language>,
  ) {
    super();
  }

  async create(dto: CreateServiceProviderDto, user: any) {
    const emailExists = await this.providerRepo.findOne({
      where: {
        email: dto.email,
        trash: false,
      },
    });

    if (emailExists) {
      throw new BadRequestException(MESSAGES.EMAIL_EXISTS);
    }

    const mobileExists = await this.providerRepo.findOne({
      where: {
        mobile: dto.mobile,
        trash: false,
      },
    });

    if (mobileExists) {
      throw new BadRequestException(MESSAGES.MOBILE_NUMBER_EXISTS);
    }

    const district = await this.districtRepo.findOne({
      where: {
        id: dto.districtId,
        trash: false,
      },
    });

    if (!district) {
      throw new BadRequestException(MESSAGES.DISTRICT_NOT_FOUND);
    }

    if (dto.experienceId) {
      const experience = await this.experienceRepo.findOne({
        where: {
          id: dto.experienceId,
          trash: false,
        },
      });

      if (!experience) {
        throw new BadRequestException(MESSAGES.EXPERIENCE_NOT_FOUND);
      }
    }

    if (dto.languageId) {
      const language = await this.languageRepo.findOne({
        where: {
          id: dto.languageId,
          trash: false,
        },
      });

      if (!language) {
        throw new BadRequestException(MESSAGES.LANGUAGE_NOT_FOUND);
      }
    }

    const provider = this.providerRepo.create({
      ...dto,
      createdBy: user?.id,
    });

    await this.providerRepo.save(provider);
    return {
      message: 'Service provider created successfully',
    };
  }

  async findAll(dto: any) {
    const { page, limit, pagination, search, status } = dto;

    const qb = this.providerRepo
      .createQueryBuilder('provider')
      .leftJoinAndSelect('provider.state', 'state')
      .leftJoinAndSelect('provider.district', 'district')
      .leftJoinAndSelect('provider.experience', 'experience')
      .leftJoinAndSelect('provider.language', 'language')
      .where('provider.trash = :trash', {
        trash: false,
      });

    if (typeof status === 'boolean') {
      qb.andWhere('provider.status = :status', {
        status,
      });
    }

    if (search && search.trim().length >= 3) {
      qb.andWhere(
        `(provider.name LIKE :search
        OR provider.email LIKE :search
        OR provider.mobile LIKE :search)`,
        {
          search: `%${search}%`,
        },
      );
    }

    qb.orderBy('provider.createdAt', 'DESC');

    const data = await this.paginate(
      qb,
      page,
      limit,
      pagination,
    );

    return {
      ...data,
      message: 'Service providers fetched successfully',
    };
  }

  async findOne(id: number) {
    const provider = await this.providerRepo.findOne({
      where: {
        id,
        trash: false,
      },
      relations: {
        district: true,
        experience: true,
        language: true,
      },
    });

    if (!provider) {
      throw new BadRequestException(
        'Service provider not found',
      );
    }

    return {
      data: provider,
      message: 'Service provider fetched successfully',
    };
  }

  async update(
    id: number,
    dto: UpdateServiceProviderDto,
    user: any,
  ) {
    const provider = await this.providerRepo.findOne({
      where: {
        id,
        trash: false,
      },
    });

    if (!provider) {
      throw new BadRequestException(
        'Service provider not found',
      );
    }

    Object.assign(provider, dto);
    provider.updatedBy = user?.id;

    await this.providerRepo.save(provider);

    return {
      data: provider,
      message: 'Service provider updated successfully',
    };
  }

  async remove(id: number, user: any) {
    const provider = await this.providerRepo.findOne({
      where: {
        id,
        trash: false,
      },
    });

    if (!provider) {
      throw new BadRequestException(
        'Service provider not found',
      );
    }

    provider.trash = true;
    provider.updatedBy = user?.id;

    await this.providerRepo.save(provider);

    return {
      message: 'Service provider deleted successfully',
    };
  }

  async changeStatus(id: number) {
    const provider = await this.providerRepo.findOne({
      where: {
        id,
        trash: false,
      },
    });

    if (!provider) {
      throw new BadRequestException(
        'Service provider not found',
      );
    }

    provider.status = !provider.status;

    await this.providerRepo.save(provider);

    return {
      data: provider,
      message: 'Status updated successfully',
    };
  }
}