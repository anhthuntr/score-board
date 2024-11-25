import { ScoreRate } from '@/types';

export const scoreRates: ScoreRate[] = [
  { label: '1', baseValue: 4, color: 'yellow' },
  { label: '2', baseValue: 8, color: 'yellow' },
  { label: '3', baseValue: 16, color: 'yellow' },
  { label: '4 - 6', baseValue: 32, color: 'yellow' },
  { label: '7 - 9', baseValue: 64, color: 'yellow' },
  { label: '10 - 13', baseValue: 128, color: 'yellow' }
];

export enum GameType {
  Mahjong,
  TienLen
}
