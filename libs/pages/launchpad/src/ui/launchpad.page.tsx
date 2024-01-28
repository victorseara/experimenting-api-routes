import { useGetLaunchpadQuery } from '../hooks/use-get-launchpad.query';

export function LaunchpadPage() {
  const data = useGetLaunchpadQuery();

  return (
    <div>
      <h1>Launchpad</h1>
      <div>{JSON.stringify(data)}</div>
    </div>
  );
}

export const launchpadSsrProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  };
};
