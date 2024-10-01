import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('books')
export class Book {
  // Define properties of format responses with books for swagger documentation with @ApiProperty decorator
  @ApiProperty()
  @Expose() // Expose properties for serialization. It will be included in the response when converting the entity to JSON.
  @PrimaryColumn({ type: 'varchar', nullable: false })
  isbn: string;

  @ApiProperty()
  @Expose()
  @Column({ type: 'varchar', length: 50, nullable: false })
  author: string;

  @ApiProperty()
  @Expose()
  @Column({ type: 'varchar', length: 100, nullable: false })
  title: string;

  @ApiProperty()
  @Expose()
  @Column({ type: 'varchar', nullable: false })
  genre: string;

  @ApiProperty()
  @Expose()
  @Column({ type: 'date', nullable: false })
  publish_date: Date;

  @Exclude() // Exclude properties from serialization. It will not be included in the response when converting the entity to JSON.
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;
}
