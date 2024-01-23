import { RouteConfiguration } from '@self/api-core';

export const GetPetByIdConfig = new RouteConfiguration(
  'GET',
  '/api/pets/pet-page/:id'
);
