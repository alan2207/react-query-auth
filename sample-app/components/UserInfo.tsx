import * as React from 'react';
import { useAuth } from '../lib/auth';

export function UserInfo() {
  const { user, logout } = useAuth();

  return (
    <>
      {user.isFetching ? (
        <h2>Refetching User...</h2>
      ) : (
        <h2>Welcome {user.data?.name}</h2>
      )}
      <Button onClick={() => logout.mutateAsync()}>Log Out</Button>
      <Button disabled={user.isFetching} onClick={() => user.refetch()}>
        {user.isFetching ? 'Refetching' : 'Refetch'}
      </Button>
    </>
  );
}

const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      {...props}
      style={{
        fontSize: '1.2rem',
        borderRadius: '4px',
        background: 'white',
        border: '1px solid black',
        cursor: 'pointer',
      }}
    />
  );
};
