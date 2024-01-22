import { useEffect, useMemo, useState } from 'react';
import { ListAvailablePetsClient } from '../server/list-available-pets/list-available-pets.client';
import { AvailablePetsResponse } from '../server/list-available-pets/list-available-pets.schema';
import axios from 'axios';

export function useListAvailablePets() {
  const [client] = useState(() => axios.create({}));
  const [data, setData] = useState<AvailablePetsResponse | null>(null);

  const listAvaliablePets = useMemo(
    () => new ListAvailablePetsClient(client),
    [client]
  );

  useEffect(() => {
    listAvaliablePets.execute().then((response) => setData(response));
  }, [listAvaliablePets]);

  return data;
}
