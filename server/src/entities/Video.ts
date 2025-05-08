import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { VideoTag, VideoDifficulty } from '../types/enums';

@Entity('video')
export class Video {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  url!: string;

  @Column({
    type: 'enum',
    enum: VideoTag,
    default: VideoTag.PROMO,
  })
  tag!: VideoTag;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: VideoDifficulty,
    nullable: true,
  })
  difficulty?: VideoDifficulty;

  @Column({
    name: 'created_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at!: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at!: Date;

  constructor(partial: Partial<Video>) {
    Object.assign(this, partial);
  }
}
