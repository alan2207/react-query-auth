import * as React from 'react';
import { Auth } from './components/Auth';
import { UserInfo } from './components/UserInfo';
import { AuthLoader, AuthProvider } from './lib/auth';
import { ReactQueryProvider } from './lib/react-query';

export default function SampleApp() {
  return (
    <div style={containerStyles}>
      <ReactQueryProvider>
        <AuthProvider>
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
            renderFallback={() => <Auth />}
          >
            <UserInfo />
          </AuthLoader>
        </AuthProvider>
      </ReactQueryProvider>
    </div>
  );
}

const containerStyles: React.CSSProperties = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'strech',
  fontFamily: 'sans-serif',
  border: '1px solid black',
  width: '100%',
  maxWidth: '480px',
  margin: '0 auto',
  padding: '32px',
  gap: '16px',
};
