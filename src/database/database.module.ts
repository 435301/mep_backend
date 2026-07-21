import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';
import { Role } from 'src/modules/roles/entities/role.entity';
import { Admin } from 'src/modules/admin/entities/admin.entity';


@Module({
  imports: [
     TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
       entities: [Admin, Role],
    }),
  ],
})
export class DatabaseModule {}
