import {
  Body,
  Controller,
  NotFoundException,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserAccountService } from '@/api/modules/user/services/user-account.service';
import { AccessTokenAuthGuard } from '@/common/guards/auth/auth.guard';
import { PermissionGuard } from '@/api/modules/permission/guards/permission.guard';
import { RegisterPermissions } from '@/api/decorators/register-permission.decorator';
import { AppwriteService } from '@/common/services/appwrite/appwrite.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@ApiTags('Profile')
@ApiBearerAuth('bearer')
@Controller('api/profile')
export class ProfileController {
  constructor(
    private readonly userAccountService: UserAccountService,
    private readonly appwriteService: AppwriteService,
  ) { }

  @ApiOperation({ summary: 'Update user profile details' })
  @Patch()
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  async updateProfile(
    @Req() request: { user: { id: number } },
    @Body() body: UpdateProfileDto,
  ) {
    const user = await this.userAccountService.findById(request.user.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (body.name) user.name = body.name;
    if (body.phoneNumber !== undefined) user.phoneNumber = body.phoneNumber;
    if (body.address !== undefined) user.address = body.address;
    if (body.calendlyUrl !== undefined) user.calendlyUrl = body.calendlyUrl;

    await this.userAccountService.save(user);
    return { success: true, data: user };
  }

  @ApiOperation({ summary: 'Upload profile picture' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @Post('avatar')
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Req() request: { user: { id: number } },
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = request.user.id;
    const user = await this.userAccountService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const fileExtension = file.originalname.split('.').pop();
    const key = `avatars/${userId}-${Date.now()}.${fileExtension}`;

    await this.appwriteService.uploadFile(file, key);
    const publicUrl = await this.appwriteService.getSignedURL(key);

    user.profilePictureUrl = key;
    await this.userAccountService.save(user);

    return { success: true, profilePictureUrl: publicUrl };
  }
}
