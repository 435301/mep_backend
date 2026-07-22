import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceType } from './entities/service-type.entity';
import { ServiceTypeController, ServiceTypeFrontendController } from './service-type.controller';
import { ServiceTypeService } from './service-type.service';
import { ServiceCategory } from '../serviceCategories/entities/service-category.entity';


@Module({
  imports: [TypeOrmModule.forFeature([ServiceType, ServiceCategory])],
  controllers: [ServiceTypeController, ServiceTypeFrontendController],
  providers: [ServiceTypeService],
})
export class ServiceTypeModule { }