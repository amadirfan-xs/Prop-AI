import { SetMetadata } from '@nestjs/common';
import { REGISTER_PERMISSION } from '@/common/enums/repositories';

export const RegisterPermissions = (enabled = true) =>
  SetMetadata(REGISTER_PERMISSION, enabled);
