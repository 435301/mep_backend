import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Vendor } from './entities/vendor.entity';
import { CreateVendorDto } from './dto/create-vendor-dto';
import { UpdateVendorDto } from './dto/update-vendor-dto';
import { BaseService } from 'src/common/services/base.service';

@Injectable()
export class VendorsService extends BaseService {
    constructor(
        @InjectRepository(Vendor)
        private readonly vendorRepo: Repository<Vendor>,
    ) {
        super()
     }

    // Create Vendor
    async create(
        dto: CreateVendorDto,
        adminId: number,
        file?: Express.Multer.File,
    ) {
        const mobileExists = await this.vendorRepo.findOne({
            where: { mobileNumber: dto.mobileNumber },
        });

        if (mobileExists) {
            throw new BadRequestException('Mobile number already exists');
        }

        const emailExists = await this.vendorRepo.findOne({
            where: { email: dto.email },
        });

        if (emailExists) {
            throw new BadRequestException('Email already exists');
        }

        const vendor = this.vendorRepo.create({
            ...dto,
            profileImage: file ? file.filename : null,
            createdBy: adminId,
        });

        await this.vendorRepo.save(vendor);
        return {
            success: true,
            message: 'Vendor created successfully',
            data: vendor,
        };
    }


    async findAll(dto) {
        const { page, limit, search, pagination, status, serviceTypeId, serviceCategoryId, serviceSubCategoryId, stateId, districtId } = dto;

        const qb = this.vendorRepo
            .createQueryBuilder('vendor')
            .where('vendor.trash = :trash', { trash: false });

        if (typeof status === 'boolean') {
            qb.andWhere('vendor.status = :status', { status });
        }

        if (search && search.trim().length >= 3) {
            qb.andWhere('vendor.vendorName LIKE :search OR vendor.email LIKE :search OR vendor.mobileNumber LIKE :search', {
                search: `%${search.trim()}%`,
            });
        }
        if (serviceTypeId) {
            qb.andWhere('vendor.serviceTypeId = :serviceTypeId', { serviceTypeId });
        }
        if (serviceCategoryId) {
            qb.andWhere('vendor.serviceCategoryId = :serviceCategoryId', { serviceCategoryId });
        }
        if (serviceSubCategoryId) {
            qb.andWhere('vendor.serviceSubCategoryId = :serviceSubCategoryId', { serviceSubCategoryId });
        }
        if (stateId) {
            qb.andWhere('vendor.stateId = :stateId', { stateId });
        }
        if (districtId) {
            qb.andWhere('vendor.districtId = :districtId', { districtId });
        }
        if (pagination) {
            qb.orderBy('vendor.createdAt', 'DESC');
        } else {
            qb.orderBy('vendor.position', 'ASC');
        }
        return this.paginate(qb, page, limit, pagination,);

    }

    // Get Vendor By Id
    async findOne(id: number) {
        const vendor = await this.vendorRepo.findOne({
            where: {
                id,
                trash: false,
            },
            relations: {
                serviceType: true,
                serviceCategory: true,
                serviceSubCategory: true,
                state: true,
                district: true,
            },
        });

        if (!vendor) {
            throw new NotFoundException('Vendor not found');
        }

        return {
            success: true,
            data: vendor,
        };
    }

    // Update Vendor
    async update(
        id: number,
        dto: UpdateVendorDto,
        adminId: number,
        file?: Express.Multer.File,
    ) {
        const vendor = await this.vendorRepo.findOne({
            where: {
                id,
                trash: false,
            },
        });

        if (!vendor) {
            throw new NotFoundException('Vendor not found');
        }

        if (dto.mobileNumber) {
            const mobile = await this.vendorRepo.findOne({
                where: {
                    mobileNumber: dto.mobileNumber,
                },
            });

            if (mobile && mobile.id !== id) {
                throw new BadRequestException('Mobile already exists');
            }
        }

        if (dto.email) {
            const email = await this.vendorRepo.findOne({
                where: {
                    email: dto.email,
                },
            });

            if (email && email.id !== id) {
                throw new BadRequestException('Email already exists');
            }
        }

        Object.assign(vendor, dto);

        if (file) {
            vendor.profileImage = file.filename;
        }

        vendor.updatedBy = adminId;
        await this.vendorRepo.save(vendor);
        return {
            success: true,
            message: 'Vendor updated successfully',
            data: vendor,
        };
    }

    // Delete Vendor (Soft Delete)
    async remove(id: number, adminId: number) {
        const vendor = await this.vendorRepo.findOne({
            where: {
                id,
                trash: false,
            },
        });

        if (!vendor) {
            throw new NotFoundException('Vendor not found');
        }

        vendor.trash = true;
        vendor.updatedBy = adminId
        await this.vendorRepo.save(vendor);

        return {
            success: true,
            message: 'Vendor deleted successfully',
        };
    }

    // Change Status
    async changeStatus(id: number, status: boolean, userId: number) {
        const vendor = await this.vendorRepo.findOne({
            where: {
                id,
                trash: false,
            },
        });

        if (!vendor) {
            throw new NotFoundException('Vendor not found');
        }

        vendor.status = status;
        vendor.updatedBy = userId;

        await this.vendorRepo.save(vendor);

        return {
            success: true,
            message: 'Status updated successfully',
        };
    }
}