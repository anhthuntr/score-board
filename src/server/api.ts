/* eslint-disable no-alert */
import { Player } from '@/types';
import { supabase } from './supabase';

async function handleQuery<T>(query: any): Promise<T> {
  try {
    const { data, error, status } = await query;

    if (error && status !== 406) throw error;

    if (data) {
      return data;
    }

    throw new Error('No data returned from query');
  } catch (error: any) {
    console.error('Supabase Query Error:', error.message);
    throw error;
  }
}

export const api = {
  async getAllPlayers(): Promise<Player[]> {
    const query = supabase
      .from('players')
      .select(`id, username, name, color, totalPoints, avatarUrl`);

    return handleQuery<Player[]>(query);
  },

  async addMahjongScores(): Promise<Player[]> {
    const query = supabase
      .from('players')
      .select(`id, username, name, color, totalPoints`);

    return handleQuery<Player[]>(query);
  }
};
