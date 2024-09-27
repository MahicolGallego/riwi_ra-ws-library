import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Library {
  @PrimaryColumn({ type: 'varchar', nullable: false })
  isbn: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  author: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  gender: string;

  @Column({ type: 'date', nullable: false })
  publish_date: Date;
}
