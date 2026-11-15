import React, { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type Row = { id: string; published: boolean };

export const AdminPage: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setRows([]);
      return;
    }
    supabase
      .from('lessons')
      .select('id, published')
      .order('sort_order', { ascending: true })
      .then(({ data }) => setRows((data as Row[]) || []));
  }, [session]);

  const login = async () => {
    setBusy(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (err) setError('Не удалось войти. Проверь почту и пароль.');
    setBusy(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const wrapper = 'max-w-md mx-auto p-4 min-h-screen bg-[#FFF9F6] text-[#34313A]';

  if (checking) {
    return <div className={wrapper}>Загрузка…</div>;
  }

  if (!session) {
    return (
      <div className={wrapper}>
        <h1 className="text-2xl font-bold mb-4">Админ-вход</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
          className="space-y-3"
        >
          <input
            type="email"
            autoComplete="username"
            placeholder="Почта"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl border border-[#F0E4E9] bg-white"
          />
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl border border-[#F0E4E9] bg-white"
          />
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-[#D985A8] text-white font-medium py-3 rounded-2xl"
          >
            {busy ? 'Вход…' : 'Войти'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={wrapper}>
      <h1 className="text-2xl font-bold mb-1">Админ-кабинет</h1>
      <p className="text-sm text-[#817782] mb-4">Вы вошли: {session.user.email}</p>

      <div className="bg-white p-4 rounded-2xl border border-[#F0E4E9] mb-4">
        <h2 className="font-semibold mb-2">Уроки в базе: {rows.length}</h2>
        {rows.length === 0 && <p className="text-sm text-[#817782]">Пока пусто.</p>}
        {rows.map((r) => (
          <p key={r.id} className="text-sm">
            {r.id} — {r.published ? 'опубликован' : 'черновик'}
          </p>
        ))}
      </div>

      <button
        onClick={logout}
        className="w-full bg-white border border-[#F0E4E9] py-3 rounded-2xl text-sm"
      >
        Выйти
      </button>
    </div>
  );
};