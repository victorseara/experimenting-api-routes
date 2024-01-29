import type { GetServerSideProps } from 'next';
import { useGetCompanySettingsQuery } from '../hooks/use-get-company-settings.query';

export function CompanySettingsPage() {
  const data = useGetCompanySettingsQuery();

  return (
    <div>
      <h1>CompanySettings</h1>
      <div>{JSON.stringify(data)}</div>
    </div>
  );
}

export const companySettingsSsrProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  };
};
