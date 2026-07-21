import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

import { State } from '../../states/entities/state.entity';
import { AuditEntity } from 'src/common/entity/base.entity';

@Entity('districts')
export class District extends AuditEntity {
  @PrimaryGeneratedColumn()
  id !: number;

  @Column()
  name !: string;

  @Column({ default: true })
  status !: boolean;

  @ManyToOne(() => State, (state) => state.districts)
  @JoinColumn({ name: 'state_id' })
  state !: State;

}