import { useHomeDataQuery } from '../hooks/use-home-data.query';

export function HomePage() {
  const data = useHomeDataQuery();

  return (
    <div>
      <h1>Home Page</h1>
      <div>{JSON.stringify(data)}</div>
    </div>
  );
}
