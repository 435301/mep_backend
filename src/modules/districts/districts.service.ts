import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MESSAGES } from 'src/common/constants/status.constants';
import { BaseService } from 'src/common/services/base.service';
import { District } from './entities/district.entity';
import { State } from '../states/entities/state.entity';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';


@Injectable()
export class DistrictService extends BaseService {
    constructor(
        @InjectRepository(District)
        private readonly districtRepo: Repository<District>,

        @InjectRepository(State)
        private readonly stateRepo: Repository<State>,
    ) {
        super();
    }

    async create(dto: CreateDistrictDto, adminId: number) {
        const state = await this.stateRepo.findOne({
            where: { id: dto.stateId },
        });

        if (!state) {
            throw new BadRequestException(MESSAGES.STATE_NOT_FOUND);
        }

        const exists = await this.districtRepo.findOne({
            where: {
                name: dto.name,
                state: {
                    id: dto.stateId,
                },
                trash: false,
            },
            relations: {
                state: true
            },
        });

        if (exists) {
            throw new BadRequestException('District already exists in this state');
        }

        const district = this.districtRepo.create({
            ...dto,
            createdBy: adminId,
            state: {
                id: state.id,
                name: state.name
            },
        });

        await this.districtRepo.save(district);
        return { message: MESSAGES.DISTRICT_CREATED };
    }

    async findAll(dto) {
        const { page, limit, search, pagination, status, stateId } = dto;

        const qb = this.districtRepo
            .createQueryBuilder('district')
            .leftJoinAndSelect('district.state', 'state')
            .where('district.trash = :trash', { trash: false });

        if (stateId) {
            const stateExists = await this.stateRepo.findOne({
                where: {
                    id: stateId,
                    trash: false,
                },
            });

            if (!stateExists) {
                throw new BadRequestException(MESSAGES.STATE_NOT_FOUND);
            }

            qb.andWhere('district.state_id = :stateId', { stateId });
        }

        if (typeof status === 'boolean') {
            qb.andWhere('district.status = :status', { status });
        }

        if (search && search.trim().length >= 3) {
            qb.andWhere('district.name LIKE :search', {
                search: `%${search.trim()}%`,
            });
        }
        if (pagination) {
            qb.orderBy('district.createdAt', 'DESC');
        } else {
            qb.orderBy('district.name', 'ASC');
        }
        const data = await this.paginate(qb, page, limit, pagination);
        return {
            ...data,
            message: MESSAGES.DISTRICT_FETCHED_SUCCESS
        }
    }



    async findOne(id: number) {
    const district = await this.districtRepo.findOne({
        where: { id, trash: false },
        relations: {
            state: true
        },
    });
    const state = await this.stateRepo.findOne({
        where: { id, trash: false },
    });

    if (!state) {
        throw new BadRequestException(MESSAGES.STATE_NOT_FOUND);
    }

    if (!district) {
        throw new BadRequestException(MESSAGES.DISTRICT_NOT_FOUND);
    }

    return district;
}

    async update(id: number, dto: UpdateDistrictDto, adminId: number) {
    const district = await this.findOne(id);
    if (dto.stateId) {
        const state = await this.stateRepo.findOne({
            where: { id: dto.stateId, trash: false, status: true },
        });

        if (!state) {
            throw new BadRequestException(MESSAGES.STATE_NOT_FOUND);
        }
    }
    Object.assign(district, dto);
    district.updatedBy = adminId;

    await this.districtRepo.save(district);
    return { message: MESSAGES.DISTRICT_UPDATED };
}

    async remove(id: number, adminId: number) {
    const district = await this.findOne(id);

    district.trash = true;
    district.updatedBy = adminId;

    await this.districtRepo.save(district);
    return { message: MESSAGES.DISTRICT_DELETED };
}


    async findActive(stateId: number) {
    const qb = this.districtRepo
        .createQueryBuilder('district')
        .leftJoinAndSelect('district.state', 'state')
        .where('district.trash = :trash', { trash: false })
        .andWhere('district.status = :status', { status: true })
        .andWhere('district.state_id = :stateId', { stateId })
        .orderBy('district.name', 'ASC');
    return this.paginate(qb);
}

}