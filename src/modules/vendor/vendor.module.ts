import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';;
import { ServiceType } from '../serviceTypes/entities/service-type.entity';
import { ServiceCategory } from '../serviceCategories/entities/service-category.entity';
import { ServiceSubCategory } from '../serviceSubCategory/entities/service-sub-category.entity';
import { Vendor } from './entities/vendor.entity';
import { State } from '../states/entities/state.entity';
import { District } from '../districts/entities/district.entity';
import { VendorsController } from './vendor.controller';
import { VendorsService } from './vendor.service';


@Module({
  imports: [TypeOrmModule.forFeature([Vendor,ServiceSubCategory, ServiceCategory, ServiceType, State, District])],
  controllers: [VendorsController],
  providers: [VendorsService],
})
export class VendorsModule { }