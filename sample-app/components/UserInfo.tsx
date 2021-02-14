import { useAuth } from '../lib/auth';

export function UserInfo() {
  const { user, logout } = useAuth();
  return (
    <div>
      Welcome {user.name}
      <button onClick={() => logout()}>Log Out</button>
    </div>
  );
}
