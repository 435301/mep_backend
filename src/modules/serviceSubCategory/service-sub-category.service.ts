import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/services/base.service';
import { MESSAGES } from 'src/common/constants/status.constants';
import { ServiceSubCategory } from './entities/service-sub-category.entity';
import { CreateServiceSubCategoryDto } from './dto/create-service-sub-category-dto';
import { UpdateServiceSubCategoryDto } from './dto/update-service-sub-category-dto';
import { BulkStatusDto } from 'src/common/dto/bulk.dto';
import { BulkStatusHelper } from 'src/common/services/bulk.service';
import { ServiceType } from '../serviceTypes/entities/service-type.entity';
import { ServiceCategory } from '../serviceCategories/entities/service-category.entity';


@Injectable()
export class ServiceSubCategoryService extends BaseService {
    constructor(
        @InjectRepository(ServiceSubCategory)
        private ServiceSubCategoryRepo: Repository<ServiceSubCategory>,
        @InjectRepository(ServiceType)
        private ServiceTypeRepo: Repository<ServiceType>,
        @InjectRepository(ServiceType)
        private ServiceCatRepo: Repository<ServiceCategory>,

    ) {
        super();
    }

    async create(
        dto: CreateServiceSubCategoryDto,
        adminId: number,
        file?: Express.Multer.File,
    ) {
        const exists = await this.ServiceSubCategoryRepo.findOne({
            where: { title: dto.title, trash: false },
            relations: {
                serviceCategory: {
                    serviceType: true,
                }
            },
        });

        const serviceTypeExists = await this.ServiceTypeRepo.findOne({
            where: {
                id: dto.serviceTypeId,
                trash: false,
            },
        });

        if (!serviceTypeExists) {
            throw new BadRequestException(MESSAGES.SERVICE_TYPE_NOT_FOUND);
        }

        const serviceCatExists = await this.ServiceCatRepo.findOne({
            where: {
                id: dto.serviceCategoryId,
                trash: false,
            },
        });

        if (!serviceCatExists) {
            throw new BadRequestException(MESSAGES.SERVICE_CATEGORY_NOT_FOUND);
        }


        if (exists) {
            throw new BadRequestException(
                MESSAGES.SERVICE_SUB_CATEGORY_ALREADY_EXISTS,
            );
        }
        if (!file) {
            throw new BadRequestException(MESSAGES.ICON_REQUIRED);
        }

        const iconPath = `ServiceSubCategory/${file.filename}`;

        const category = this.ServiceSubCategoryRepo.create({
            serviceCategoryId: dto.serviceCategoryId,
            title: dto.title,
            icon: iconPath,
            position: dto.position ?? 0,
            status: dto.status ?? true,

        });

        category.createdBy = adminId;
        try {
            const data = await this.ServiceSubCategoryRepo.save(category);
            return {
                message: MESSAGES.SERVICE_SUB_CATEGORY_CREATED,
            }
        } catch (error) {
            const fs = require('fs');
            const path = require('path');

            const filePath = path.join(
                process.cwd(),
                'uploads',
                iconPath,
            );

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            throw error;
        }
    }

    async findAll(dto) {
        const { page, limit, search, pagination, status, serviceTypeId, serviceCategoryId } = dto;

        const qb = this.ServiceSubCategoryRepo
            .createQueryBuilder('ServiceSubCategory')
            .leftJoinAndSelect(
                "ServiceSubCategory.serviceCategory",
                "serviceCategory",
            )
            .leftJoinAndSelect(
                "serviceCategory.serviceType",
                "serviceType",
            )
            .where('ServiceSubCategory.trash = :trash', { trash: false });

        if (typeof status === 'boolean') {
            qb.andWhere('ServiceSubCategory.status = :status', { status });
        }

        if (search && search.trim().length >= 3) {
            qb.andWhere('ServiceSubCategory.title LIKE :search', {
                search: `%${search.trim()}%`,
            });
        }
        if (serviceTypeId) {
            qb.andWhere('ServiceSubCategory.serviceTypeId = :serviceTypeId', { serviceTypeId });
        }
        if (serviceCategoryId) {
            qb.andWhere('ServiceSubCategory.serviceCategoryId = :serviceCategoryId', { serviceCategoryId });
        }
        if (pagination) {
            qb.orderBy('ServiceSubCategory.createdAt', 'DESC');
        } else {
            qb.orderBy('ServiceSubCategory.title', 'ASC');
        }
        return this.paginate(qb, page, limit, pagination);

    }

    async findOne(id: number) {
        const ServiceSubCategory = await this.ServiceSubCategoryRepo.findOne({
            where: { id, trash: false },
            relations: {
                serviceCategory: {
                    serviceType: true
                }
            },
        });

        if (!ServiceSubCategory) {
            throw new BadRequestException(MESSAGES.SERVICE_SUB_CATEGORY_NOT_FOUND);
        }

        return ServiceSubCategory;
    }

    async update(
        id: number,
        dto: UpdateServiceSubCategoryDto,
        adminId: number,
        file?: Express.Multer.File,
    ) {
        const serviceTypeExists = await this.ServiceTypeRepo.findOne({
            where: {
                id: dto.serviceTypeId,
                trash: false,
            },
        });

        if (!serviceTypeExists) {
            throw new BadRequestException(MESSAGES.SERVICE_TYPE_NOT_FOUND);
        }

        const serviceCatExists = await this.ServiceCatRepo.findOne({
            where: {
                id: dto.serviceCategoryId,
                trash: false,
            },
        });

        if (!serviceCatExists) {
            throw new BadRequestException(MESSAGES.SERVICE_CATEGORY_NOT_FOUND);
        }
        const ServiceSubCategory = await this.findOne(id);

        const fs = require('fs');
        const path = require('path');

        if (file) {
            // delete old icon
            if (ServiceSubCategory.icon) {
                const oldPath = path.join(
                    process.cwd(),
                    'uploads',
                    ServiceSubCategory.icon,
                );

                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            dto.icon = `ServiceSubCategory/${file.filename}`;
        }
        if (dto.title) {
            dto.title = dto.title.trim();
        }

        Object.assign(ServiceSubCategory, {
            ...dto,
            position: dto.position ?? ServiceSubCategory.position,
            status: dto.status ?? ServiceSubCategory.status,
        });

        ServiceSubCategory.updatedBy = adminId;
        await this.ServiceSubCategoryRepo.save(ServiceSubCategory);

        return {
            message: MESSAGES.SERVICE_SUB_CATEGORY_UPDATED,
        
        };
    }

    async remove(id: number, adminId: number) {
        const ServiceSubCategory = await this.findOne(id);
        ServiceSubCategory.trash = true;
        ServiceSubCategory.updatedBy = adminId;

        await this.ServiceSubCategoryRepo.save(ServiceSubCategory);
        return { message: MESSAGES.SERVICE_SUB_CATEGORY_DELETED };
    }

    async bulkStatus(dto: BulkStatusDto, adminId: number) {
        return BulkStatusHelper.updateStatus(
            this.ServiceSubCategoryRepo,
            dto.ids,
            dto.status,
            adminId,
        );
    }

    //frontend apis 
    async findActive() {
        const qb = this.ServiceSubCategoryRepo
            .createQueryBuilder('ServiceSubCategoryRepo')
            .where('ServiceSubCategoryRepo.trash = :trash', { trash: false });
        qb.andWhere('ServiceSubCategoryRepo.status = :status', { status: true });
        return this.paginate(qb);
    }
}
