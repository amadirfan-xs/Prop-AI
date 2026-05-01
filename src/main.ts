import { config } from 'dotenv';

function getEnvFile(): string {
  const env = process.env.NODE_ENV || '';
  let envFile = '.env';
  if (env !== '') {
    envFile = `.env.${env.trim()}`;
  }
  return envFile;
}

config({ path: getEnvFile() });

import bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '@/app.module';
import { loadUrlProfileIntoEnv } from '@/common/config/url-profiles/url-profile.loader';
import { ErrorFilter } from '@/common/interceptors/error.filter';
import { LoggerInterceptor } from '@/common/interceptors/logger/logger.interceptor';
import { SuccessResponseInterceptor } from '@/common/interceptors/success-response.interceptor';
import cookieParser from 'cookie-parser';

loadUrlProfileIntoEnv();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new ErrorFilter());
  app.useGlobalInterceptors(
    new LoggerInterceptor(),
    new SuccessResponseInterceptor(),
  );

  app.use(cookieParser());
  app.enableCors({ origin: true, credentials: true });

  const apiDoc = new DocumentBuilder()
    .setTitle('API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'JWT from POST /api/auth/login or /api/auth/signup. Click Authorize once; Swagger sends Authorization: Bearer <token> on each request. The access-token header is also accepted.',
      },
      'bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, apiDoc);
  SwaggerModule.setup('/api', app, document);

  await app.listen(Number(process.env.PORT ?? 3000));
}
void bootstrap();
