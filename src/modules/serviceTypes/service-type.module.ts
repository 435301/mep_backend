import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceType } from './entities/service-type.entity';
import { ServiceTypeController, ServiceTypeFrontendController } from './serviceon-type.controller';
import { ServiceTypeService } from './service-type.service';


@Module({
  imports: [TypeOrmModule.forFeature([ServiceType])],
  controllers: [ServiceTypeController, ServiceTypeFrontendController],
  providers: [ServiceTypeService],
})
export class ServiceTypeModule { }