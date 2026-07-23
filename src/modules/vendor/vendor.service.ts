import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Vendor } from './entities/vendor.entity';
import { CreateVendorDto } from './dto/create-vendor-dto';
import { UpdateVendorDto } from './dto/update-vendor-dto';
import { BaseService } from 'src/common/services/base.service';
import { MESSAGES } from 'src/common/constants/status.constants';
import { FileUrlHelper } from 'src/common/utils/file-url.helper';
import { ServiceType } from '../serviceTypes/entities/service-type.entity';
import { ServiceCategory } from '../serviceCategories/entities/service-category.entity';
import { ServiceSubCategory } from '../serviceSubCategory/entities/service-sub-category.entity';
import { State } from '../states/entities/state.entity';
import { District } from '../districts/entities/district.entity';

@Injectable()
export class VendorsService extends BaseService {
    constructor(
        @InjectRepository(Vendor)
        private readonly vendorRepo: Repository<Vendor>,
        @InjectRepository(ServiceType)
        private readonly serviceTypeRepo: Repository<ServiceType>,
        @InjectRepository(ServiceCategory)
        private readonly serviceCategoryRepo: Repository<ServiceCategory>,
        @InjectRepository(ServiceSubCategory)
        private readonly serviceSubCategoryRepo: Repository<ServiceSubCategory>,
        @InjectRepository(State)
        private readonly stateRepo: Repository<State>,
        @InjectRepository(District)
        private readonly districtRepo: Repository<District>,

    ) {
        super()
    }

    // Create Vendor
    async create(
        dto: CreateVendorDto,
        adminId: number,
        file?: Express.Multer.File,
    ) {
        console.log('dto', dto)
        const mobileExists = await this.vendorRepo.findOne({
            where: { mobileNumber: dto.mobileNumber },
        });

        if (mobileExists) {
            throw new BadRequestException(MESSAGES.MOBILE_NUMBER_EXISTS);
        }

        const emailExists = await this.vendorRepo.findOne({
            where: { email: dto.email },
        });

        if (emailExists) {
            throw new BadRequestException(MESSAGES.EMAIL_EXISTS);
        }
        // Validate Service Type
        const serviceType = await this.serviceTypeRepo.findOne({
            where: {
                id: dto.serviceTypeId,
                trash: false,
            },
        });

        if (!serviceType) {
            throw new BadRequestException(MESSAGES.SERVICE_TYPE_NOT_FOUND);
        }

        // Validate Service Category belongs to Service Type
        const category = await this.serviceCategoryRepo.findOne({
            where: {
                id: dto.serviceCategoryId,
                serviceTypeId: dto.serviceTypeId,
                trash: false,
            },
        });

        if (!category) {
            throw new BadRequestException(
                'Selected Service Category does not belong to the selected Service Type.',
            );
        }

        // Validate all selected Sub Categories belong to the selected Category
        const subCategories = await this.serviceSubCategoryRepo.find({
            where: {
                id: In(dto.serviceSubCategoryIds),
                serviceCategoryId: dto.serviceCategoryId,
                trash: false,
            },
        });

        // Ensure all selected ids are valid
        if (subCategories.length !== dto.serviceSubCategoryIds.length) {
            throw new BadRequestException(
                'One or more Service Sub Categories are invalid or do not belong to the selected Service Category.',
            );
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
        const pan = await this.vendorRepo.findOne({
            where: {
                panNumber: dto.panNumber,
            },
        });

        if (pan) {
            throw new BadRequestException(MESSAGES.PAN_EXISTS);
        }
        const account = await this.vendorRepo.findOne({
            where: {
                accountNumber: dto.accountNumber,
            },
        });

        if (account) {
            throw new BadRequestException(MESSAGES.ACCOUNT_EXISTS);
        }
        if (!file) {
            throw new BadRequestException(MESSAGES.PROFILE_IMAGE_REQUIRED
            );
        }
        const iconPath = `vendors/${file.filename}`;
        const vendor = this.vendorRepo.create({
            vendorName: dto.vendorName,
            mobileNumber: dto.mobileNumber,
            email: dto.email,
            icon: iconPath,
            panNumber: dto.panNumber,
            districtId: dto.districtId,
            location: dto.location,
            pincode: dto.pincode,
            address: dto.address,
            accountHolderName: dto.accountHolderName,
            bankName: dto.bankName,
            branchName: dto.branchName,
            accountNumber: dto.accountNumber,
            ifscCode: dto.ifscCode,
            commissionType: dto.commissionType,
            commissionValue: dto.commissionValue,
            status: dto.status,
            createdBy: adminId,
        });

        vendor.serviceSubCategories = subCategories;
        try {
            await this.vendorRepo.save(vendor);
        } catch (error) {
            console.error(error);
            throw error;
        }
        return {
            message: MESSAGES.VENDOR_CREATED,
        }
    }


    async findAll(dto) {
        const { page, limit, search, pagination, status, serviceTypeId, serviceCategoryId, serviceSubCategoryId, stateId, districtId } = dto;

        const qb = this.vendorRepo
            .createQueryBuilder('vendor')
            .leftJoinAndSelect('vendor.serviceSubCategories', 'serviceSubCategory')
            .leftJoinAndSelect('serviceSubCategory.serviceCategory', 'serviceCategory')
            .leftJoinAndSelect('serviceCategory.serviceType', 'serviceType')
            .leftJoinAndSelect('vendor.district', 'district')
            .leftJoinAndSelect('district.state', 'state')
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
            qb.andWhere('serviceType.id = :serviceTypeId', { serviceTypeId, });
        }

        if (serviceCategoryId) {
            qb.andWhere('serviceCategory.id = :serviceCategoryId', { serviceCategoryId, });
        }

        if (serviceSubCategoryId?.length) {

            qb.andWhere(
                'serviceSubCategory.id IN (:...serviceSubCategoryIds)',
                {
                    serviceSubCategoryId,
                },
            );
        }
        if (stateId) {
            qb.andWhere('state.id = :stateId', { stateId, });
        }

        if (districtId) {
            qb.andWhere('vendor.districtId = :districtId', { districtId });
        }
        if (pagination) {
            qb.orderBy('vendor.createdAt', 'DESC');
        } else {
            qb.orderBy('vendor.position', 'ASC');
        }
        const data = await this.paginate(qb, page, limit, pagination,);
        data.data = FileUrlHelper.mapArray(data.data);
        return {
            ...data,
            message: MESSAGES.VENDOR_FETCHED_SUCCESS
        }

    }

