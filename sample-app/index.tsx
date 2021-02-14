import { App } from './App';
import { AuthProvider } from './lib/auth';
import { ReactQueryProvider } from './lib/react-query';

export default function SampleApp() {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ReactQueryProvider>
  );
}
