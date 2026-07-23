import { BadRequestException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { MESSAGES } from '../constants/status.constants';

export class BulkStatusHelper {
    static async updateStatus(
        repo: Repository<any>,
        ids: number[],
        status: boolean,
        adminId: number,
    ) {
        if (!ids || ids.length === 0) {
            throw new BadRequestException(MESSAGES.PLEASE_SELECT_RECORDS);
        }

        const records = await repo.find({
            where: {
                id: In(ids),
                trash: false,
            },
            select: {
                id: true,
            },
        });

        if (records.length === 0) {
            throw new BadRequestException(MESSAGES.NO_VALID_RECORDS_FOUND);
        }

        const data = await repo
            .createQueryBuilder()
            .update()
            .set({
                status,
                updatedBy: adminId,
            })
            .whereInIds(records.map((r) => r.id))
            .andWhere('trash = :trash', { trash: false })
            .execute();

        return {
            success: true,
            affected: data.affected,
            message: `Successfully ${status ? 'activated' : 'deactivated'
                } ${data.affected} record(s).`,
        };
    }
}