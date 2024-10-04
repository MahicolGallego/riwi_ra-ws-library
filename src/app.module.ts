import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookModule } from './books/book.module';
import { PermissionModule } from './permissions/permission.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'crypto';

function isDevelopmentEnv() {
  return (
    (process.env.NODE_ENV || 'development').trim().toLowerCase() ===
    'development'
  );
}

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

        transport: isDevelopmentEnv()
          ? {
              targets: [
                {
                  target: 'pino-pretty', // define el formateador a usar para los logs
                  options: {
                    messageKey: 'message', // garantiza que el formateador(pino-pretty) use la clave message en vez del msg por
                    // defecto cuando fomatea los logs, mas legible/amigable
                    translateTime: 'yyyy-mm-dd, h:MM:ss TT',
                    ignore: 'pid,hostname', // Ignorar información
                  },
                },
                {
                  target: 'pino-rotating-file-stream',
                  options: {
                    filename: `app-${new Date().getFullYear()}-month-${new Date().getMonth() + 1}.log`, // Required
                    path: './logs', // Required
                    size: '10M',
                    maxSize: '1G',
                    interval: '1d',
                    maxFiles: 36,
                  },
                },
              ],
            }
          : undefined,
        messageKey: 'message', // le pasa al transport el log utilizando la clave message, en vez del msg por
        // defecto, este es mas legible y comun
        // Añadir un id unico a cada request para la trazabilidad
        genReqId: () => {
          return randomUUID();
        },
        // Para identificar ese id como correlation id
        customAttributeKeys: { reqId: 'correlation_id' },
        // Para un formato corto que incluya solo el id generado
        quietReqLogger: true,
        autoLogging: false, // eliminar logs automaticos, solo ver los que se declaran

        serializers: {
          // No devuelva la toda la info de req y res en los log
          req: () => undefined,
          res: () => undefined,
        },

        // Para formato de tiempo timestamps en formato mas amigable
        timestamp: () => {
          const now = new Date();
          const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
          return `,"time":"${formattedDate}"`;
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
