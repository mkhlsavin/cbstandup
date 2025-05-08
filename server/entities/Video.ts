import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  url!: string;

  @Column()
  tag!: string;
} 