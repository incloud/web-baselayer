import { createBrowserHistory, History } from 'history';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { BaselayerClient, createApolloClient } from '../util/ApolloClient';
import { LOGGED_IN_USER } from '../util/LoggedInUser';

type NullableClient = BaselayerClient | null;

export function useBootstrapApplication() {
  const [history] = useState(createBrowserHistory());
  const [client, setClient] = useState<NullableClient>(null);

  useEffect(() => {
    (async () => {
      const newClient = await createApolloClient();
      setClient(newClient);
    })();
  });

  return {
    client,
    history,
  };
}
