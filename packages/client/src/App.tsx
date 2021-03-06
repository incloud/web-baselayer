import React, { FunctionComponent } from 'react';
import { ApolloProvider } from 'react-apollo-hooks';
import { Router } from 'react-router-dom';
import { Baselayer } from './Baselayer';
import { FullscreenSpinner } from './components/FullscreenSpinner';
import { GlobalStyle } from './GlobalStyle';
import { useBootstrapApplication } from './hooks/useBootstrapApplication';
import { theme, ThemeProvider } from './theme';

export const App: FunctionComponent<{}> = () => {
  const { client, history } = useBootstrapApplication();

  if (client == null) {
    return <FullscreenSpinner />;
  }

  return (
    <ThemeProvider theme={theme}>
      <>
        <GlobalStyle />
        <ApolloProvider client={client}>
          <Router history={history}>
            <Baselayer />
          </Router>
        </ApolloProvider>
      </>
    </ThemeProvider>
  );
};
