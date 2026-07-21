import { Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export abstract class AuditEntity {
    @Column({ type: 'int', nullable: true ,name: 'created_by'  })
    createdBy !: number;

    @Column({ nullable: true ,name: 'updated_by' })
    updatedBy !: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt !: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt !: Date;

    @Column({ default: false })
    trash !: boolean;
}
