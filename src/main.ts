import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { CorrelationIdInterceptor } from './common/interceptors/correlation-id.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // implementar el interceptor para configurar header de correration id en todas las solicitudes
  // para seguimiento de logs
  app.useGlobalInterceptors(new CorrelationIdInterceptor());

  // implements pino logger for logging requests and responses in console
  app.useLogger(app.get(Logger));

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
    // add API key as authentication method
    .addApiKey({
      name: 'x-api-key',
      type: 'apiKey',
      in: 'header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/library/api/v1/docs', app, document);

  await app.listen(3000);
}
bootstrap();
