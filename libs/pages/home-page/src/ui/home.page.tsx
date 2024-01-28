import { useHomeDataQuery } from '../hooks/use-home-data.query';

export function HomePage() {
  const data = useHomeDataQuery();

  return (
    <div>
      <h1>Welcome</h1>
      <div>{JSON.stringify(data)}</div>
    </div>
  );
}
