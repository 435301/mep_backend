import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './modules/roles/role.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from 'path';
import { AdminModule } from './modules/admin/admin.module';
import { StateModule } from './modules/states/states.module';
import { DistrictModule } from './modules/districts/districts.module';
import { ServiceTypeModule } from './modules/serviceTypes/service-type.module';
import { ServiceCategoryModule } from './modules/serviceCategories/service-category.module';
import { ServiceSubCategoryModule } from './modules/serviceSubCategory/service-sub-category.module';
import { VendorsModule } from './modules/vendor/vendor.module';
import { ServiceProviderModule } from './modules/serviceProviders/service-provider.module';
import { LanguageModule } from './modules/languages/entities/language.module';
import { ExperienceModule } from './modules/experience/experience.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    DatabaseModule,
    RolesModule,
    AdminModule,
    StateModule,
    DistrictModule,
    ServiceTypeModule,
    ServiceCategoryModule,
    ServiceSubCategoryModule,
    VendorsModule,
    ServiceProviderModule,
    LanguageModule,
    ExperienceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
