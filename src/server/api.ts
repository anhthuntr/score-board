/* eslint-disable no-alert */
import { Player, Game, PlayerGame } from '@/types';
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
      .select(`id, username, name, color, totalPoints, avatarUrl`)
      .order('name');

    return handleQuery<Player[]>(query);
  },

  async addMahjongScores(e: Game, pg: PlayerGame[]) {
    // add game
    const query = supabase.from('games').insert([e]).select('id').single();

    const newGame = await handleQuery<Game>(query);

    // add player games record
    const playerGamesQuery = supabase
      .from('player_games')
      .insert(pg?.map((i) => ({ ...i, gameId: newGame.id })))
      .select('id');

    return handleQuery<PlayerGame>(playerGamesQuery);
  },

  async updatePlayersPoints(e: Player[]) {
    console.log(e);
    const updatePromises = e.map((p) => {
      const query = supabase
        .from('players')
        .update(p)
        .eq('id', p.id)
        .select(`id`);

      return handleQuery<Player>(query);
    });
    return Promise.all(updatePromises);
  }
};
