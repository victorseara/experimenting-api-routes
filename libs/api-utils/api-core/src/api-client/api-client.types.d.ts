import { NextApiRequest, GetServerSidePropsContext } from 'next';

export type SSRRequest = NextApiRequest | GetServerSidePropsContext['req'];
