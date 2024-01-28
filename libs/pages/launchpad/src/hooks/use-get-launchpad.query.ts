import React from 'react';
import axios from 'axios';
import { TGetLaunchpadResponse } from '../server/get-launchpad/get-launchpad.schema';
import { GetLaunchpadClient } from '../server/get-launchpad/get-launchpad.client';

export function useGetLaunchpadQuery() {
  const [data, setData] = React.useState<TGetLaunchpadResponse | null>(null);

  const httpClient = React.useMemo(() => axios.create({}), []);
  const routeClient = React.useMemo(
    () => new GetLaunchpadClient(httpClient),
    [httpClient]
  );

  React.useEffect(() => {
    routeClient.execute().then((response) => setData(response));
  }, [routeClient]);

  return data;
}
