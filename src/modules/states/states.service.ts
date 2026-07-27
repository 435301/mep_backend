import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { State } from './entities/state.entity';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { MESSAGES } from 'src/common/constants/status.constants';
import { BaseService } from 'src/common/services/base.service';
import { BulkStatusDto } from 'src/common/dto/bulk.dto';
import { BulkStatusHelper } from 'src/common/services/bulk.service';

@Injectable()
export class StateService extends BaseService {
    constructor(
        @InjectRepository(State)
        private stateRepo: Repository<State>,
    ) {
        super();
    }

    async create(dto: CreateStateDto, adminId: number) {
        console.log(dto);
        const exists = await this.stateRepo.findOne({
            where: { name: dto.name, trash: false },
        });

        if (exists) {
            throw new BadRequestException(MESSAGES.STATE_ALREADY_EXISTS);
        }

        const state = this.stateRepo.create({
            ...dto,
            createdBy: adminId,
        });

        await this.stateRepo.save(state);
        return { message: MESSAGES.STATE_CREATED };
    }

    async findAll(dto) {
        const { page, limit, search, pagination, status } = dto;

        const qb = this.stateRepo
            .createQueryBuilder('state')
            .where('state.trash = :trash', { trash: false });

        if (typeof status === 'boolean') {
            qb.andWhere('state.status = :status', { status });
        }

        if (search && search.trim().length >= 3) {
            qb.andWhere('state.name LIKE :search', {
                search: `%${search.trim()}%`,
            });
        }
        if (pagination) {
            qb.orderBy('state.createdAt', 'DESC');
        } else {
            qb.orderBy('state.name', 'ASC');
        }
        const data = await this.paginate(qb, page, limit, pagination);
        console.log(data);
        return {
            ...data,
            message: MESSAGES.STATE_FETCHED_SUCCESS
        }
    }


    async findOne(id: number) {
        const state = await this.stateRepo.findOne({
            where: { id, trash: false },
        });

        if (!state) {
            throw new BadRequestException(MESSAGES.STATE_NOT_FOUND);
        }

        return state;
    }

    async update(id: number, dto: UpdateStateDto, adminId: number) {
        const state = await this.findOne(id);
        if (dto.name) {
            const existingState = await this.stateRepo.findOne({
                where: {
                    name: dto.name,
                    trash: false,
                    id: Not(id),
                },
            });

            if (existingState) {
                throw new BadRequestException(MESSAGES.STATE_ALREADY_EXISTS);
            }
        }
        Object.assign(state, dto);
        state.updatedBy = adminId;

        await this.stateRepo.save(state);
        return { message: MESSAGES.STATE_UPDATED };
    }

    async remove(id: number, adminId: number) {
        const state = await this.findOne(id);

        state.trash = true;
        state.updatedBy = adminId;

        await this.stateRepo.save(state);
        return { message: MESSAGES.STATE_DELETED };
    }

    async bulkStatus(dto: BulkStatusDto, adminId: number) {
        return BulkStatusHelper.updateStatus(
            this.stateRepo,
            dto.ids,
            dto.status,
            adminId,
        );
    }

    async findActive() {
        const qb = this.stateRepo
            .createQueryBuilder('state')
            .where('state.trash = :trash', { trash: false });
        qb.andWhere('state.status = :status', { status: true });
        return this.paginate(qb);
    }
}

