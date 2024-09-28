import { IsEmail, IsEnum, IsString } from 'class-validator';
import { Roles } from 'src/common/constants/role.enum';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(Roles)
  role: Roles;

  @IsString()
  api_key: string;
}
