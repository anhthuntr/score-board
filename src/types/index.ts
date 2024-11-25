import { GameType } from '@/constants';

export interface PlayerGame {
  id?: number;
  amount?: number;
  playerId?: number;
  gameId?: number;
}

export interface Player {
  id?: number;
  name: string;
  color: string;
  username?: string;
  totalPoints?: number;
  avatarUrl?: string;
  games?: PlayerGame[];
}

export interface Game {
  id?: number;
  type: GameType;
  winnerId?: number;
  winnerName?: string;
  scoreValue?: number;
  discardId?: number;
  discardName?: string;
  players?: PlayerGame[];
}

export interface ScoreRate {
  label: string;
  baseValue: number;
  color: string;
}
