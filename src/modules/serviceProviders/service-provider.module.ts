import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';;
import { ServiceType } from '../serviceTypes/entities/service-type.entity';
import { ServiceCategory } from '../serviceCategories/entities/service-category.entity';
import { ServiceSubCategory } from '../serviceSubCategory/entities/service-sub-category.entity';
import { State } from '../states/entities/state.entity';
import { District } from '../districts/entities/district.entity';
import { ServiceProvider } from './entities/service-provider.entity';
import { ServiceProviderController } from './service-provider.controller';
import { ServiceProviderService } from './service-provider.service';
import { Experience } from '../experience/entities/experience.entity';
import { Language } from '../languages/entities/language.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ServiceProvider, ServiceSubCategory, ServiceCategory, ServiceType, State, District, Experience, Language])],
    controllers: [ServiceProviderController],
    providers: [ServiceProviderService],
})
export class ServiceProviderModule { }