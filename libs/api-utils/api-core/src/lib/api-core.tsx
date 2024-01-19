import styles from './api-core.module.css';

/* eslint-disable-next-line */
export interface ApiCoreProps {}

export function ApiCore(props: ApiCoreProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to ApiCore!</h1>
    </div>
  );
}

export default ApiCore;
