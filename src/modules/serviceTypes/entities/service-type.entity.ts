import { AuditEntity } from 'src/common/entity/base.entity';
import { ServiceCategory } from 'src/modules/serviceCategories/entities/service-category.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';

@Entity('service_type')
export class ServiceType extends AuditEntity {
    @PrimaryGeneratedColumn()
    id !: number;

    @Column({ name: 'service_type_title' })
    title !: string;

    @Column({ type: 'int', default: 0 })
    position !: number;

    @Column({ default: true })
    status !: boolean;

    @OneToMany(() => ServiceCategory, (service) => service.serviceType)
    serviceCategories !: ServiceCategory[];

}
