import { pino } from 'pino';

export interface IApiLogger {
  getLogger(name: string): pino.Logger;
}

export type ILogger = ReturnType<IApiLogger['getLogger']>;
