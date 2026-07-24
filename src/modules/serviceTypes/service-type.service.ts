import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/services/base.service';
import { MESSAGES } from 'src/common/constants/status.constants';
import { ServiceType } from './entities/service-type.entity';
import { CreateServiceTypeDto } from './dto/create-service-type-dto';
import { UpdateServiceTypeDto } from './dto/update-service-type-dto';
import { BulkStatusDto } from 'src/common/dto/bulk.dto';
import { BulkStatusHelper } from 'src/common/services/bulk.service';

@Injectable()
export class ServiceTypeService extends BaseService {
    constructor(
        @InjectRepository(ServiceType)
        private ServiceTypeRepo: Repository<ServiceType>,
    ) {
        super();
    }

    async create(
        dto: CreateServiceTypeDto,
        adminId: number,
    ) {
        const exists = await this.ServiceTypeRepo.findOne({
            where: { title: dto.title, trash: false },
        });

        if (exists) {
            throw new BadRequestException(
                MESSAGES.SERVICE_TYPE_ALREADY_EXISTS,
            );
        }
        if (dto.position) {
            const existingPosition = await this.ServiceTypeRepo.findOne({
                where: {
                    position: dto.position,
                    trash: false,
                },
            });

            if (existingPosition) {
                throw new BadRequestException(MESSAGES.POSITION_ALREADY_EXISTS);
            }
        }
        const category = this.ServiceTypeRepo.create({
            title: dto.title,
            position: dto.position ?? 0,
            status: dto.status ?? true,
        });

        category.createdBy = adminId;
        try {
            const data = await this.ServiceTypeRepo.save(category);
            return {
                message: MESSAGES.SERVICE_TYPE_CREATED,
            }
        } catch (error) {
            throw error;
        }
    }

    async findAll(dto) {
        const { page, limit, search, pagination, status } = dto;

        const qb = this.ServiceTypeRepo
            .createQueryBuilder('ServiceType')
            .where('ServiceType.trash = :trash', { trash: false });

        if (typeof status === 'boolean') {
            qb.andWhere('ServiceType.status = :status', { status });
        }

        if (search && search.trim().length >= 3) {
            qb.andWhere('ServiceType.title LIKE :search', {
                search: `%${search.trim()}%`,
            });
        }
        if (pagination) {
            qb.orderBy('ServiceType.createdAt', 'DESC');
        } else {
            qb.orderBy('ServiceType.title', 'ASC');
        }

        const data = await this.paginate(qb, page, limit, pagination);
        return {
            ...data,
            message: MESSAGES.SERVICE_TYPE_FETCHED_SUCCESS
        }

    }

    async findOne(id: number) {
        const ServiceType = await this.ServiceTypeRepo.findOne({
            where: { id, trash: false },
        });

        if (!ServiceType) {
            throw new BadRequestException(MESSAGES.SERVICE_TYPE_NOT_FOUND);
        }

        return ServiceType;
    }

    async update(
        id: number,
        dto: UpdateServiceTypeDto,
        adminId: number,
    ) {
        const ServiceType = await this.findOne(id);

        Object.assign(ServiceType, {
            ...dto,
            position: dto.position ?? ServiceType.position,
            status: dto.status ?? ServiceType.status,
        });

        ServiceType.updatedBy = adminId;
        await this.ServiceTypeRepo.save(ServiceType);

        return {
            message: MESSAGES.SERVICE_TYPE_UPDATED,
        };
    }

    async remove(id: number, adminId: number) {
        const ServiceType = await this.findOne(id);
        ServiceType.trash = true;
        ServiceType.updatedBy = adminId;

        await this.ServiceTypeRepo.save(ServiceType);
        return { message: MESSAGES.SERVICE_TYPE_DELETED };
    }


    async bulkStatus(dto: BulkStatusDto, adminId: number) {
        return BulkStatusHelper.updateStatus(
            this.ServiceTypeRepo,
            dto.ids,
            dto.status,
            adminId,
        );
    }

    //frontend apis 
    async findActive() {
        const qb = this.ServiceTypeRepo
            .createQueryBuilder('ServiceTypeRepo')
            .where('ServiceTypeRepo.trash = :trash', { trash: false });
        qb.andWhere('ServiceTypeRepo.status = :status', { status: true });
        return this.paginate(qb);
    }
}
