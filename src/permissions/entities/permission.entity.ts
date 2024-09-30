import { Roles } from 'src/common/constants/roles.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('permissions')
export class Permission {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  entity: string;

  @PrimaryColumn({ type: 'enum', enum: Roles })
  role: Roles;

  @Column({ type: 'boolean' })
  write: boolean;

  @Column({ type: 'boolean' })
  read: boolean;

  @Column({ type: 'boolean' })
  update: boolean;

  @Column({ type: 'boolean' })
  delete: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
