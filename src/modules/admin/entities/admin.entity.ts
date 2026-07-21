
import { Role } from "src/modules/roles/entities/role.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('admins')
export class Admin {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'admin_name' })
    name!: string;

    @Column({ unique: true, nullable: false, name: 'admin_email' })
    email!: string;

    @Column({ unique: true, nullable: false, name: 'admin_mobile' })
    mobile!: string;

    @Column({ name: 'admin_password' })
    password!: string;

    @Column({ nullable: true, name: 'ip_address' })
    ipAddress!: string;

    @Column({ type: 'timestamp', nullable: true, name: 'last_login' })
    lastLogin!: Date;

    @Column({ type: 'varchar', length: 6, nullable: true, name: 'otp' })
    otp!: string | null;

    @Column({ type: 'timestamp', nullable: true, name: 'otp_expiry' })
    otpExpiry!: Date | null;

    @Column({ default: true })
    status!: boolean;

    @ManyToOne(() => Role, (role) => role.admins)
    @JoinColumn({ name: 'role_id' })
    role !: Role;

    @Column({ nullable: true, name: 'created_by' })
    createdBy!: number;

    @Column({ nullable: true, name: 'updated_by' })
    updatedBy!: number;

    @Column()
    trash !: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

}