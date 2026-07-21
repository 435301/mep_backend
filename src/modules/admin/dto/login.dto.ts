import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from "class-validator";

export class AdminLoginDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        example: 'admin@bookmymep.com',
    })
    email!: string;

    @IsNotEmpty()
    @MinLength(6)
    @IsString()
    @ApiProperty({
        example: 'Admin@123',
    })
    password!: string;
}


export class ForgotPasswordDto {
    @IsEmail()
    @ApiProperty({
        example: 'admin@bookmymep.com',
    })
    email!: string;
}

export class VerifyOtpDto {
    @IsEmail()
    @ApiProperty({
        example: 'admin@bookmymep.com',
    })
    email!: string;

    @IsString()
    @IsNotEmpty()
    @Length(4, 6)
    @ApiProperty({
        example: '123456',
    })
    otp!: string;
}


export class ResetPasswordDto {

    @IsNotEmpty()
    @ApiProperty({
        example: 'admin@bookmymep.com',
    })
    email!: string;

    @IsNotEmpty()
    @ApiProperty({
        example: 'Admin@12345',
    })
    newPassword!: string;
}

export class ChangePasswordDto {
    @IsNotEmpty()
    @ApiProperty({
        example: 'Admin@12345',
    })
    oldPassword!: string;

    @IsNotEmpty()
    @ApiProperty({
        example: 'Admin@12345',
    })
    newPassword!: string;

    @IsNotEmpty()
    @ApiProperty({
        example: 'Admin@12345',
    })
    confirmPassword!: string;
}