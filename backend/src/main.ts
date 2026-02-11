import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  // CORS is being enabled in order to allow Vite dev server at 5173 to fetch the API
  // Note: dev server needs to use "http://localhost:3000/api/positions" to work
  // While the build assets are able to just use "api/positions" with this setting on
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
