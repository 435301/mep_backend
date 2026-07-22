import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceCategory } from './entities/service-category.entity';
import { ServiceCategoryController, ServiceCategoryFrontendController } from './service-category.controller';
import { ServiceCategoryService } from './service-category.service';
import { ServiceType } from '../serviceTypes/entities/service-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceCategory, ServiceType])],
  controllers: [ServiceCategoryController, ServiceCategoryFrontendController],
  providers: [ServiceCategoryService],
})
export class ServiceCategoryModule { }