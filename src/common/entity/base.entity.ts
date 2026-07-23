import { Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from 'class-transformer';

export abstract class AuditEntity {
    @Exclude()
    @Column({ type: 'int', nullable: true, name: 'created_by' })
    createdBy !: number;

    @Exclude()
    @Column({ nullable: true, name: 'updated_by' })
    updatedBy !: number;

    @Exclude()
    @CreateDateColumn({ name: 'created_at' })
    createdAt !: Date;

    @Exclude()
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt !: Date;

    @Exclude()
    @Column({ default: false })
    trash !: boolean;
}
