import { useEffect, useMemo, useState } from 'react';
import { ListAvailablePetsClient } from '../server/list-available-pets/list-available-pets.client';
import { AvailablePetsResult } from '../server/list-available-pets/list-available-pets.schema';

export function useListAvailablePets() {
  const [data, setData] = useState<AvailablePetsResult | null>(null);

  const client = useMemo(() => new ListAvailablePetsClient(), []);

  useEffect(() => {
    client.execute().then((response) => setData(response));
  }, [client]);

  return data;
}
