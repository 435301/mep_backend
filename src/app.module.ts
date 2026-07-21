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

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
