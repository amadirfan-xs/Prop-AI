import { DynamicModule, Module } from '@nestjs/common';
import { databaseProviders } from '@/common/providers/database.providers';

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: DatabaseModule,
      providers: [...databaseProviders],
      exports: [...databaseProviders],
    };
  }
}
