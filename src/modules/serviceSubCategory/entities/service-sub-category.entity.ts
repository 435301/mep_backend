import { AuditEntity } from 'src/common/entity/base.entity';
import { ServiceCategory } from 'src/modules/serviceCategories/entities/service-category.entity';
import { ServiceType } from 'src/modules/serviceTypes/entities/service-type.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

@Entity('service_sub_category')
export class ServiceSubCategory extends AuditEntity {
    @PrimaryGeneratedColumn()
    id !: number;

    @Column({ name: 'service_sub_category_title' })
    title !: string;

    @Column({ nullable: true })
    icon !: string;

    @Column({ type: 'int', default: 0 })
    position !: number;

    @Column({ default: true })
    status !: boolean;

    @Column({ name: 'service_category_id' })
    serviceCategoryId !: number;

    @ManyToOne(() => ServiceCategory, (service) => service.serviceSubCategories)
    @JoinColumn({ name: 'service_category_id' })
    serviceCategory !: ServiceCategory;
}
