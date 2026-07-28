import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateServiceProviderDto } from './dto/create-service-provider.dto';
import { UpdateServiceProviderDto } from './dto/update-service-provider.dto';
import { ServiceProvider } from './entities/service-provider.entity';
import { BaseService } from 'src/common/services/base.service';
import { District } from '../districts/entities/district.entity';
import { Experience } from '../experience/entities/experience.entity';
import { Language } from '../languages/entities/language.entity';
import { MESSAGES } from 'src/common/constants/status.constants';
import { ServiceSubCategory } from '../serviceSubCategory/entities/service-sub-category.entity';
import { FileUrlHelper } from 'src/common/utils/file-url.helper';
import { BulkStatusDto } from 'src/common/dto/bulk.dto';
import { BulkStatusHelper } from 'src/common/services/bulk.service';
import { ServiceType } from '../serviceTypes/entities/service-type.entity';
import { ServiceCategory } from '../serviceCategories/entities/service-category.entity';

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

    @InjectRepository(ServiceSubCategory)
    private readonly subCategoryRepo: Repository<ServiceSubCategory>,

    @InjectRepository(ServiceType)
    private readonly serviceTypeRepo: Repository<ServiceType>,
    @InjectRepository(ServiceCategory)
    private readonly serviceCategoryRepo: Repository<ServiceCategory>,
  ) {
    super();
  }

  async create(
    dto: CreateServiceProviderDto,
    adminId: number,
    file?: Express.Multer.File,
  ) {
    const mobileExists = await this.providerRepo.findOne({
      where: { mobile: dto.mobile },
    });

    if (mobileExists) {
      throw new BadRequestException(MESSAGES.MOBILE_NUMBER_EXISTS);
    }

    const emailExists = await this.providerRepo.findOne({
      where: { email: dto.email },
    });
    if (emailExists) {
      throw new BadRequestException(MESSAGES.EMAIL_EXISTS);
    }
    const district = await this.districtRepo.findOne({
      where: {
        id: dto.districtId,
        trash: false,
      },
      relations: {
        state: true,
      },
    });

    if (!district) {
      throw new BadRequestException(MESSAGES.DISTRICT_NOT_FOUND);
    }


    const experience = await this.experienceRepo.findOne({
      where: {
        id: dto.experienceId,
        trash: false,
      },
    });

    if (!experience) {
      throw new BadRequestException(MESSAGES.EXPERIENCE_NOT_FOUND);
    }


    const language = await this.languageRepo.findOne({
      where: {
        id: dto.languageId,
        trash: false,
      },
    });

    if (!language) {
      throw new BadRequestException(MESSAGES.LANGUAGE_NOT_FOUND);
    }
    const providerSubCategories: ServiceSubCategory[] = [];

    for (const service of dto.services) {
      const serviceType = await this.serviceTypeRepo.findOne({
        where: {
          id: service.serviceTypeId,
          trash: false,
        },
      });

      if (!serviceType) {
        throw new BadRequestException(
          MESSAGES.SERVICE_TYPE_NOT_FOUND,
        );
      }

      const category = await this.serviceCategoryRepo.findOne({
        where: {
          id: service.serviceCategoryId,
          serviceTypeId: service.serviceTypeId,
          trash: false,
        },
      });

      if (!category) {
        throw new BadRequestException(
          `Category ${service.serviceCategoryId} does not belong to Service Type ${service.serviceTypeId}`,
        );
      }

      const subCategories =
        await this.subCategoryRepo.find({
          where: {
            id: In(service.serviceSubCategoryIds),
            serviceCategoryId:
              service.serviceCategoryId,
            trash: false,
          },
        });

      if (
        subCategories.length !==
        service.serviceSubCategoryIds.length
      ) {
        throw new BadRequestException(
          'Invalid sub categories selected.',
        );
      }

      providerSubCategories.push(...subCategories);
    }


    if (!file) {
      throw new BadRequestException(MESSAGES.PROFILE_IMAGE_REQUIRED
      );
    }
    const iconPath = `serviceProviders/${file.filename}`;

    const provider = this.providerRepo.create({
      ...dto,
      icon: iconPath,
      districtId: district.id,
      experienceId: experience?.id,
      languageId: language?.id,
      district,
      experience,
      language,
      serviceSubCategories: providerSubCategories,
      createdBy: adminId,
    });

    await this.providerRepo.save(provider);

    return {
      message: MESSAGES.SERVICE_PROVIDER_CREATED,
    };
  }

  async findAll(dto) {
    const {
      page,
      limit,
      pagination,
      search,
      status,
      serviceTypeId,
      serviceCategoryId,
      serviceSubCategoryId,
      districtId,
    } = dto;

    const qb = this.providerRepo
      .createQueryBuilder('provider')
      .leftJoinAndSelect(
        'provider.serviceSubCategories',
        'serviceSubCategory',
      )
      .leftJoinAndSelect(
        'serviceSubCategory.serviceCategory',
        'serviceCategory',
      )
      .leftJoinAndSelect(
        'serviceCategory.serviceType',
        'serviceType',
      )
      .leftJoinAndSelect('provider.district', 'district')
      .leftJoinAndSelect('district.state', 'state')
      .leftJoinAndSelect('provider.experience', 'experience')
      .leftJoinAndSelect('provider.language', 'language')
      .where('provider.trash = false');

    if (status !== undefined) {
      qb.andWhere('provider.status = :status', { status });
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

    if (serviceTypeId) {
      qb.andWhere('serviceType.id = :serviceTypeId', {
        serviceTypeId,
      });
    }

    if (serviceCategoryId) {
      qb.andWhere('serviceCategory.id = :serviceCategoryId', {
        serviceCategoryId,
      });
    }

    if (serviceSubCategoryId?.length) {
      qb.andWhere(
        'serviceSubCategory.id IN (:...serviceSubCategoryId)',
        {
          serviceSubCategoryId,
        },
      );
    }

    if (districtId) {
      qb.andWhere('provider.districtId = :districtId', {
        districtId,
      });
    }

    qb.orderBy('provider.createdAt', 'DESC');

    const data = await this.paginate(
      qb,
      page,
      limit,
      pagination,
    );

    data.data = FileUrlHelper.mapArray(data.data);

    return {
      ...data,
      message: MESSAGES.SERVICE_PROVIDER_FETCHED_SUCCESS,
    };
  }

  async findOne(id: number) {
    const provider = await this.providerRepo.findOne({
      where: {
        id,
        trash: false,
      },
      relations: {
        district: {
          state: true,
        },
        experience: true,
        language: true,
        serviceSubCategories: {
          serviceCategory: {
            serviceType: true,
          },
        },
      },
    });

    if (!provider) {
      throw new BadRequestException(
        MESSAGES.SERVICE_PROVIDER_NOT_FOUND,
      );
    }
    const data = FileUrlHelper.mapArray([provider]);
    return {
      data: data[0],
      message: MESSAGES.SERVICE_PROVIDER_FETCHED_SUCCESS,
    };
  }
  async update(
    id: number,
    dto: UpdateServiceProviderDto,
    adminId: number,
    file?: Express.Multer.File,

  ) {
    const provider = await this.providerRepo.findOne({
      where: {
        id,
        trash: false,
      },
      relations: {
        serviceSubCategories: true,
      },
    });

    if (!provider) {
      throw new BadRequestException(
        MESSAGES.SERVICE_PROVIDER_NOT_FOUND,
      );
    }

    if (dto.districtId) {
      const district = await this.districtRepo.findOne({
        where: {
          id: dto.districtId,
          trash: false,
        },
      });

      if (!district) {
        throw new BadRequestException(
          MESSAGES.DISTRICT_NOT_FOUND,
        );
      }

      provider.district = district;
      provider.districtId = district.id;
    }
    if (dto.mobile) {
      const mobile = await this.providerRepo.findOne({
        where: {
          mobile: dto.mobile,
        },
      });

      if (mobile && mobile.id !== id) {
        throw new BadRequestException(MESSAGES.MOBILE_NUMBER_EXISTS);
      }
    }
    if (dto.email) {
      const email = await this.providerRepo.findOne({
        where: {
          email: dto.email,
        },
      });

      if (email && email.id !== id) {
        throw new BadRequestException(MESSAGES.EMAIL_EXISTS);
      }
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

      provider.experience = experience;
      provider.experienceId = experience.id;
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

      provider.language = language;
      provider.languageId = language.id;
    }

    if (dto.services?.length) {
      const providerSubCategories: ServiceSubCategory[] = [];

      for (const service of dto.services) {
        const serviceType = await this.serviceTypeRepo.findOne({
          where: {
            id: service.serviceTypeId,
            trash: false,
          },
        });

        if (!serviceType) {
          throw new BadRequestException(MESSAGES.SERVICE_TYPE_NOT_FOUND);
        }

        const category = await this.serviceCategoryRepo.findOne({
          where: {
            id: service.serviceCategoryId,
            serviceTypeId: service.serviceTypeId,
            trash: false,
          },
        });

        if (!category) {
          throw new BadRequestException(
            "Selected Service Category does not belong to the selected Service Type.",
          );
        }

        const subCategories = await this.subCategoryRepo.find({
          where: {
            id: In(service.serviceSubCategoryIds),
            serviceCategoryId: service.serviceCategoryId,
            trash: false,
          },
        });

        if (subCategories.length !== service.serviceSubCategoryIds.length) {
          throw new BadRequestException("Invalid Sub Categories.");
        }

        providerSubCategories.push(...subCategories);
      }

      provider.serviceSubCategories = providerSubCategories;
    }
    if (file) {
      provider.icon = `serviceProviders/${file.filename}`;
    }

    Object.assign(provider, dto);
    provider.updatedBy = adminId;

    await this.providerRepo.save(provider);

    return {
      message: MESSAGES.SERVICE_PROVIDER_UPDATED,
    };
  }

  async remove(id: number, adminId: number) {
    const provider = await this.providerRepo.findOne({
      where: {
        id,
        trash: false,
      },
    });

    if (!provider) {
      throw new BadRequestException(
        MESSAGES.SERVICE_PROVIDER_NOT_FOUND,
      );
    }

    provider.trash = true;
    provider.updatedBy = adminId

    await this.providerRepo.save(provider);

    return {
      message: MESSAGES.SERVICE_PROVIDER_DELETED,
    };
  }

  async bulkStatus(dto: BulkStatusDto, adminId: number) {
    return BulkStatusHelper.updateStatus(
      this.providerRepo,
      dto.ids,
      dto.status,
      adminId,
    );
  }
}