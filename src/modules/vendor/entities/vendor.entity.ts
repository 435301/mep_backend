import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { AuditEntity } from 'src/common/entity/base.entity';
import { ServiceType } from 'src/modules/serviceTypes/entities/service-type.entity';
import { ServiceCategory } from 'src/modules/serviceCategories/entities/service-category.entity';
import { State } from 'src/modules/states/entities/state.entity';
import { District } from 'src/modules/districts/entities/district.entity';
import { ServiceSubCategory } from 'src/modules/serviceSubCategory/entities/service-sub-category.entity';

export enum CommissionType {
  PERCENTAGE = 'PERCENTAGE',
  PRICE = 'PRICE',
}

@Entity('vendors')
export class Vendor extends AuditEntity {
  @PrimaryGeneratedColumn()
  id !: number;

  @Column({ name: 'vendor_name' })
  vendorName!: string;

  @Column({ name: 'mobile_number', unique: true })
  mobileNumber!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ name: 'profile_image', nullable: true })
  profileImage!: string | null;

  @Column({ name: 'service_type_id' })
  serviceTypeId!: number;

  @Column({ name: 'service_category_id' })
  serviceCategoryId!: number;

  @Column({ name: 'service_sub_category_id' })
  serviceSubCategoryId!: number;

  @Column({ name: 'pan_number' })
  panNumber!: string;

  @Column({ name: 'state_id' })
  stateId!: number;

  @Column({ name: 'district_id' })
  districtId!: number;

  @Column()
  location!: string;

  @Column()
  pincode!: string;

  @Column()
  address!: string;

  @Column({ name: 'account_holder_name' })
  accountHolderName!: string;

  @Column({ name: 'bank_name' })
  bankName!: string;

  @Column({ name: 'branch_name' })
  branchName!: string;

  @Column({ name: 'account_number' })
  accountNumber!: string;

  @Column({ name: 'ifsc_code' })
  ifscCode!: string;

  @Column({
    name: 'commission_type',
    type: 'enum',
    enum: CommissionType,
  })
  commissionType!: CommissionType;

  @Column({
    name: 'commission_value',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  commissionValue!: number;

  @Column({ default: true })
  status!: boolean;

  // Relations

  @ManyToOne(() => ServiceType)
  @JoinColumn({ name: 'service_type_id' })
  serviceType!: ServiceType;

  @ManyToOne(() => ServiceCategory)
  @JoinColumn({ name: 'service_category_id' })
  serviceCategory!: ServiceCategory;

  @ManyToOne(() => ServiceSubCategory)
  @JoinColumn({ name: 'service_sub_category_id' })
  serviceSubCategory!: ServiceSubCategory;

  @ManyToOne(() => State)
  @JoinColumn({ name: 'state_id' })
  state!: State;

  @ManyToOne(() => District)
  @JoinColumn({ name: 'district_id' })
  district!: District;
}