
import { Admin } from 'src/modules/admin/entities/admin.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id !: number;

  @Column({
    unique: true,
    length: 50,
    name: "role_name"
  })
  roleName !: string;

  @Column({
    nullable: true,

    length: 255,
  })
  description !: string;

  @Column({
    default: true,
  })
  status !: boolean;

  @CreateDateColumn({name: 'created_at'})
  createdAt !: Date;

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt !: Date;
  
  @OneToMany(() => Admin, (admin) => admin.role)
  admins !: Admin[];

}