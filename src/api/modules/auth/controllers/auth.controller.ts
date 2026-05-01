import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from '@/api/modules/auth/services/auth.service';
import { ChangePasswordDto } from '@/api/modules/auth/dto/change-password.dto';
import { ChangeTempPasswordDto } from '@/api/modules/auth/dto/change-temp-password.dto';
import { ForgetPasswordDataDTO } from '@/api/modules/auth/dto/forget-password.dto';
import { LoginDto } from '@/api/modules/auth/dto/login.dto';
import { NewPasswordDTO } from '@/api/modules/auth/dto/new-password.dto';
import { ResendPINDTO } from '@/api/modules/auth/dto/resend-pin.dto';
import { SignUpDto } from '@/api/modules/auth/dto/signup.dto';
import { VerifyPINDTO } from '@/api/modules/auth/dto/verify-pin.dto';
import { UpdatePrimaryRoleDto } from '@/api/modules/auth/dto/update-primary-role.dto';
import { AccessTokenAuthGuard } from '@/common/guards/auth/auth.guard';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({ summary: 'Create user account' })
  @ApiBody({ type: SignUpDto })
  @ApiOkResponse({ description: 'Account created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request payload' })
  @ApiConflictResponse({ description: 'Email already exists' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error' })
  @Post('signup')
  async signUp(
    @Body() body: SignUpDto,
  ): Promise<{ success: true }> {
    return this.authService.signUp(body);
  }

  @ApiOperation({ summary: 'Logout user and clear auth cookie' })
  @ApiOkResponse({ description: 'Logout successful' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error' })
  @Post('logout')
  logout(@Req() request: any): { success: true } {
    const response = request.res;
    response.clearCookie('auth_token');
    return { success: true };
  }

  @ApiOperation({ summary: 'Authenticate user and return access token' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'Login successful' })
  @ApiBadRequestResponse({ description: 'Invalid request payload' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error' })
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Req() request: any,
  ): Promise<{ accessToken: string; isTempPasswordUsed: boolean }> {
    const response = request.res;
    const result = await this.authService.login(body);
    response.cookie('auth_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return result;
  }

  @ApiOperation({ summary: 'Generate/reset password PIN and send by email' })
  @ApiBody({ type: ForgetPasswordDataDTO })
  @ApiOkResponse({ description: 'Reset PIN generated or reused successfully' })
  @ApiBadRequestResponse({ description: 'Invalid email or request payload' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error' })
  @Post('forget-password')
  forgetPassword(
    @Body() body: ForgetPasswordDataDTO,
  ): Promise<{ success: true; expirationDate: Date }> {
    return this.authService.forgetPassword(body);
  }

  @ApiOperation({ summary: 'Verify reset PIN' })
  @ApiBody({ type: VerifyPINDTO })
  @ApiOkResponse({ description: 'PIN verification successful' })
  @ApiBadRequestResponse({ description: 'Invalid, incorrect, or expired PIN' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error' })
  @Post('verify-pin')
  verifyPIN(@Body() body: VerifyPINDTO): Promise<{ success: true }> {
    return this.authService.verifyPIN(body);
  }

  @ApiOperation({ summary: 'Set new password using reset PIN' })
  @ApiBody({ type: NewPasswordDTO })
  @ApiOkResponse({ description: 'Password updated successfully' })
  @ApiBadRequestResponse({
    description: 'Invalid payload, invalid PIN, or password policy violation',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error' })
  @Post('new-password')
  newPassword(@Body() body: NewPasswordDTO): Promise<{ success: true }> {
    return this.authService.newPassword(body);
  }

  @ApiOperation({ summary: 'Resend reset PIN for supported type' })
  @ApiBody({ type: ResendPINDTO })
  @ApiOkResponse({ description: 'Reset PIN resent successfully' })
  @ApiBadRequestResponse({
    description: 'Unsupported type or PIN still active',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error' })
  @Post('resend-pin')
  resendPIN(
    @Body() body: ResendPINDTO,
  ): Promise<{ success: true; expirationDate: Date }> {
    return this.authService.resendPIN(null, body);
  }

  @ApiOperation({ summary: 'Change password after temp-password login' })
  @ApiBody({ type: ChangeTempPasswordDto })
  @ApiOkResponse({ description: 'Password changed successfully' })
  @ApiBadRequestResponse({
    description: 'Invalid payload or password mismatch',
  })
  @ApiBearerAuth('bearer')
  @ApiUnauthorizedResponse({ description: 'Invalid or missing access token' })
  @ApiForbiddenResponse({
    description: 'Only invited users can access this endpoint',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error' })
  @Post('change-temp-password')
  @UseGuards(AccessTokenAuthGuard)
  changeTempPassword(
    @Req()
    request: {
      user?: {
        id?: number;
      };
    },
    @Body() body: ChangeTempPasswordDto,
  ): Promise<{ success: true }> {
    return this.authService.changeTempPassword(Number(request.user?.id), body);
  }

  @ApiOperation({ summary: 'Change password for authenticated user' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiOkResponse({ description: 'Password changed successfully' })
  @ApiBadRequestResponse({
    description: 'Invalid payload or password mismatch',
  })
  @ApiBearerAuth('bearer')
  @ApiUnauthorizedResponse({ description: 'Invalid or missing access token' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error' })
  @Post('change-password')
  @UseGuards(AccessTokenAuthGuard)
  changePassword(
    @Req()
    request: {
      user?: {
        id?: number;
      };
    },
    @Body() body: ChangePasswordDto,
  ): Promise<{ success: true }> {
    return this.authService.changePassword(Number(request.user?.id), body);
  }

  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({ description: 'Profile retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing access token' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error' })
  @UseGuards(AccessTokenAuthGuard)
  @Post('me')
  getMe(
    @Req()
    request: {
      user?: {
        id?: number;
      };
    },
  ) {
    return this.authService.getMe(Number(request.user?.id));
  }

  @ApiOperation({ summary: 'Update primary role for authenticated user' })
  @ApiBody({ type: UpdatePrimaryRoleDto })
  @ApiOkResponse({ description: 'Primary role updated successfully' })
  @ApiBadRequestResponse({ description: 'User does not have this role assigned' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error' })
  @Patch('profile/primary-role')
  @UseGuards(AccessTokenAuthGuard)
  updatePrimaryRole(
    @Req()
    request: {
      user?: {
        id?: number;
      };
    },
    @Body() body: UpdatePrimaryRoleDto,
  ): Promise<{ success: true }> {
    return this.authService.updatePrimaryRole(
      Number(request.user?.id),
      body.userTypeId,
    );
  }
}
