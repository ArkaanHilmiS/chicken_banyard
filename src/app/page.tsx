'use client';

import { supabase } from '@/utils/supabaseClient';

export default function Home() {
  const registerUser = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: 'test@email.com',
      password: 'password123',
    });
    console.log(data, error);
  };

  return (
    <main>
      <button onClick={registerUser}>Register</button>
    </main>
  );
}
