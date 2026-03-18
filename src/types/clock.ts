export type TimeFormat = '12h' | '24h';

export interface ClockTime {
  hours: string;
  minutes: string;
  seconds: string;
}

export interface ClockDigit {
  value: string;
  index: number;
}

export interface ClockHand {
  angle: number;
  length: number;
  width: number;
}

export interface ClockStyle {
  container?: React.CSSProperties;
  digit?: React.CSSProperties;
  hand?: React.CSSProperties;
  wrapper?: React.CSSProperties;
}

export interface FontConfig {
  fontFamily: string;
  fontUrl: string;
  options?: FontFaceDescriptors;
}

export interface TickMark {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  thickness: number;
  isHour: boolean;
}

export interface ClockDimensions {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}
