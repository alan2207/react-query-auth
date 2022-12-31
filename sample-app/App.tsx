import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthScreen } from './components/auth-screen';
import { UserInfo } from './components/user-info';
import { AuthLoader } from './lib/auth';
import { Container } from './components/ui';

const SampleApp = () => {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <Container>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <AuthLoader
          renderLoading={() => <div>Loading ...</div>}
          renderError={({ error }) => (
            <div
              style={{
                color: 'tomato',
              }}
            >
              {JSON.stringify(error, null, 2)}
            </div>
          )}
          renderUnauthenticated={() => <AuthScreen />}
        >
          <UserInfo />
        </AuthLoader>
      </QueryClientProvider>
    </Container>
  );
};

export default SampleApp;
