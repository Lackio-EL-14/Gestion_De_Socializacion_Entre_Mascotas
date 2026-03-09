import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Ignora datos extra que el usuario envíe y no estén en el DTO de create-usuario
      forbidNonWhitelisted: true, // validacion de errores extra
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
