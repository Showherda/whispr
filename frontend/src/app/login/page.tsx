'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';

export default function LoginPage() {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [e, setE] = useState('');
  const router = useRouter();

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    try {
      await api.post('/api/auth/login', { username: u, password: p });
      router.push('/');
    } catch (err: any) {
      setE(err.response?.data?.detail ?? 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <form onSubmit={submit} className="bg-white p-8 rounded shadow max-w-sm w-full">
        <h1 className="text-2xl mb-4 text-center dark:text-black">Sign In</h1>
        <input placeholder="Username" className="w-full p-2 mb-4 border rounded" value={u} onChange={e => setU(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full p-2 mb-4 border rounded" value={p} onChange={e => setP(e.target.value)} />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
        {e && <p className="mt-4 text-red-500 text-center">{e}</p>}
      </form>
    </div>
  );
}
