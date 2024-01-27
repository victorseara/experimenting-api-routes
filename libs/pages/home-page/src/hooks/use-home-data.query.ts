import axios from 'axios';
import React from 'react';
import { TGetHomeDataResponse } from '../server/get-home-data/get-home-data.schema';
import { GetHomeDataClient } from '../server/get-home-data/get-home-data.client';

export function useHomeDataQuery() {
  const [data, setData] = React.useState<TGetHomeDataResponse | null>(null);

  const httpClient = React.useMemo(() => axios.create({}), []);
  const routeClient = React.useMemo(
    () => new GetHomeDataClient(httpClient),
    [httpClient]
  );

  React.useEffect(() => {
    routeClient.execute().then((response) => setData(response));
  }, [routeClient]);

  return data;
}
