import { startLearningMode } from '../services/telegram';
import type { Request, Response } from 'express';

interface StartLearningBody {
  userId: number;
  videoTitle: string;
}

export default async function handler(
  req: Request<unknown, unknown, StartLearningBody>,
  res: Response
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId, videoTitle } = req.body;

    if (!userId || !videoTitle) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    startLearningMode(userId, videoTitle);
    return res.status(200).json({ message: 'Learning mode started' });
  } catch (error) {
    console.error('Error starting learning mode:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
