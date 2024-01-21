import type { TRouteResponse } from '@self/api-core';

export type AvailablePets = {
  id?: number;
  category?: { id?: number; name?: string };
  name: string;
  images: string[];
  status?: 'available' | 'pending' | 'sold';
};

export type AvailablePetsResult = AvailablePets[];
export type AvailablePetsResponse = TRouteResponse<AvailablePetsResult>;
