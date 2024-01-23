import { useGetPetById } from '../wire-up/get-pet-by-id.query';
import { useRouter } from 'next/router';

export function PetPage() {
  const route = useRouter();
  const id = route.query.id as string;

  const pet = useGetPetById(id);

  return <div>{JSON.stringify(pet)}</div>;
}
