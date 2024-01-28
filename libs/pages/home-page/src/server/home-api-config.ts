import { RouteConfiguration } from '@self/api-core';

export const GetHomeDataConfig = new RouteConfiguration(
  'GET',
  '/api/home-page'
);

export const PostHomeData = new RouteConfiguration('POST', '/api/home-page');
