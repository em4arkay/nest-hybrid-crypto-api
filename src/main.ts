import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // Import these

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- Add this code ---
  const config = new DocumentBuilder()
    .setTitle('API Service')
    .setDescription('API documentation for encryption/decryption service')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap().catch((err) => {
  console.error(err);
});