    // Get Vendor By Id
    async findOne(id: number) {
        const vendor = await this.vendorRepo.findOne({
            where: {
                id,
                trash: false,
            },
            relations: {
                serviceSubCategories: {
                    serviceCategory: {
                        serviceType: true
                    }
                },
                district: {
                    state: true,
                },
            },
        });

        if (!vendor) {
            throw new NotFoundException(MESSAGES.VENDOR_NOT_FOUND);
        }

        return {
            data: vendor,
            message: MESSAGES.VENDOR_FETCHED_SUCCESS
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
            throw new NotFoundException(MESSAGES.VENDOR_NOT_FOUND);
        }

        if (dto.mobileNumber) {
            const mobile = await this.vendorRepo.findOne({
                where: {
                    mobileNumber: dto.mobileNumber,
                },
            });

            if (mobile && mobile.id !== id) {
                throw new BadRequestException(MESSAGES.MOBILE_NUMBER_EXISTS);
            }
        }

        if (dto.email) {
            const email = await this.vendorRepo.findOne({
                where: {
                    email: dto.email,
                },
            });

            if (email && email.id !== id) {
                throw new BadRequestException(MESSAGES.EMAIL_EXISTS);
            }
        }
        if (dto.serviceSubCategoryIds?.length) {

            const subCategories = await this.serviceSubCategoryRepo.find({
                where: {
                    id: In(dto.serviceSubCategoryIds),
                    trash: false,
                },
            });

            if (subCategories.length !== dto.serviceSubCategoryIds.length) {
                throw new BadRequestException(
                    MESSAGES.SERVICE_SUB_CATEGORY_NOT_FOUND,
                );
            }

            vendor.serviceSubCategories = subCategories;
        }

        Object.assign(vendor, dto);

        if (file) {
            vendor.icon = file.filename;
        }

        vendor.updatedBy = adminId;
        await this.vendorRepo.save(vendor);
        return {
            message: MESSAGES.VENDOR_UPDATED,
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
            throw new NotFoundException(MESSAGES.VENDOR_NOT_FOUND);
        }

        vendor.trash = true;
        vendor.updatedBy = adminId
        await this.vendorRepo.save(vendor);

        return {
            message: MESSAGES.VENDOR_DELETED,
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
            throw new NotFoundException(MESSAGES.VENDOR_NOT_FOUND);
        }

        vendor.status = status;
        vendor.updatedBy = userId;

        await this.vendorRepo.save(vendor);

        return {
            success: true,
            message: MESSAGES.STATUS_SUCCESS,
        };
    }
}