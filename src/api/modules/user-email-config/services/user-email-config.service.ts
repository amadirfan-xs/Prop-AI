import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEmailConfigEntity } from '@/common/entities/email-config/user-email-config.entity';
import { EncryptionService } from '@/common/services/encryption.service';
import { USER_EMAIL_CONFIG_REPOSITORY } from '@/common/enums/repositories';
import { CreateEmailConfigDto, UpdateEmailConfigDto } from '../dto/email-config.dto';

@Injectable()
export class UserEmailConfigService {
  constructor(
    @Inject(USER_EMAIL_CONFIG_REPOSITORY)
    private readonly repository: Repository<UserEmailConfigEntity>,
    private readonly encryptionService: EncryptionService,
  ) {}

  async create(userId: number, dto: CreateEmailConfigDto) {
    const { encryptedData, iv } = this.encryptionService.encrypt(dto.appPassword);
    
    const config = this.repository.create({
      userId,
      appName: dto.appName,
      email: dto.email,
      encryptedAppPassword: encryptedData,
      iv,
      configType: dto.configType,
      host: dto.host,
      port: dto.port,
      secure: dto.secure,
    });
    
    return this.repository.save(config);
  }

  async findAll(userId: number) {
    const configs = await this.repository.find({ where: { userId } });
    // We don't return the passwords normally, or we decrypt them if needed.
    // For now, let's just return the list without decrypting the passwords for security.
    return configs.map(c => ({
      id: c.id,
      appName: c.appName,
      email: c.email,
      configType: c.configType,
      createdAt: c.createdAt,
    }));
  }

  async findOne(userId: number, id: number) {
    const config = await this.repository.findOne({ where: { id, userId } });
    if (!config) throw new NotFoundException('Configuration not found');
    return config;
  }

  async update(userId: number, id: number, dto: UpdateEmailConfigDto) {
    const config = await this.findOne(userId, id);
    
    if (dto.appName) config.appName = dto.appName;
    if (dto.email) config.email = dto.email;
    if (dto.configType) config.configType = dto.configType;
    if (dto.host !== undefined) config.host = dto.host;
    if (dto.port !== undefined) config.port = dto.port;
    if (dto.secure !== undefined) config.secure = dto.secure;

    if (dto.appPassword) {
      const { encryptedData, iv } = this.encryptionService.encrypt(dto.appPassword);
      config.encryptedAppPassword = encryptedData;
      config.iv = iv;
    }
    
    return this.repository.save(config);
  }

  async remove(userId: number, id: number) {
    const config = await this.findOne(userId, id);
    return this.repository.remove(config);
  }
}
