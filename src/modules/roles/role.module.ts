import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RolesService } from './role.service';
import { RolesController } from './role.controller';
import { Admin } from '../admin/entities/admin.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Role, Admin])],
    providers: [RolesService],
    controllers: [RolesController],
    exports: [RolesService, TypeOrmModule],
})
export class RolesModule { }
