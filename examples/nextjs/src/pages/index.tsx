import { Container } from '@/components/ui';
import { AuthLoader } from '@/lib/auth';
import { AuthScreen } from '@/components/auth-screen';
import { UserInfo } from '@/components/user-info';

export default function Home() {
  return (
    <Container>
      <AuthLoader
        renderLoading={() => <div>Loading ...</div>}
        renderUnauthenticated={() => <AuthScreen />}
      >
        <UserInfo />
      </AuthLoader>
    </Container>
  );
}
