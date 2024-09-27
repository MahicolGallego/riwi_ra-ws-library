import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  app.setGlobalPrefix('api/v1');

  // use pipe for data validation of request and data transform
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  //enable cors to resolve conflicts with Cross-Origin
  app.enableCors();

  //enable serializacion to active class-transformer funtionality(data control for response)
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  //Swagger for documentation of API
  const config = new DocumentBuilder()
    .setTitle('Library API')
    .setDescription('API for stock management of books to small libraries')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('library/api/v1/docs', app, document);
}
bootstrap();
