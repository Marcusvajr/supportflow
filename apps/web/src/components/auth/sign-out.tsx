'use client';

import { useClerk } from '@clerk/nextjs';
import { useState } from 'react';

export function SignOut() {
  const { signOut } = useClerk();
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  async function exit() {
    setPending(true);
    setFailed(false);
    try {
      await signOut({ redirectUrl: '/sign-in' });
    } catch {
      setFailed(true);
      setPending(false);
    }
  }

  return (
    <div>
      <button className="secondary-action" type="button" onClick={exit} disabled={pending}>
        {pending ? 'Saindo…' : 'Sair da conta'}
      </button>
      {failed && <p role="alert">Não foi possível sair. Tente novamente.</p>}
    </div>
  );
}
