import { GameType } from '@/constants';

export interface PlayerGame {
  id: string;
  amount?: number;
  playerId?: string;
  gameId?: string;
}

export interface Player {
  id: string;
  name: string;
  color: string;
  username?: string;
  totalPoints?: number;
  avatarUrl?: string;
  games?: PlayerGame[];
}

export interface Game {
  id: string;
  type: GameType;
  winnerId?: string;
  winnerName?: string;
  scoreValue?: number;
  discardId?: string;
  discardName?: string;
  players?: PlayerGame[];
}

export interface ScoreRate {
  label: string;
  baseValue: number;
  color: string;
}
