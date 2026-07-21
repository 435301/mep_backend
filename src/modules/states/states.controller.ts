import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthGuard } from '@nestjs/passport';

import { StateService } from './states.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

import { JwtAuthGuard } from 'src/gaurds/jwt-auth.gaurd';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/gaurds/roles.guard';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { StateResponseDto } from './dto/response-dto';
import { StateListResponseDto } from './dto/state-list-response.dto';

@ApiTags('Admin - States')
@ApiBearerAuth('JWT-auth')
@Controller('admin/states')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(1)
export class StateController {
  constructor(private readonly stateService: StateService) { }

  @Post('create')
  @ApiBody({
    type: CreateStateDto,
  })
  @ApiCreatedResponse({
    description: 'State Created Successfully',
    type: StateResponseDto,
  })
  create(
    @Body() dto: CreateStateDto,
    @Req() req,
  ) {
    return this.stateService.create(dto, req.user.id);
  }

  @Post('list')
  @ApiBody({
    type: PaginationDto,
  })
  @ApiOkResponse({
    description: 'State List',
    type: StateListResponseDto,
  })
  findAll(
    @Body() dto: PaginationDto,
  ) {
    return this.stateService.findAll(dto);
  }

  @Get('getById/:id')
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiOkResponse({
    description: 'State Details',
    type: StateResponseDto,
  })
  findOne(
    @Param('id') id: number,
  ) {
    return this.stateService.findOne(+id);
  }

  @Put('update/:id')
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiBody({
    type: UpdateStateDto,
  })
  @ApiOkResponse({
    description: 'State Updated Successfully',
    type: StateResponseDto,
  })
  update(
    @Param('id') id: number,
    @Body() dto: UpdateStateDto,
    @Req() req,
  ) {
    return this.stateService.update(
      +id,
      dto,
      req.user.id,
    );
  }

  @Delete('delete/:id')
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiOkResponse({
    description: "State deleted successfully",
  })
  remove(
    @Param('id') id: number,
    @Req() req,
  ) {
    return this.stateService.remove(
      +id,
      req.user.id,
    );
  }
}

@ApiTags('User - States')
@ApiBearerAuth('JWT-auth')
@Controller('users/states')
@UseGuards(JwtAuthGuard)
export class StateFrontendController {
  constructor(
    private readonly service: StateService,
  ) { }

  @Get('list')
  @ApiOperation({
    summary: 'Get Active States',
  })
  @ApiResponse({
    status: 200,
    description: 'Active states fetched successfully.',
  })
  findActive() {
    return this.service.findActive();
  }
}