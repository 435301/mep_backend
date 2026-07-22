import { AuditEntity } from 'src/common/entity/base.entity';
import { ServiceType } from 'src/modules/serviceTypes/entities/service-type.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

@Entity('service_category')
export class ServiceCategory extends AuditEntity {
    @PrimaryGeneratedColumn()
    id !: number;

    @Column({ name: 'service_category_title' })
    title !: string;

    @Column({ nullable: true })
    icon !: string;

    @Column({ type: 'int', default: 0 })
    position !: number;

    @Column({ default: true })
    status !: boolean;

    @Column({ name: 'service_type_id' })
    serviceTypeId !: number;

    @ManyToOne(() => ServiceType, (service) => service.serviceCategories)
    @JoinColumn({ name: 'service_type_id' })
    serviceType !: ServiceType;
}
