import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';;
import { ServiceType } from '../serviceTypes/entities/service-type.entity';
import { ServiceCategory } from '../serviceCategories/entities/service-category.entity';
import { ServiceSubCategory } from './entities/service-sub-category.entity';
import { ServiceSubCategoryController, ServiceSubCategoryFrontendController } from './service-sub-category.controller';
import { ServiceSubCategoryService } from './service-sub-category.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceSubCategory, ServiceCategory, ServiceType])],
  controllers: [ServiceSubCategoryController, ServiceSubCategoryFrontendController],
  providers: [ServiceSubCategoryService],
})
export class ServiceSubCategoryModule { }