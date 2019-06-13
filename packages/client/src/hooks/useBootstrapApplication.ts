import { createBrowserHistory, History } from 'history';
import { useEffect, useState } from 'react';
import { BaselayerClient, createApolloClient } from '../util/ApolloClient';

type NullableClient = BaselayerClient | null;

export function useBootstrapApplication() {
  const [history] = useState(createBrowserHistory());
  const [client, setClient] = useState<NullableClient>(null);

  useEffect(() => {
    (async () => {
      const newClient = await createApolloClient();
      setClient(newClient);
    })();
  }, []);

  return {
    client,
    history,
  };
}
