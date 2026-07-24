
import { AuditEntity } from 'src/common/entity/base.entity';
import { Admin } from 'src/modules/admin/entities/admin.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('language')
export class Language extends AuditEntity{
  @PrimaryGeneratedColumn()
  id !: number;

  @Column()
  language !: string;

}