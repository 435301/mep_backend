import { District } from 'src/modules/districts/entities/district.entity';
import { Experience } from 'src/modules/experience/entities/experience.entity';
import { Language } from 'src/modules/languages/entities/language.entity';
import { State } from 'src/modules/states/entities/state.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';


export enum RegisteredAs {
  VENDOR = 'VENDOR',
  INDIVIDUAL = 'INDIVIDUAL',
}

@Entity('service_providers')
export class ServiceProvider {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'enum',
    enum: RegisteredAs,
  })
  registeredAs!: RegisteredAs;

  @Column({ length: 60 })
  name!: string;

  @Column({ unique: true, length: 60 })
  email!: string;

  @Column({ unique: true, length: 10 })
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

  @Column({
    nullable: true,
  })
  profileImage!: string;

  @Column({
    nullable: true,
  })
  experienceId!: number;

  @ManyToOne(() => Experience)
  @JoinColumn({ name: 'experienceId' })
  experience!: Experience;

  @Column({
    nullable: true,
  })
  languageId!: number;

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'languageId' })
  language!: Language;

  @Column({
    default: true,
  })
  serviceAvailable!: boolean;

  @Column()
  districtId!: number;

  @ManyToOne(() => District)
  @JoinColumn({ name: 'districtId' })
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

  @Column({
    default: true,
  })
  status!: boolean;

  @Column({
    default: false,
  })
  trash!: boolean;

  @Column({
    nullable: true,
  })
  createdBy!: number;

  @Column({
    nullable: true,
  })
  updatedBy!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}