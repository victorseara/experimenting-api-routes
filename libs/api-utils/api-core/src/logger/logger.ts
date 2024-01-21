import { LevelWithSilent, pino } from 'pino';
import pretty from 'pino-pretty';
import { inject, singleton } from 'tsyringe';
import type { IApiLogger } from './logger.types';
import { SharedInjectionKeys } from '../injection-keys';
import { TRouterConfiguration } from '../server';

@singleton()
export class ApiLogger implements IApiLogger {
  constructor(
    @inject(SharedInjectionKeys.LogLevel)
    private readonly logLevel: TRouterConfiguration['log']
  ) {}

  getLogger(name: string): pino.Logger {
    if (process.env.NODE_ENV === 'test') return pino({ name, level: 'silent' });

    if (process.env.NODE_ENV === 'production')
      return pino({ name, level: 'info' });

    return pino(
      {
        name,
        level: this.logLevel ?? 'silent',
      },
      pretty()
    );
  }
}
