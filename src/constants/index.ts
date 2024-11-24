import { ScoreRate } from '@/types';

export const colors = {
  background: '#22272A',
  green: '#8CC648',
  black: '#0B0D0E',
  dark: '#171A1D',
  medium: '#22272A',
  light: '#394046',
  red: '#e24149',
  redHoverBg: '#ee4b53',
  redHoverBorder: '#EF5258',
  redBright: '#FF000D',
  orange: '#905E15',
  orangeHoverBg: '#A76911',
  orangeHoverBorder: '#FF9500',
  blue: '#448AFF',
  yellow: '#6B6534'
};
export const customTheme = {
  dark: true,
  colors
};

export const scoreRates: ScoreRate[] = [
  { label: '1', baseValue: 4, color: 'yellow' },
  { label: '2', baseValue: 8, color: 'yellow' },
  { label: '3', baseValue: 16, color: 'yellow' },
  { label: '4 - 6', baseValue: 32, color: 'yellow' },
  { label: '7 - 9', baseValue: 64, color: 'yellow' },
  { label: '10 - 13', baseValue: 128, color: 'yellow' }
];
