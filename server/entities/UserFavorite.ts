import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Video } from './Video';

@Entity()
export class UserFavorite {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: string;

  @ManyToOne(() => Video)
  @JoinColumn()
  video!: Video;

  @Column()
  videoId!: number;
} 