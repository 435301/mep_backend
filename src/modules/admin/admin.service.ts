import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Admin } from './entities/admin.entity';
import { AdminLoginDto, ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto, VerifyOtpDto } from './dto/login.dto';
import { generateOtp } from 'src/common/utils/generate.otp';
import { MESSAGES } from 'src/common/constants/status.constants';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin)
        private readonly adminRepository: Repository<Admin>,
        private readonly jwtService: JwtService,
    ) { }

    async login(loginDto: AdminLoginDto) {
        const { email, password } = loginDto;
        const admin = await this.adminRepository.findOne({
            where: {
                email,
                status: true,
                trash: false,
            },
            relations: {
                role: true
            },
        });

        if (!admin) {
            throw new UnauthorizedException(MESSAGES.INVALID_CREDENTIALS);
        }
        const isPasswordMatched = await bcrypt.compare(
            password,
            admin.password,
        );

        if (!isPasswordMatched) {
            throw new UnauthorizedException(MESSAGES.INVALID_CREDENTIALS);
        }

        admin.lastLogin = new Date();
        await this.adminRepository.save(admin);

        const payload = {
            id: admin.id,
            email: admin.email,
            roleId: admin.role.id,
            // role: admin.role.roleName,
        };

        const accessToken = this.jwtService.sign(payload);
        return {
            success: true,
            message: MESSAGES.LOGIN_SUCCESS,
            accessToken,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                mobile: admin.mobile,
                role: {
                    id: admin.role.id,
                    roleName: admin.role.roleName,
                },
            }
        };
    }

    async forgotPassword(dto: ForgotPasswordDto) {
        const admin = await this.adminRepository.findOne({
            where: {
                email: dto.email,
                status: true,
                trash: false,
            },
        });
        if (!admin) {
            throw new NotFoundException(MESSAGES.ADMIN_NOTFOUND);
        }
        const otp = generateOtp();
        admin.otp = otp;
        admin.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await this.adminRepository.save(admin);

        // Send Email here

        return {
            success: true,
            message: MESSAGES.OTP_SENT_TO_MAIL,
            otp
        };
    }

    async verifyOtp(dto: VerifyOtpDto) {
        const admin = await this.adminRepository.findOne({
            where: {
                email: dto.email,
                status: true,
                trash: false,
            },
        });
        if (!admin) {
            throw new NotFoundException(MESSAGES.ADMIN_NOTFOUND);
        }
        if (!admin.otp) {
            throw new BadRequestException(MESSAGES.OTP_NOTFOUND);
        }
        if (admin.otp !== dto.otp) {
            throw new BadRequestException(MESSAGES.INVALID_OTP);
        }
        if (!admin.otpExpiry) {
            throw new BadRequestException(MESSAGES.OTP_EXPIRED);
        }
        if (admin.otpExpiry.getTime() < Date.now()) {
            throw new BadRequestException(MESSAGES.OTP_EXPIRED);
        }

        return {
            success: true,
            message: MESSAGES.OTP_VERIFY_SUCCESS,
        };
    }

    async resetPassword(dto: ResetPasswordDto) {
        const admin = await this.adminRepository.findOne({
            where: {
                email: dto.email,
                status: true,
                trash: false,
            },
        });
        if (!admin) {
            throw new NotFoundException(MESSAGES.ADMIN_NOTFOUND);
        }
        // Prevent using the same password
        const isSamePassword = await bcrypt.compare(dto.newPassword, admin.password);
        if (isSamePassword) {
            throw new BadRequestException(
                MESSAGES.NEW_OLD_PASSWORD,
            );
        }
        // Hash the new password
        const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
        admin.password = hashedPassword;
        // Clear OTP after successful reset
        admin.otp = null;
        admin.otpExpiry = null;
        await this.adminRepository.save(admin);
        return {
            success: true,
            message: MESSAGES.PASSWORD_RESET,
        };
    }

    async changePassword(
        adminId: number,
        dto: ChangePasswordDto,
    ) {
        const admin = await this.adminRepository.findOne({
            where: {
                id: adminId,
                status: true,
                trash: false,
            },
        });
        if (!admin) {
            throw new NotFoundException(MESSAGES.ADMIN_NOTFOUND);
        }
        // Verify current password
        const isPasswordMatched = await bcrypt.compare(
            dto.oldPassword,
            admin.password,
        );
        if (!isPasswordMatched) {
            throw new BadRequestException();
        }
        // Check new password and confirm password
        if (dto.newPassword !== dto.confirmPassword) {
            throw new BadRequestException(
                MESSAGES.CURRENT_PASSWORD_INCORRECT,
            );
        }
        // Prevent using the same password
        const isSamePassword = await bcrypt.compare(
            dto.newPassword,
            admin.password,
        );

        if (isSamePassword) {
            throw new BadRequestException(
                MESSAGES.NEW_OLD_PASSWORD,
            );
        }
        // Hash and update password
        admin.password = await bcrypt.hash(dto.newPassword, 10);
        await this.adminRepository.save(admin);
        return {
            success: true,
            message: MESSAGES.PASSWORD_CHANGED,
        };
    }
}