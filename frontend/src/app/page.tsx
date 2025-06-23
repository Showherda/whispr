'use client';
import { useEffect, useState } from 'react';
import api from '../lib/api';

type Episode = {
  id: number;
  topic: string;
  persona: string;
  transcript: string;
  audio_url: string;
  timestamp: string;
};

export default function HomePage() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [eps, setEps] = useState<Episode[]>([]);
  const [topic, setTopic] = useState('');
  const [persona, setPersona] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/api/auth/me').then(r => setUser(r.data)).catch(() => {});
    api.get('/api/episodes').then(r => setEps(r.data));
  }, []);

  const gen = async () => {
    if (!topic || !persona) return;
    setLoading(true);
    try {
      const res = await api.post<Episode>('/api/generate', { topic, persona });
      setEps([res.data, ...eps]);
      setTopic('');
      setPersona('');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await api.post('/api/auth/logout');
    setUser(null);
  };

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Please <a href="/login" className="text-blue-600 underline">login</a>.</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <header className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold">Podcast Generator</h1>
        <div>
          <span className="mr-4">Hello, {user.username}</span>
          <button onClick={logout} className="text-red-500">Logout</button>
        </div>
      </header>

      <section className="bg-white p-6 rounded shadow mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic"
                 className="p-2 border rounded" />
          <input value={persona} onChange={e => setPersona(e.target.value)} placeholder="Persona"
                 className="p-2 border rounded" />
        </div>
        <button onClick={gen} className="mt-4 w-full bg-blue-600 text-white py-2 rounded" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Podcast'}
        </button>
      </section>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 backdrop-blur-sm bg-black/30" />
          <div className="relative bg-white dark:bg-gray-900 p-8 rounded shadow text-center">
            <div className="mb-4 animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-lg">Generating your podcast...</p>
          </div>
        </div>
      )}

      <section className="space-y-6 podcast-list">
        {eps.map(ep => (
          <div key={ep.id} className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold">{ep.topic}</h2>
            <p className="text-gray-500 text-sm">By {ep.persona} on {new Date(ep.timestamp).toLocaleString()}</p>
            <p className="mt-2">{ep.transcript}</p>
            <audio controls src="/fake_podcast.mp3" className="mt-4 w-full" />
          </div>
        ))}
      </section>
    </div>
  );
}
