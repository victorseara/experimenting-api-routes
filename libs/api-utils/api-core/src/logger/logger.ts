import { pino } from 'pino';
import pretty from 'pino-pretty';
import { inject, singleton } from 'tsyringe';
import { CoreInjectionKeys } from '../core-injection-keys';
import { TRouterConfiguration } from '../server';
import type { IApiLogger } from './logger.types';

@singleton()
export class ApiLogger implements IApiLogger {
  constructor(
    @inject(CoreInjectionKeys.LogLevel)
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
      pretty({
        ignore: 'time,pid,hostname,req,config',
        singleLine: true,
      })
    );
  }
}
