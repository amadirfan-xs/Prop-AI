import { Module } from '@nestjs/common';
import { AuthModule } from '@/api/modules/auth/auth.module';
import { OrganizationController } from '@/api/modules/organization/controllers/organization.controller';
import { OrganizationService } from '@/api/modules/organization/services/organization.service';
import { OrganizationRepository } from '@/api/modules/organization/repositories/organization.repository';
import { organizationProviders } from '@/common/providers/organization.providers';
import { UserModule } from '@/api/modules/user/user.module';
import { MailModule } from '@/api/modules/infrastructure/mail.module';
import { PricingModule } from '@/api/modules/pricing/pricing.module';
import { PropertyModule } from '@/api/modules/property/property.module';

import { PermissionModule } from '@/api/modules/permission/permission.module';

@Module({
  imports: [AuthModule, PermissionModule, UserModule, MailModule, PricingModule, PropertyModule],
  controllers: [OrganizationController],
  providers: [
    ...organizationProviders,
    OrganizationService,
    OrganizationRepository,
  ],
  exports: [OrganizationService],
})
export class OrganizationModule {}
