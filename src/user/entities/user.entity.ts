import { Roles } from 'src/common/constants/role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'varchar', unique: true, length: 30, nullable: false })
  email: string;

  @Column({ type: 'enum', enum: Roles, default: Roles.user })
  role: Roles;

  @Column({ type: 'varchar', unique: true, length: 30, nullable: false })
  api_key: string;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
