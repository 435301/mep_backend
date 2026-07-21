import { AuditEntity } from 'src/common/entity/base.entity';
import { District } from 'src/modules/districts/entities/district.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('states')
export class State extends AuditEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ default: true })
  status!: boolean;

  //  One State → Many districts
  @OneToMany(() => District, (district) => district.state)
  districts!: District[];



}
