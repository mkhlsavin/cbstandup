import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private readonly supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      this.logger.error('Supabase credentials are not set');
      throw new Error('Supabase credentials are not set');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.logger.log('Supabase client initialized');
  }

  async testConnection() {
    try {
      const { data, error } = await this.supabase.from('videos').select('count').limit(1);
      if (error) throw error;
      this.logger.log('Successfully connected to Supabase');
      return true;
    } catch (error) {
      this.logger.error('Failed to connect to Supabase:', error);
      return false;
    }
  }

  // Здесь будут методы для работы с базой данных
  // Например, методы для работы с видео, тегами и т.д.
} 