import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ErrorManager } from 'src/common/filters/error-manage.filter';
import { UsersService } from 'src/user/users.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  //inject dependencies through the constructor
  constructor(
    private readonly usersService: UsersService,
    @InjectPinoLogger(ApiKeyGuard.name) private readonly logger: PinoLogger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Get the request object from the current execution context
      const request = context.switchToHttp().getRequest();
      // Extract the user api key from the request headers
      const userApiKey = request.headers['x-api-key'];

      this.logger.info('Attempting to authenticate using API key');

      // Throw error if the user api key is not provided in the request headers
      if (!userApiKey) {
        this.logger.warn('No API key provided in the request headers');
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'No provided user api key',
        });
      }

      this.logger.debug(`API key received: ${userApiKey}`);

      // Find the user associated with the provided user api key
      const foundUser = await this.usersService.findByApiKey(userApiKey);

      // Throw error if the user associated with the provided api key does not exist
      if (!foundUser) {
        this.logger.warn(`Invalid API key: ${userApiKey}`);
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'Invalid user api key',
        });
      }

      this.logger.info(
        `User authenticated successfully with API key: ${userApiKey}`,
      );

      // Set the found user in the request for further processing in other components
      request.user = foundUser;

      return true;
    } catch (error) {
      this.logger.error(`Authentication failed`, error);
      // If an error occurs, throw a signature error using the custom ErrorManager
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      }
      throw ErrorManager.createSignatureError('an unexpected error occurred');
    }
  }
}
