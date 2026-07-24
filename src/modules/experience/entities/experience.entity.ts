
import { AuditEntity } from 'src/common/entity/base.entity';
import { Admin } from 'src/modules/admin/entities/admin.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('experience')
export class Experience extends AuditEntity{
  @PrimaryGeneratedColumn()
  id !: number;

  @Column()
  experience !: number;

}