import { RouteConfiguration } from '@self/api-core/server';

export const listAvailablePetsConfig = new RouteConfiguration(
  'GET',
  '/api/home-page/list-available-pets'
);
