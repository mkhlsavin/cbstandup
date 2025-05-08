import { Video } from '../entities/Video';
import { VideoTag, VideoDifficulty } from './enums';

export { VideoTag, VideoDifficulty };

export interface UserFavorite {
  id: number;
  user_id: number;
  video_id: number;
  video?: Video;
  created_at: Date;
}
