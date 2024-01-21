import { useListAvailablePets } from '../wire-up/list-available-pets.query';

export function HomePage() {
  const availablePets = useListAvailablePets();

  return (
    <div>
      <h1>Available Pets</h1>
      <ul
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: 0,
        }}
      >
        {availablePets?.map((pet, index) => (
          <li
            key={pet.name + '-' + index}
            style={{
              display: 'flex',
              background: 'lightgray',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <h3>{pet.name}</h3>
            <div>{pet.images}</div>
            <div>{pet.status}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
