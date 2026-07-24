import { AuditEntity } from 'src/common/entity/base.entity';
import { District } from 'src/modules/districts/entities/district.entity';
import { Experience } from 'src/modules/experience/entities/experience.entity';
import { Language } from 'src/modules/languages/entities/language.entity';
import { ServiceSubCategory } from 'src/modules/serviceSubCategory/entities/service-sub-category.entity';
import { State } from 'src/modules/states/entities/state.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';


export enum RegisteredAs {
  VENDOR = 'VENDOR',
  INDIVIDUAL = 'INDIVIDUAL',
}

@Entity('service_providers')
export class ServiceProvider extends AuditEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'enum',
    enum: RegisteredAs,
    name: 'registered_as'
  })
  registeredAs!: RegisteredAs;

  @Column({ length: 60 })
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
  mobile!: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  dob!: Date;

  @Column({
    nullable: true,
  })
  age!: number;

  @Column({ nullable: true, name: 'profile_image' })
  icon !: string;

  @Column({
    nullable: true, name: 'experience_id'
  })
  experienceId!: number;

  @ManyToOne(() => Experience)
  @JoinColumn({ name: 'experience_id' })
  experience!: Experience;

  @Column({
    nullable: true, name: 'language_id'
  })
  languageId!: number;

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'language_id' })
  language!: Language;

  @Column({
    default: true, name: 'service_available'
  })
  serviceAvailable!: boolean;

  @Column({ name: 'district_id' })
  districtId!: number;

  @ManyToOne(() => District)
  @JoinColumn({ name: 'district_id' })
  district!: District;

  @Column({
    length: 100,
  })
  city!: string;

  @Column({
    nullable: true,
    length: 255,
  })
  location!: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 8,
    nullable: true,
  })
  latitude!: number;

  @Column({
    type: 'decimal',
    precision: 11,
    scale: 8,
    nullable: true,
  })
  longitude!: number;

  @Column({
    length: 10,
  })
  pincode!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  address!: string;

  @ManyToMany(
    () => ServiceSubCategory,
    (subCategory) => subCategory.serviceProviders,
  )
  @JoinTable({
    name: 'service_provider_sub_categories',
    joinColumn: {
      name: 'service_provider_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'service_sub_category_id',
      referencedColumnName: 'id',
    },
  })
  serviceSubCategories!: ServiceSubCategory[];

  @Column({ default: true })
  status!: boolean;
}