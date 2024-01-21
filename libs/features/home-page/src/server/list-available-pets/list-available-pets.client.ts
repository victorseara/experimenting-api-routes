import { AbstractApiClient } from '@self/api-core';
import { ListAvailablePetsConfig } from './list-available-pets.config';
import {
  AvailablePetsResponse,
  AvailablePetsResult,
} from './list-available-pets.schema';

export class ListAvailablePetsClient extends AbstractApiClient<
  undefined,
  AvailablePetsResult
> {
  async execute() {
    const response = await this.client.get<AvailablePetsResponse>(
      ListAvailablePetsConfig.path
    );

    return response.data.result!;
  }
}
