import React from 'react';
import axios from 'axios';
import { TGetCompanySettingsResponse } from '../server/get-company-settings/get-company-settings.schema';
import { GetCompanySettingsClient } from '../server/get-company-settings/get-company-settings.client';

export function useGetCompanySettingsQuery() {
  const [data, setData] = React.useState<TGetCompanySettingsResponse | null>(
    null
  );

  const httpClient = React.useMemo(() => axios.create({}), []);
  const routeClient = React.useMemo(
    () => new GetCompanySettingsClient(httpClient),
    [httpClient]
  );

  React.useEffect(() => {
    routeClient.execute().then((response) => setData(response));
  }, [routeClient]);

  return data;
}
