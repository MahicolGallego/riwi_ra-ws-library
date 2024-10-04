import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Roles } from 'src/common/constants/roles.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  // Define properties of format responses with users for swagger documentation with @ApiProperty decorator
  @ApiProperty()
  // Expose properties for serialization. It will be included in the response when converting the entity to JSON.
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Expose()
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @ApiProperty()
  @Expose()
  @Column({ type: 'varchar', unique: true, length: 30, nullable: false })
  email: string;

  @ApiProperty()
  @Expose()
  @Column({ type: 'enum', enum: Roles, default: Roles.user })
  role: Roles;

  @ApiProperty()
  @Expose()
  @Column({ type: 'varchar', unique: true, length: 40, nullable: false })
  api_key: string;

  // Exclude properties from serialization. It will not be included in the response when converting the entity to JSON.
  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;
}
