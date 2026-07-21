import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AdminService } from './admin.service';
import {
  AdminLoginDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyOtpDto,
} from './dto/login.dto';

import { JwtAuthGuard } from 'src/gaurds/jwt-auth.gaurd';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('Admin Authentication')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Admin Login',
    description: 'Login using email and password.',
  })
  @ApiBody({ type: AdminLoginDto })
  login(@Body() dto: AdminLoginDto) {
    return this.adminService.login(dto);
  }

  @Post('forgot-password')
  @ApiBody({ type: ForgotPasswordDto })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.adminService.forgotPassword(dto);
  }

  @Post('verify-otp')
  @ApiBody({ type: VerifyOtpDto })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.adminService.verifyOtp(dto);
  }

  @Post('reset-password')
  @ApiBody({ type: ResetPasswordDto })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.adminService.resetPassword(dto);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: ChangePasswordDto })
  changePassword(
    @CurrentUser() user: any,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.adminService.changePassword(user.id, dto);
  }
}