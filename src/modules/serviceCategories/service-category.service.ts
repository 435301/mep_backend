import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/services/base.service';
import { MESSAGES } from 'src/common/constants/status.constants';
import { ServiceCategory } from './entities/service-category.entity';
import { ServiceType } from '../serviceTypes/entities/service-type.entity';
import { CreateServiceCategoryDto } from './dto/create-service-category-dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category-dto';

@Injectable()
export class ServiceCategoryService extends BaseService {
    constructor(
        @InjectRepository(ServiceCategory)
        private ServiceCategoryRepo: Repository<ServiceCategory>,
    ) {
        super();
    }

    async create(
        dto: CreateServiceCategoryDto,
        adminId: number,
        file?: Express.Multer.File,
    ) {
        const exists = await this.ServiceCategoryRepo.findOne({
            where: { title: dto.title, trash: false },
            relations: {
                serviceType: true
            },
        });

        if (exists) {
            throw new BadRequestException(
                MESSAGES.SERVICE_CATEGORY_ALREADY_EXISTS,
            );
        }
        if (!file) {
            throw new BadRequestException(MESSAGES.ICON_REQUIRED);
        }

        const iconPath = `ServiceCategory/${file.filename}`;

        const category = this.ServiceCategoryRepo.create({
            serviceTypeId: dto.serviceTypeId,
            title: dto.title,
            icon: iconPath,
            position: dto.position ?? 0,
            status: dto.status ?? true,

        });

        category.createdBy = adminId;
        try {
            const result = await this.ServiceCategoryRepo.save(category);
            return {
                message: MESSAGES.SERVICE_CATEGORY_CREATED,
                result
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
        const { page, limit, search, pagination, status } = dto;

        const qb = this.ServiceCategoryRepo
            .createQueryBuilder('ServiceCategory')
            .leftJoinAndSelect(
                "ServiceCategory.serviceType",
                "serviceType",
            )
            .where('ServiceCategory.trash = :trash', { trash: false });

        if (typeof status === 'boolean') {
            qb.andWhere('ServiceCategory.status = :status', { status });
        }

        if (search && search.trim().length >= 3) {
            qb.andWhere('ServiceCategory.title LIKE :search', {
                search: `%${search.trim()}%`,
            });
        }
        if (pagination) {
            qb.orderBy('ServiceCategory.createdAt', 'DESC');
        } else {
            qb.orderBy('ServiceCategory.title', 'ASC');
        }
        return this.paginate(qb, page, limit, pagination);

    }

    async findOne(id: number) {
        const ServiceCategory = await this.ServiceCategoryRepo.findOne({
            where: { id, trash: false },
            relations: {
                serviceType: true
            },
        });

        if (!ServiceCategory) {
            throw new BadRequestException(MESSAGES.SERVICE_CATEGORY_NOT_FOUND);
        }

        return ServiceCategory;
    }

    async update(
        id: number,
        dto: UpdateServiceCategoryDto,
        adminId: number,
        file?: Express.Multer.File,
    ) {
        const ServiceCategory = await this.findOne(id);

        const fs = require('fs');
        const path = require('path');

        if (file) {
            // delete old icon
            if (ServiceCategory.icon) {
                const oldPath = path.join(
                    process.cwd(),
                    'uploads',
                    ServiceCategory.icon,
                );

                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            dto.icon = `ServiceCategory/${file.filename}`;
        }
        if (dto.title) {
            dto.title = dto.title.trim();
        }

        Object.assign(ServiceCategory, {
            ...dto,
            position: dto.position ?? ServiceCategory.position,
            status: dto.status ?? ServiceCategory.status,
        });

        ServiceCategory.updatedBy = adminId;
        await this.ServiceCategoryRepo.save(ServiceCategory);

        return {
            message: MESSAGES.SERVICE_CATEGORY_UPDATED,
            ServiceCategory,
        };
    }

    async remove(id: number, adminId: number) {
        const ServiceCategory = await this.findOne(id);
        ServiceCategory.trash = true;
        ServiceCategory.updatedBy = adminId;

        await this.ServiceCategoryRepo.save(ServiceCategory);
        return { message: MESSAGES.SERVICE_CATEGORY_DELETED };
    }

    //frontend apis 
    async findActive() {
        const qb = this.ServiceCategoryRepo
            .createQueryBuilder('ServiceCategoryRepo')
            .where('ServiceCategoryRepo.trash = :trash', { trash: false });
        qb.andWhere('ServiceCategoryRepo.status = :status', { status: true });
        return this.paginate(qb);
    }
}
