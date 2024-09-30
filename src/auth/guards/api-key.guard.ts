import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ErrorManager } from 'src/common/filters/error-manage.filter';
import { UsersService } from 'src/user/users.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  //inject dependencies through the constructor
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Get the request object from the current execution context
      const request = context.switchToHttp().getRequest();
      // Extract the user api key from the request headers
      const userApiKey = request.headers['x-api-key'];

      // Throw error if the user api key is not provided in the request headers
      if (!userApiKey) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'No provided user api key',
        });
      }

      // Find the user associated with the provided user api key
      const foundUser = await this.usersService.findByApiKey(userApiKey);

      // Throw error if the user associated with the provided api key does not exist
      if (!foundUser) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'Invalid user api key',
        });
      }

      // Set the found user in the request for further processing in other components
      request.user = foundUser;

      return true;
    } catch (error) {
      // If an error occurs, throw a signature error using the custom ErrorManager
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      }
      throw ErrorManager.createSignatureError('an unexpected error occurred');
    }
  }
}
