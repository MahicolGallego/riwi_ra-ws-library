import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookModule } from './books/book.module';
import { PermissionModule } from './permissions/permission.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

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
        logging: true, // Enable logging of SQL queries (useful for development)
        synchronize: true, // Automatically synchronize the database schema (development only)
        ssl: {
          rejectUnauthorized: false, //Allow non ssl connections(development only)
        },
      }),
    }),

    // Import other modules for the application
    BookModule,
    PermissionModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
