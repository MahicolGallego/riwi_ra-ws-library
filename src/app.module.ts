import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookModule } from './books/book.module';
import { PermissionModule } from './permissions/permission.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from 'nestjs-pino';
import { correlation_id_header } from './common/interceptors/correlation-id.interceptor';
import { ServerResponse, IncomingMessage } from 'http';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Configure the ConfigModule to load environment variables and make it global

    // Set up TypeORM with a dynamic configuration based on environment variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule to access environment variables
      inject: [ConfigService], // Inject ConfigService to retrieve configuration values
      useFactory: (configService: ConfigService) => ({
        type: 'postgres', // Use PostgreSQL as the database type
        host: configService.get<string>('DB_HOST'), // Get the database host from environment variables
        database: configService.get<string>('DB_NAME'), // Get the database name from environment variables
        port: Number(configService.get<number>('DB_PORT')), // Get the database port and convert it to a number
        username: configService.get<string>('DB_USERNAME'), // Get the database username from environment variables
        password: configService.get<string>('DB_PASSWORD'), // Get the database password from environment variables
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // Specify the path for entity files
        // logging: true, // Enable logging of SQL queries (useful for development)
        synchronize: true, // Automatically synchronize the database schema (development only)
        ssl: {
          rejectUnauthorized: false, //Allow non ssl connections(development only)
        },
      }),
    }),
    // Import and configuration pino logger for generation logs of the API
    LoggerModule.forRoot({
      //  genera logs crudos en formato JSON
      pinoHttp: {
        // configuraciones para la capa de transporte
        // ->  actua en cómo se procesan o formatean los logs antes de ser entregados o visualizados
        transport: {
          target: 'pino-pretty', // define el formateador a usar para los logs
          options: {
            messageKey: 'message', // garantiza que el formateador(pino-pretty) use la clave message en vez del msg por
            // defecto cuando fomatea los logs, mas legible/amigable
          },
        },
        messageKey: 'message', // le pasa al transport el log utilizando la clave message, en vez del msg por
        // defecto, este es mas legible y comun

        // Para que incluya el correlation id de la request al final de todos los logs
        customProps: (req: IncomingMessage) => {
          return {
            correlation_id: req[correlation_id_header],
          };
        },
      },
    }),
    // Import other modules for the application
    BookModule,
    PermissionModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
