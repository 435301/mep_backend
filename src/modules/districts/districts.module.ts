import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { District } from './entities/district.entity';
import { State } from '../states/entities/state.entity';
import { DistrictController, DistrictFrontendController } from './districts.controller';
import { DistrictService } from './districts.service';

@Module({
  imports: [TypeOrmModule.forFeature([District, State])],
  controllers: [DistrictController, DistrictFrontendController],
  providers: [DistrictService],
})
export class DistrictModule {}
