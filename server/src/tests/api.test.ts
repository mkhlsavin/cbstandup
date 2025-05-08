import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { AppModule } from '../app.module';
import { VideoTag } from '../types';

describe('API Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /videos', () => {
    it('should return all videos', async () => {
      const response = await supertest(app.getHttpServer()).get('/videos').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('title');
        expect(response.body[0]).toHaveProperty('url');
        expect(response.body[0]).toHaveProperty('tag');
        expect(response.body[0]).toHaveProperty('description');
        expect(response.body[0]).toHaveProperty('difficulty');
        expect(response.body[0]).toHaveProperty('created_at');
        expect(response.body[0]).toHaveProperty('updated_at');
      }
    });
  });

  describe('GET /videos/tag/:tag', () => {
    it('should return videos by valid tag', async () => {
      const tag = VideoTag.PROMO;
      const response = await supertest(app.getHttpServer())
        .get(`/videos/tag/${encodeURIComponent(tag)}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0].tag).toBe(tag);
      }
    });

    it('should return 400 for invalid tag', async () => {
      const invalidTag = 'invalid_tag';
      await supertest(app.getHttpServer())
        .get(`/videos/tag/${encodeURIComponent(invalidTag)}`)
        .expect(400);
    });
  });

  describe('GET /favorites/:userId', () => {
    it('should return user favorites', async () => {
      const userId = '123';
      const response = await supertest(app.getHttpServer()).get(`/favorites/${userId}`).expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('title');
        expect(response.body[0]).toHaveProperty('url');
        expect(response.body[0]).toHaveProperty('tag');
      }
    });
  });

  describe('POST /favorites', () => {
    it('should add video to favorites', async () => {
      const userId = '123';
      const videoId = 1;

      const response = await supertest(app.getHttpServer())
        .post('/favorites')
        .send({ userId, videoId })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('telegram_user_id', userId);
      expect(response.body).toHaveProperty('video_id', videoId);
    });

    it('should return 500 for invalid video id', async () => {
      const userId = '123';
      const invalidVideoId = 999999;

      await supertest(app.getHttpServer())
        .post('/favorites')
        .send({ userId, videoId: invalidVideoId })
        .expect(500);
    });
  });

  describe('DELETE /favorites/:userId/:videoId', () => {
    it('should remove video from favorites', async () => {
      const userId = '123';
      const videoId = 1;

      await supertest(app.getHttpServer()).delete(`/favorites/${userId}/${videoId}`).expect(204);
    });

    it('should return 404 for non-existent favorite', async () => {
      const userId = '123';
      const nonExistentVideoId = 999999;

      await supertest(app.getHttpServer())
        .delete(`/favorites/${userId}/${nonExistentVideoId}`)
        .expect(404);
    });
  });
});
