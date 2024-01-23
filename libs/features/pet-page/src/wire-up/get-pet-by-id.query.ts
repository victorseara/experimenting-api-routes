import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { GetPetByIdClient } from '../server/get-pet-by-id/get-pet-by-id.client';
import { GetPetByIdResponse } from '../server/get-pet-by-id/get-pet-by-id.schema';

export function useGetPetById(id: string) {
  const [client] = useState(() => axios.create({}));
  const [data, setData] = useState<GetPetByIdResponse | null>(null);

  const getPetById = useMemo(() => new GetPetByIdClient(client), [client]);

  useEffect(() => {
    if (!id) return;
    console.log({ id });
    getPetById.execute({ id }).then((response) => setData(response));
  }, [getPetById, id]);

  return data;
}
